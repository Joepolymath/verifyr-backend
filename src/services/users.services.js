const users = require("../dummies/users")

/*function loginService(payload) {
    const {email, password} = payload
    let isFound = false
    let foundUser;
    for(let i = 0; i < users.length; i++) {
        if(users[i].email === email) {
            isFound = true;
            foundUser = users[i];
            break;
        }
    }

    if(isFound === false) {
        return {
            message: "User not found",
            status: "failure",
            statusCode: 404,
        }
    }

    if(foundUser.password !== password) {
        return {
            message: "Password incorrect",
            status: "failure",
            statusCode: 400,
        }
    }

    return {
        message: "Login successful",
        status: "success",
        statusCode: 200,
        data: foundUser
    }
}

module.exports = {
    loginService
}*/

function loginService(payload) {
    const { email, password } = payload;
    const foundUser = users.filter((user) => user.email === email && user.password === password)[0];
  
    if (!foundUser) {
      return {
        message: "User not found or  incorrect",
        status: "failure",
        statusCode: 404,
      };
    }
  
    return {
      message: "Login successful",
      status: "success",
      statusCode: 200,
      data: foundUser,
    };
  }
  
  module.exports = {
    loginService 
  };
  