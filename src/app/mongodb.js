const { MongoClient } = require("mongodb");

  const uri = "mongodb://root:W3b7%2433%24%253D2023@webtreedesign.de:27012/";//PORD
  // const uri = "mongodb://root:W3b7%2433%24%253D2023@localhost:27012/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0";//LOCAL

async function connectToDB() {
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function closeDB(client) {
  await client.close();
}

module.exports = { connectToDB, closeDB };
