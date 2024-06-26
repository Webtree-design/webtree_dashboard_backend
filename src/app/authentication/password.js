const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const bodyParser = require("body-parser");
const { connectToDB, closeDB } = require("../mongodb");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());

// Generate a random token (this is just a simple example, consider using a library for token generation)
function generateResetToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

router.post("/request", async (req, res) => {
  const customer = req.query.kunde;
  const username = req.body.username;

  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const collection = database.collection("User");

    // Find the user by username
    const user = await collection.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and store reset token with expiry time
    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour
    await collection.updateOne(
      { username: username },
      { $set: { resetToken, resetExpiry } }
    );

    // Send reset link to the user's email
    await sendMail(username, resetToken, user.email);

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (err) {
    console.error("Error requesting password reset:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await closeDB(client);
  }
});

router.post("/reset", async (req, res) => {
  const customer = req.query.kunde;
  const username = req.body.username;
  const resetToken = req.body.resetToken;
  const newPassword = req.body.newPassword;

  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const collection = database.collection("User");

    // Find the user by username and check the reset token and expiry
    const user = await collection.findOne({
      username: username,
      resetToken,
      resetExpiry: { $gt: new Date() }, // Check if the token is not expired
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid reset token or token expired" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await collection.updateOne(
      { username: username },
      { $set: { password: hashedPassword } }
    );

    // Clear the reset token and expiry
    await collection.updateOne(
      { username: username },
      { $unset: { resetToken: "", resetExpiry: "" } }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await closeDB(client);
  }
});

async function sendMail(username, resetToken, email) {
  console.log(username, resetToken, email);

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "85.215.240.117",
  //   port: 25,
  //   secure: false, // true for 465, false for other ports
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // });

  // let mailCredentials = {
  //   senderName: "webtreedesign",
  //   senderAdress: "info@webtreedesign.de",
  //   receiverAdress: email,
  //   replyToAdress: "no-reply@webtreedesign.de",
  //   smtpAdress: "<webtreedesign@mail.webtreedesign.de>",
  //   resetUrl:
  //     "http://localhost:4200/reset?token=" +
  //     resetToken +
  //     "&username=" +
  //     username,
  // };
  // try {
  //   const info = await transporter.sendMail({
  //     from: "Webtree <root@mail.webtreedesign.de>", // sender address
  //     to: `${mailCredentials.receiverAdress}`, // list of receivers
  //     subject: `Webtree - Passwort vergessen (${username})`, // Subject line
  //     html: `

  //     <p>Sie haben uns mitgeteilt, dass Sie Ihr Passwort vergessen haben. Damit Sie Ihr Konto wieder wie gewohnt nutzen können, klicken Sie bitte auf den folgenden Link:</p>

  //     <a href="${mailCredentials.resetUrl}">Link zum Passwort ändern</a>

  //     <br>

  //     <p>Im nächsten Schritt können Sie Ihr neues Passwort eingeben.</p>



  //     `, // html body
  //   });
  //   console.log("log: send mail");
  // } catch (err) {
  //   console.log("log: " + err);
  // }
}

module.exports = router;
