const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const PORT = 5601;
const app = express();

const jsonParser = bodyParser.json({ limit: "5mb" }); // Adjust the limit accordingly
app.use(jsonParser);

app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*', // Specify your frontend URLs
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/service.webtreedesign.de/privkey.pem",
  "utf8"
); // privkey from certbot
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/service.webtreedesign.de/cert.pem",
  "utf8"
); // cert von certbot
const credentials = { key: privateKey, cert: certificate };

const https = require("https");
const httpsServer = https.createServer(credentials, app);

// const http = require("http");
// const httpServer = http.createServer(app);

//////////////////////////////////////////////////
const auth = require("./app/authentication/token");
const authenticateTokenFunc = auth.authenticateToken;
//////////////////////////////////////////////////

const login = require("./app/authentication/login");
app.use("/login", login);

const resetPassword = require("./app/authentication/password");
app.use("/password", resetPassword);

const registration = require("./app/authentication/registration");
app.use("/registration", registration);

const logout = require("./app/authentication/logout");
app.use("/logout", authenticateTokenFunc, logout);

const beitraege = require("./app/dashboard/website/beitraege");
app.use("/beitraege", authenticateTokenFunc, beitraege);

const open = require("./app/dashboard/website/open");
app.use("/open", open);

const benachrichtigungen = require("./app/dashboard/website/benachrichtigungen");
app.use("/benachrichtigungen", authenticateTokenFunc, benachrichtigungen);

const dashboardstats = require("./app/dashboard/website/stats");
app.use("/dashboardstats", authenticateTokenFunc, dashboardstats);

const umami = require("./app/dashboard/website/umami");
app.use("/umami", umami);

const filter = require("./app/dashboard/webshop/filter");
app.use("/filter", authenticateTokenFunc, filter);

const events = require("./app/dashboard/app/events");
app.use("/events", authenticateTokenFunc, events);

const profile = require("./app/dashboard/app/profile");
app.use("/profile", authenticateTokenFunc, profile);

const mail = require("./app/dashboard/website/mail");
app.use("/mail", mail);

//////////////////////////////////////////////////

httpsServer.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
