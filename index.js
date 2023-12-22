const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1212;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const userName = process.env.USER_DB;
const userPass = process.env.PWD_DB;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${userName}:${userPass}@cluster0.yhpfxjc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const taskmanageCollection = client.db("taskManageDB").collection("tasks");

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskmanageCollection.insertOne(task);
      res.send(result);
    });
    app.get("/tasks/:email", async (req, res) => {
     const email=req.params.email;
     const query={email:email}
      const result = await taskmanageCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management Server Is Running......");
});

app.listen(port, () => {
  console.log(`Server Is Running On localhost:${port}`);
});
