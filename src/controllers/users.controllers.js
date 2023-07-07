const usersServices = require("../services/users.services")

function loginController(req, res) {
    console.log(req.body)
    const response = usersServices.loginService(req.body)
    res.status(response.statusCode).json(response)
}

function registerController(req, res) {
    console.log(req.body)
    res.status(200).json({
        message: "Login successful"
    })
}

module.exports = {
    loginController,
    registerController
}