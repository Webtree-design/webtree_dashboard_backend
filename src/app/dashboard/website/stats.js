const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.get("/get", async (req, res) => {
  const customer = req.query.kunde;
  const client = await connectToDB();

  try {
    const database = client.db(customer);
    const beitraegeCollection = database.collection("Beitraege");
    // const collection = database.collection("New");
    // const collection = database.collection("etc");

    const beitraege = await beitraegeCollection.countDocuments();

    const result = {
      beitraege: beitraege,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
