const dotenv= require("dotenv")
const sgMail = require('@sendgrid/mail')
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const textMail = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #777777;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Please click the button below to reset your password:</p>
    <a class="button" href="{{ resetUrl }}">Reset Password</a>
  </div>
</body>
</html>
`

const sendMail = ()=>{
const msg = {
  to: 'annabeladaeze@gmail.com', // Change to your recipient
  from: 'joshuatobiajagbe@gmail.com', // Change to your verified sender
  subject: 'Reset Password link',
  text: 'Click on the link below to reset your password',
  html: textMail,
}
sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })
}
module.exports = sendMail;