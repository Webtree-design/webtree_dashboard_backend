const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/login", async (req, res) => {
  try {
    // Credentials for the external API
    const credentials = {
      username: "admin",
      password: "Webtree$2023Umami!",
    };

    // URL of the external API
    const apiUrl = "http://umami.webtreedesign.de:3000/api/auth/login";

    // Make a POST request to the external API using Axios
    const response = await axios.post(apiUrl, credentials);

    // Extract data from the response
    const data = response.data;
    // console.log(data);
    // Send the data as a response to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/pageviewers", async (req, res) => {
  const websiteId = req.query.websiteId;
  const startAt = req.query.startAt;
  const endAt = req.query.endAt;
  const unit = req.query.unit;

  const authHeader = req.headers["authorization"];

  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };

  const params = {
    startAt: startAt,
    endAt: endAt,
    unit: unit,
  };

  try {
    // URL of the external API
    const apiUrl = `http://umami.webtreedesign.de:3000/api/websites/${websiteId}/pageviews?timezone=Europe%2FBerlin`;

    // Make a POST request to the external API using Axios
    const response = await axios.get(apiUrl, {
      headers: headers,
      params: params,
    });

    // Extract data from the response
    const data = response.data;
    // console.log(data);
    // Send the data as a response to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/metrics", async (req, res) => {
  const websiteId = req.query.websiteId;
  const startAt = req.query.startAt;
  const endAt = req.query.endAt;

  const authHeader = req.headers["authorization"];

  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };

  const params = {
    startAt: startAt,
    endAt: endAt,
  };

  try {
    // URL of the external API
    const apiUrl = `http://umami.webtreedesign.de:3000/api/websites/${websiteId}/metrics?type=url`;

    // Make a POST request to the external API using Axios
    const response = await axios.get(apiUrl, {
      headers: headers,
      params: params,
    });

    // Extract data from the response
    const data = response.data;
    // console.log(data);
    // Send the data as a response to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/active", async (req, res) => {
  const websiteId = req.query.websiteId;

  const authHeader = req.headers["authorization"];

  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };

  try {
    // URL of the external API
    const apiUrl = `http://umami.webtreedesign.de:3000/api/websites/${websiteId}/active`;

    // Make a POST request to the external API using Axios
    const response = await axios.get(apiUrl, {
      headers: headers,
    });

    // Extract data from the response
    const data = response.data;
    // console.log(data);
    // Send the data as a response to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/stats", async (req, res) => {
  const websiteId = req.query.websiteId;
  const startAt = req.query.startAt;
  const endAt = req.query.endAt;

  const authHeader = req.headers["authorization"];

  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };

  const params = {
    startAt: startAt,
    endAt: endAt,
  };

  try {
    // URL of the external API
    const apiUrl = `http://umami.webtreedesign.de:3000/api/websites/${websiteId}/stats`;

    // Make a POST request to the external API using Axios
    const response = await axios.get(apiUrl, {
      headers: headers,
      params: params,
    });

    // Extract data from the response
    const data = response.data;
    // console.log(data);
    // Send the data as a response to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
