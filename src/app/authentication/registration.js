const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { connectToDB, closeDB } = require("../mongodb");

const app = express();
app.use(bodyParser.json());

router.post("/", async (req, res) => {
  const customer = req.query.kunde;
  const { username, email, password1 } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password1, 10); // Adjust the number of salt rounds as needed

  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const collection = database.collection("User");

    // Check if the username already exists
    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Insert the new user into the database
    const result = await collection.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
    });

    console.log("User registered successfully:", result);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
