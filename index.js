const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqcfxjd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const reportCollection = client.db('reportDB').collection('reports')
    const safetyCollection = client.db('reportDB').collection('safety')
    const contactCollection = client.db('reportDB').collection('contact')

    //Report Api Section

    app.post('/reports', async(req, res) => {
        const data = req.body;
        const result = await reportCollection.insertOne(data);
        res.send(result)
    })

    app.get('/reports', async(req, res) => {
        const result = await reportCollection.find().toArray()
        res.send(result)
    })

    //Safety Api Section

    app.get('/safety', async(req, res) => {
        const result = await safetyCollection.find().toArray()
        res.send(result)
    })

    // app.get('/safety/:id', async(req, res) => {
    //     const id = req.params.id;
    //     console.log(id)
    // })

    //Contact Section
    app.post('/contact', async(req, res) => {
      const data = req.body;
      const result = await contactCollection.insertOne(data);
      res.send(result)
    })

    app.get('/contact', async(req, res) => {
      const result = await contactCollection.find().toArray()
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
  res.send("Report Safe server is running");
});

app.listen(port, () => {
  console.log(`Report server is running on ${port}`);
});
