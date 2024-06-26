const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToDB, closeDB } = require("../../mongodb");

router.post("/post", async (req, res) => {
  const item = req.body;
  const userId = req.query.userId;

  console.log(item);
  console.log(userId);

  const client = await connectToDB();
  try {
    const database = client.db("eventApp");
    const collection = database.collection("Companys");

    const newProfile = {
      title: req.body.title,
      content: req.body.content,
      anschrift: req.body.anschrift,
      link: req.body.link,
      image: req.body.image,
    };

    // Ensure userId is an ObjectId
    const companyId = new ObjectId(userId);

    const existingCompany = await collection.findOne({ _id: companyId });

    if (!existingCompany) {
      return res.status(404).json({ message: "Company ID not found" });
    }
    

    // Update the profile field in the document
    await collection.updateOne(
      { _id: companyId },
      { $set: { profile: newProfile } }
    );
    console.log(`Profile updated for Company with _id: ${userId}`);

    return res
      .status(200)
      .json({ message: `Profile updated for Company with _id: ${userId}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } finally {
    await closeDB(client);
  }
});


router.get("/get", async (req, res) => {
  const client = await connectToDB();
  const userId = req.query.userId;

  try {
    const database = client.db("eventApp");
    const collection = database.collection("Companys");

    // Ensure userId is an ObjectId if your _id field is of type ObjectId
    const company = await collection.findOne({ _id: new ObjectId(userId) });

    if (company) {
      res.status(200).json(company.profile);
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } finally {
    await closeDB(client);
  }
});

module.exports = router;
