const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { connectToDB, closeDB } = require("../mongodb");

const auth = require("./token");
const generateAccessTokenFunc = auth.generateAccessToken;

router.post("/", async (req, res) => {
  const customer = req.query.platform;
  const { username, password } = req.body;
  const client = await connectToDB();

  try {
    const db = client.db(customer);
    const collection = db.collection("User");

    const user = await collection.findOne({ username });

    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { token, expiresIn } = await generateAccessTokenFunc(
      user._id,
      user.username,
      user.email,
      user.websiteId,
      user.licenses.website,
      user.licenses.webshop,
      user.licenses.eventapp
    );

    res.json({ token, expiresIn });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
