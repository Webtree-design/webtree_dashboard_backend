const express = require("express");
const router = express.Router();

const blacklist = require("./token");
const tokenBlacklist = blacklist.tokenBlacklist;

router.get("/", async (req, res) => {
  const token = req.headers["authorization"];
  console.log("LOGOUT: " + token);
  tokenBlacklist.add(token);
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
