const companyServices = require("../services/companies.services")

// Create account function
const createAccount = async (req, res) => {
  const data = await companyServices.createCompany(req.body)
  res.status(data.statusCode).json(data)
};
const createAdmin = async (req, res) => {
  const data = await companyServices.createAdmin(req.body)
  res.status(data.statusCode).json(data)
};
const createStaff = async (req, res) => {
  const data = await companyServices.createStaff(req.body)
  res.status(data.statusCode).json(data)
};
const login = async (req, res) => {
  const data = await companyServices.login(req.body)
  res.status(data.statusCode).json(data)
};



module.exports = { createAccount, createAdmin, login, createStaff };
