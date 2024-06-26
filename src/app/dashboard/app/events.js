const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.post("/post", async (req, res) => {
  const userData = req.query;
  const item = req.body;

  const client = await connectToDB();

  try {
    const database = client.db("eventApp");
    let collection = database.collection("Events");

    const newEntry = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      date: req.body.date,
      userId: userData.userId,
      username: userData.kunde,
    };

    let entryId;
    if (item.id) {
      const { title, content, image, date } = req.body;
      const existingEntry = await collection.findOne({
        _id: new ObjectId(item.id.toString()),
      });

      if (!existingEntry) {
        return res.status(404).json({ message: "ID not found" });
      }

      await collection.updateOne(
        { _id: new ObjectId(item.id.toString()) },
        { $set: { title, content, image, date } }
      );
      entryId = item.id; // use the existing item id
      console.log(`Entry Updated with _id: ${entryId}`);
    } else {
      const result = await collection.insertOne(newEntry);
      entryId = result.insertedId.toString(); // get the new item id
      console.log(`New entry added with _id: ${entryId}`);
    }

    collection = database.collection("Companys");
    const companyId = userData.userId.toString();
    const existingCompany = await collection.findOne({
      _id: new ObjectId(companyId),
    });

    if (!existingCompany) {
      return res.status(404).json({ message: "Company ID not found" });
    } else {
      // Check if itemId already exists in itemIds array
      if (!existingCompany.itemIds.includes(entryId)) {
        await collection.updateOne(
          { _id: new ObjectId(companyId) },
          { $push: { itemIds: entryId } }
        );
        console.log(`Item ID added to Company with _id: ${companyId}`);
      } else {
        console.log(`Item ID already exists in Company with _id: ${companyId}`);
      }
    }

    return res.status(201).json(`Entry processed with _id: ${entryId}`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    await closeDB(client);
  }
});

router.get("/get", async (req, res) => {
  const userData = req.query;
  const client = await connectToDB();

  try {
    const database = client.db("eventApp");

    // Find the company document by userId
    const company = await database.collection("Companys").findOne({
      _id: new ObjectId(userData.userId.toString()),
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const itemIds = company.itemIds || [];

    // Fetch all events that match the ids in the itemIds array
    const events = await database
      .collection("Events")
      .find({
        _id: { $in: itemIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    return res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    await closeDB(client);
  }
});

router.post("/delete", async (req, res) => {
  const userId = req.query.userId;
  const itemId = req.body.itemId;
  console.log(`Deleting item with ID: ${itemId} for user: ${userId}`);

  const client = await connectToDB();

  try {
    const database = client.db("eventApp");

    // Delete the item from the Events collection
    const deleteResult = await database.collection("Events").deleteOne({
      _id: new ObjectId(itemId.toString()),
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Remove the item ID from the itemIds array in the Companys collection
    const companyUpdateResult = await database
      .collection("Companys")
      .updateOne(
        { _id: new ObjectId(userId.toString()) },
        { $pull: { itemIds: itemId } }
      );

    if (companyUpdateResult.modifiedCount === 0) {
      return res.status(404).json({
        message: "Company not found or item ID not in company's itemIds array",
      });
    }

    console.log(
      `Item with ID: ${itemId} deleted from Events collection and removed from Company's itemIds array`
    );
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
