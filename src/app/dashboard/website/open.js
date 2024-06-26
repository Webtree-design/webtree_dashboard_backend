const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.get("/benachrichtigungen", async (req, res) => {
  console.log("/benachrichtigungen");
  const customer = req.query.kunde;
  console.log(customer);
  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const collection = database.collection("Benachrichtigungen");

    const benachrichtigungen = await collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(benachrichtigungen);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});
router.get("/beitraege", async (req, res) => {
  const customer = req.query.kunde;
  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const collection = database.collection("Beitraege");

    const beitraege = await collection.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json(beitraege);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
