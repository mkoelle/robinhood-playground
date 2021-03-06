const gmailSend = require('gmail-send');
const { gmail: credentials } = require('../config');

const send = gmailSend({
  user: credentials.username,
  pass: credentials.password
});

module.exports = (subject, body, to = credentials.username) => new Promise((resolve, reject) => {
    console.log('sending email...to yourself...');
    console.log('subject', subject, 'body', body);
    send({
        subject,
        text: body,
        to
    }, (err, res) => err ? reject(err) : resolve(res));
});
