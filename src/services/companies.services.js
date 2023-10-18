const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/company.model');
const Staff = require('../models/staff.model');
const responses = require('../utils/response');
const generateResetPin = require('../utils/generateResetPin');
const sendMail = require('../utils/sendMail');

async function createCompany(payload) {
  /**
   * Check if name and email and regNo [are already registered
   * Add the company to db
   */
  // const {name, contactEmail, regNo} = payload;
  const foundName = await Company.findOne({ name: payload.name });
  if (foundName) {
    return responses.buildFailureResponse(
      'Company Name Already registered',
      400
    );
  }

  const foundEmail = await Company.findOne({
    contactEmail: payload.contactEmail,
  });
  if (foundEmail) {
    return responses.buildFailureResponse(
      'Company email already registered',
      400
    );
  }

  // now that we have validated our data, let us now create the db

  // const newCompany = new Company(payload);
  // await newCompany.save();

  // OR

  const newCompany = await Company.create(payload);
  return responses.buildSuccessResponse(
    'Company created successfully',
    201,
    newCompany
  );
}

async function createAdmin(payload) {
  const foundEmailOrPhone = await Staff.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });
  if (foundEmailOrPhone) {
    return responses.buildFailureResponse(
      'Staff phone or email duplicate',
      400
    );
  }
  // hashing the password here
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  payload.password = hashedPassword;
  payload.role = 'admin';

  const savedStaff = await Staff.create(payload);
  return responses.buildSuccessResponse(
    'Staff created successfully',
    201,
    savedStaff
  );
}

async function createStaff(payload) {
  const foundEmailOrPhone = await Staff.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });
  if (foundEmailOrPhone) {
    return {
      message: 'Staff phone or email duplicate',
      statusCode: 400,
      status: 'failure',
    };
  }
  // hashing the password here
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  payload.password = hashedPassword;
  payload.role = 'user';

  const savedStaff = await Staff.create(payload);
  return {
    message: 'Staff created successfully',
    statusCode: 201,
    status: 'success',
    data: savedStaff,
  };
}

const login = async (payload) => {
  try {
    const foundUser = await Staff.findOne({ email: payload.email }).lean();
    if (!foundUser) {
      return {
        message: 'User not found',
        status: 'failure',
        statusCode: 400,
      };
    }
    if (foundUser.role !== 'admin') {
      return responses.buildFailureResponse('Only Admins Allowed', 403);
    }
    const foundPassword = await bcrypt.compare(
      payload.password,
      foundUser.password
    );
    if (!foundPassword) {
      return {
        message: 'Password incorrect',
        status: 'failure',
        statusCode: 403,
      };
    }

    const token = jwt.sign(
      {
        email: foundUser.email,
        firstName: foundUser.firstName,
        role: foundUser.role,
        _id: foundUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
    foundUser.accessToken = token;
    return responses.buildSuccessResponse('Login successful', 200, foundUser);
  } catch (error) {
    return {
      message: 'Unable to Login',
      status: 'failure',
      statusCode: 500,
    };
  }
};

async function getAllCompanies(query = {}) {
  try {
    const paginate = {
      skip: 0,
      limit: 10,
    };
    if (query.skip && query.limit) {
      paginate.skip = query.skip;
      paginate.limit = query.limit;

      delete query.skip;
      delete query.limit;
    }
    console.log({ query });
    const companies = await Company.find(query)
      .skip(paginate.skip)
      .limit(paginate.limit);
    const totalCounts = await Company.countDocuments(query);
    return responses.buildSuccessResponse(
      'Successfully fetched all companies',
      200,
      {
        data: companies,
        page: Number(paginate.skip) + 1,
        noPerPage: Number(paginate.limit),
        totalCounts,
      }
    );
  } catch (error) {
    return responses.buildFailureResponse('Failed to fetch companies', 500);
  }
}

const verifyUser = async (payload) => {
  const { user } = payload;
};

const forgotPassword = async (payload) => {
  /**
   * Check or verify email address
   * Generate reset pin
   * Update the user with the reset pin (add reset pin to user document)
   * Send reset pin to user email
   * */

  const emailFound = await Staff.findOne({ email: payload.email });
  if (!emailFound) {
    return responses.buildFailureResponse('Email not found', 400);
  }
  const resetPin = generateResetPin();
  const updatedUser = await Staff.findByIdAndUpdate(
    { _id: emailFound._id },
    { resetPin: resetPin },
    { new: true }
  );

  const forgotPasswordPayload = {
    to: updatedUser.email,
    subject: 'RESET PASSWORD',
    pin: resetPin,
  };

  await sendMail.sendForgotPasswordMail(forgotPasswordPayload);
  return responses.buildSuccessResponse(
    'Forgot Password Successful',
    200,
    updatedUser
  );
};

const resetPassword = async (payload) => {
  /**
   * Validate if user exists with reset pin
   * Hash the new password
   * Store the new hashed password
   */

  const foundUserAndPin = await Staff.findOne({
    email: payload.email,
    resetPin: payload.resetPin,
  });
  if (!foundUserAndPin) {
    return responses.buildFailureResponse('Reset Pin Invalid', 400);
  }

  // hashing the password here
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  const updatedUser = await Staff.findByIdAndUpdate(
    { _id: foundUserAndPin._id },
    { password: hashedPassword, resetPin: null },
    { new: true }
  );

  return responses.buildSuccessResponse(
    'Password Reset Successful',
    200,
    updatedUser
  );
};

const findStaff = async (query) => {
  try {
    const searchKeyword = query.search
      ? {
          $or: [
            { firstName: { $regex: query.search, $options: 'i' } },
            { lastName: { $regex: query.search, $options: 'i' } },
            { phone: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
          ],
          company: query.company,
        }
      : {};

    const foundStaff = await Staff.find(searchKeyword);
    return responses.buildSuccessResponse('Staff Fetched', 200, foundStaff);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCompany,
  createAdmin,
  login,
  createStaff,
  getAllCompanies,
  forgotPassword,
  resetPassword,
  findStaff,
};
