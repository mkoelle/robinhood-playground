const gmailSend = require('gmail-send');
const { gmail: credentials } = require('../config');

const send = gmailSend({
  user: credentials.username,
  pass: credentials.password,
  to: credentials.username
});

module.exports = (subject, body) => new Promise((resolve, reject) => {
    console.log('sending email...to yourself...');
    console.log('subject', subject, 'body', body);
    send({
        subject,
        text: body
    }, (err, res) => err ? reject(err) : resolve(res));
});
