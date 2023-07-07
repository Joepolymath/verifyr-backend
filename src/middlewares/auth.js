const jwt = require('jsonwebtoken')
const Staff = require('../models/staff.model')


async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).json({
                message: "Authorization header must start with 'Bearer '",
                status: "failure"
            })
        }
        const token = authorization.substring(7)
        
        const decodedUser = await jwt.decode(token)
        
        const foundStaff = await Staff.findOne({_id: decodedUser._id})
        
        if(foundStaff.role !== 'admin') {
            return res.status(400).json({
                message: "Only Admins Allowed",
                status: "failure"
            })
        }
        req.user = foundStaff
        next()
    } catch (error) {
        return res.status(error?.statusCode || 500).send(error?.message || "Unable to authenticate")
    }
}

module.exports = {
    authenticate
}

const request = {
    headers: {
        "Content-Type": "application/json",
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxpbnVzQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkxpbnVzIiwicm9sZSI6ImFkbWluIiwiX2lkIjoiNjRhNDE3MTYxYzI1YzkwNDVlOWEyMTI5IiwiaWF0IjoxNjg4NTU3ODEwLCJleHAiOjE2OTExNDk4MTB9.dWMRn39YhFOXq1VxqbicKVPohGKxVFa_8iLtcp_jy-A" 
    },
    body: {

    }
}