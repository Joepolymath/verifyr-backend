const companyServices = require("../services/companies.services")

// Create account function
const createAccount = async (req, res) => {
  const data = await companyServices.createCompany(req.body)
  res.status(data.statusCode).json(data)
};
//create admin function
const createAdmin = async (req, res) => {
  const data = await companyServices.createAdmin(req.body)
  res.status(data.statusCode).json(data)
};

//createStaff function
const createStaff = async (req, res) => {
  const data = await companyServices.createStaff(req.body)
  res.status(data.statusCode).json(data)
};

//login function
const login = async (req, res) => {
  const data = await companyServices.login(req.body)
  res.status(data.statusCode).json(data)
};

//get companies function
const getAllCompanies = async (req, res) => {
    const data = await companyServices.getAllCompanies();
    res.status(data.statusCode).json(data);
 
};
//get companies function
const forgotPassword = async (req, res) => {
    const data = await companyServices.forgotPassword(req.body);
    res.status(data.statusCode).json(data);
 
};



module.exports = { createAccount, createAdmin, login, createStaff, getAllCompanies, forgotPassword };
