const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const router = express.Router();

//////////////////////////////////////////////////

let mail;

router.post("/send", cors(), (req, res) => {
  console.log(req.body);
  const createMail = {
    customerName: req.body.eName,
    betreff: req.body.eBetreff,
    customerMail: req.body.eEmail,
    message: req.body.eMessage,
    companyMail: req.body.eEmailTo,
    companyName: req.body.eCompany,
    smtpMail: req.body.eEmailTo,
  };
  try {
    mail = createMail;
    sendMail();
  } catch (error) {
    res.json("error");
  }
  res.json("OK");
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //// let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    auth: {
      user: "mail.webtreedesign@gmail.com", // Gmail address
      pass: "fvxb hjdn rmxy dyjv", // Gmail password or App-specific password
    },
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: `"Kontaktformular" ${mail.customerMail}`, // sender address
      to: `${mail.companyName} ${mail.smtpMail}`, // list of receivers
      replyTo: `${mail.customerMail}`,
      subject: "Kontaktformular", // Subject line
      html: `Sie haben eine Nachricht von <i>${mail.customerName}</i> erhalten:
      <br/><br/>
      Kunden E-mail: ${mail.customerMail}
      <br/><br/>
      Betreff: ${mail.betreff}
      <br/><br/>
      Nachricht: ${mail.message}
      `, // html body
    });
    console.log("LOG_mail: send mail");
  } catch (err) {
    console.log("LOG_mail: " + err);
  }
}

module.exports = router;
