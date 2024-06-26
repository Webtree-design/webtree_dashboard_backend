const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.post("/post/snackbar", async (req, res) => {
  const customer = req.query.kunde;
  const client = await connectToDB();
  const id = req.body.id;
  try {
    const database = client.db(customer);
    const collection = database.collection("Benachrichtigungen");

    const newEntry = {
      type: "snackbar",
      content: req.body.content,
      active: req.body.active,
    };

    if (id) {
      const { content, active } = req.body;
      const existingEntry = await collection.findOne({
        _id: new ObjectId(id.toString()),
      });
      if (!existingEntry) {
        return res.status(404).json({ message: "ID not found" });
      }
      const updateEntry = await collection.updateOne(
        { _id: new ObjectId(id.toString()) },
        { $set: { content, active } }
      );
      console.log(`Entry Updated with _id: ${id}`);
      return res.status(201).json(`Entry Updated with _id: ${id}`);
    }

    const result = await collection.insertOne(newEntry);

    console.log(`New entry added with _id: ${result.insertedId}`);
    return res
      .status(201)
      .json(`New entry added with _id: ${result.insertedId}`);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});
router.post("/post/popup", async (req, res) => {
  const customer = req.query.kunde;
  const client = await connectToDB();
  const id = req.body.id;
  try {
    const database = client.db(customer);
    const collection = database.collection("Benachrichtigungen");

    const newEntry = {
      type: "popup",
      title: req.body.title,
      content: req.body.content,
      active: req.body.active,
    };

    if (id) {
      const { title, content, active } = req.body;
      const existingEntry = await collection.findOne({
        _id: new ObjectId(id.toString()),
      });
      if (!existingEntry) {
        return res.status(404).json({ message: "ID not found" });
      }
      const updateEntry = await collection.updateOne(
        { _id: new ObjectId(id.toString()) },
        { $set: { title, content, active } }
      );
      console.log(`Entry Updated with _id: ${id}`);
      return res.status(201).json(`Entry Updated with _id: ${id}`);
    }

    const result = await collection.insertOne(newEntry);

    console.log(`New entry added with _id: ${result.insertedId}`);
    return res
      .status(201)
      .json(`New entry added with _id: ${result.insertedId}`);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});

router.get("/get", async (req, res) => {
  const customer = req.query.kunde;
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

module.exports = router;
