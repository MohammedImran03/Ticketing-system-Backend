const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

const send = async (info) => {
  try {
    // send mail with defined transport object
    let result = await transporter.sendMail(info);

    console.log("Message sent: %s", result.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return result;
  } catch (error) {
    console.log(error);
  }
};

const emailProcessor = ({email, pin, type}) => {
  let info = "";
  switch (type) {
    case "request-new-Password":
      info = {
        from: `Query Ticketing System <${process.env.NODEMAILER_AUTH_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Password Reset PIN", // Subject line
        text:
          "Your 6 Digit Password Reset PIn :" +
          pin +
          "This Pin Will Expires in 30 mins", // plain text body
        html: `<b>Hello</b>
        Here is your pin 
        <b>${pin}</b>
        This pin will expires in 30 mins
        <p>Thank you...</p>`, // html body
      };
      send(info);
      break;
    case "Password-update-success":
      info = {
        from: `Query Ticketing System <${process.env.NODEMAILER_AUTH_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Password Updatedation", // Subject line
        text: "Your new Password has been updated successfully in your Query Ticketing System...", // plain text body
        html: `<b>Hello</b>
        Your 
        <b>Query Ticketing System</b>
        Account Password Has reseted. Now you can logg in with your new password
        <p>Thank you...</p>`, // html body
      };
      send(info);

    default:
      break;
  }
};

module.exports = { emailProcessor };
