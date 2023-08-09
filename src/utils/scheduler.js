const nodeCron = require('node-cron');
const sendMail = require('./sendMail');

const job = nodeCron.schedule('0 0 * * *', () => {
  const messagePayload = {
    to: [
      'aimuelemmanuel@gmail.com',
      'joshuaajagbe96@gmail.com',
      'msmabel23@gmail.com',
      'annabeladaeze@gmail.com',
      'umorudavido@gmail.com',
    ],
    subject: 'WAKE UP 😏',
  };
  sendMail.sendDailyEmail(messagePayload);
  console.log('Message send in cron');
});

module.exports = job;
