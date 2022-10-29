const pug = require('pug');
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Grizzlyk Aleks <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_END === 'production') return 1;

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOption = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
};
