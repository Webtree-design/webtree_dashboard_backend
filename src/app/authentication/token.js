const express = require("express");
const bodyParser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TOKEN_SECRET =
  "QL4H1u%zwb~*P9zpf<:s@P<WXLD$M{r:s,;Qjt2@Xu|Xaaw~N0jb})y|$'ov5XG";

const tokenBlacklist = new Set();

async function generateAccessToken(
  userId,
  username,
  email,
  websiteId,
  licWebsite,
  licWebshop,
  licEventApp
) {
  const expiresIn = "86400s"; // Set your desired expiration time

  const token = jsonwebtoken.sign(
    {
      userId,
      username,
      email,
      websiteId,
      licenses: { licWebsite, licWebshop, licEventApp },
    },
    TOKEN_SECRET,
    {
      expiresIn,
    }
  );

  return { token, expiresIn };
}

async function authenticateToken(req, res, next) {
  // console.log(req.headers);
  const token = req.headers["authorization"];
  // console.log("auth: " + token);

  if (!token) return res.sendStatus(401);

  if (tokenBlacklist.has(token)) return res.sendStatus(403);

  try {
    const decodedToken = await jsonwebtoken.verify(token, TOKEN_SECRET);
    req.user = decodedToken; // Pass the decoded token to the request object
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

module.exports = { generateAccessToken, authenticateToken, tokenBlacklist };
