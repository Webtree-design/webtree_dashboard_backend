const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.post("/post", async (req, res) => {
  const customer = req.query.kunde;
  const client = await connectToDB();
  const id = req.body.id;
  try {
    const database = client.db(customer);
    const collection = database.collection("Filter");

    const newEntry = req.body

    if (id) {
      const body = req.body;
      const existingEntry = await collection.findOne({
        _id: new ObjectId(id.toString()),
      });
      if (!existingEntry) {
        return res.status(404).json({ message: "ID not found" });
      }
      const updateEntry = await collection.updateOne(
        { _id: new ObjectId(id.toString()) },
        { $set: body }
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
    const collection = database.collection("Filter");

    const filter = await collection.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json(filter);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});

router.post("/delete", async (req, res) => {
  const customer = req.query.kunde;
  const itemId = req.body.id;
  const client = await connectToDB();
  try {
    const database = client.db(customer);
    const collection = database.collection("Filter");

    const existingEntry = await collection.findOne({
      _id: new ObjectId(itemId.toString()),
    });

    if (!existingEntry) {
      return res.status(404).json({ message: "Entry not deleted" });
    }
    const entry = await collection.deleteOne({ _id: new ObjectId(itemId) });

    console.log(`Entry deleted with _id: ${itemId}`);
    res.status(200).json(`Entry deleted with _id: ${itemId}`);
  } catch (err) {
    console.log(err);
    res.json(err);
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
