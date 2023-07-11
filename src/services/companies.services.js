const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require("../models/company.model")
const Staff = require('../models/staff.model');
const responses = require("../utils/response")

async function createCompany (payload) {
    /**
     * Check if name and email and regNo [are already registered
     * Add the company to db
     */
    // const {name, contactEmail, regNo} = payload;
    const foundName = await Company.findOne({name: payload.name});
    if(foundName) {
        return responses.buildFailureResponse("Company Name Already registered", 400)
    }

    const foundEmail = await Company.findOne({contactEmail: payload.contactEmail});
    if(foundEmail) {
        return responses.buildFailureResponse("Company email already registered", 400)
    }

    // now that we have validated our data, let us now create the db

    // const newCompany = new Company(payload);
    // await newCompany.save();

    // OR

    const newCompany = await Company.create(payload)
    return responses.buildSuccessResponse("Company created successfully", 201, newCompany)

}

async function createAdmin (payload) {


    const foundEmailOrPhone = await Staff.findOne({$or: [
      {email: payload.email}, 
      {phone: payload.phone}
    ]})
    if(foundEmailOrPhone) {
        return responses.buildFailureResponse("Staff phone or email duplicate", 400)
    }
    // hashing the password here
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds)
    
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt)
    

    payload.password = hashedPassword
    payload.role = "admin"

    const savedStaff = await Staff.create(payload)
    return responses.buildSuccessResponse("Staff created successfully", 201, savedStaff)
    
}

async function createStaff (payload) {

    const foundEmailOrPhone = await Staff.findOne({$or: [
      {email: payload.email}, 
      {phone: payload.phone}
    ]})
    if(foundEmailOrPhone) {
      return {
            message: "Staff phone or email duplicate",
            statusCode: 400,
            status: "failure"
        }
    }
    // hashing the password here
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds)
    
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt)
    

    payload.password = hashedPassword
    payload.role = "user"

    const savedStaff = await Staff.create(payload)
    return {
            message: "Staff created successfully",
            statusCode: 201,
            status: "success",
            data: savedStaff
        }
    
}

const login = async (payload) => {
    try {
        const foundUser = await Staff.findOne({ email: payload.email}).lean()
        if(!foundUser) {
            return {
                message: "User not found",
                status: "failure",
                statusCode: 400
            }
        }
        if(foundUser.role !== "admin") {
            return responses.buildFailureResponse("Only Admins Allowed", 403)
        }
        const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
        if(!foundPassword) {
            return {
                message: "Password incorrect",
                status: "failure",
                statusCode: 403
            }
        }

        const token = jwt.sign({email: foundUser.email, firstName: foundUser.firstName, role: foundUser.role, _id: foundUser._id}, process.env.JWT_SECRET, {
              expiresIn: '30d'
       })
       foundUser.accessToken = token
       return responses.buildSuccessResponse("Login successful", 200, foundUser)
    } catch (error) {
        return {
            message: "Unable to Login",
            status: "failure",
            statusCode: 500
        }
    }
}

async function getAllCompanies() {
  try {
    const companies = await Company.find();
    return responses.buildSuccessResponse('Successfully fetched all companies', 200, companies);
  } catch (error) {
    return responses.buildFailureResponse('Failed to fetch companies', 500);
  }
}


module.exports = {
    createCompany,
    createAdmin,
    login,
    createStaff,
    getAllCompanies
}