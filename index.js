const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j7l4khx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const contentsCollection = client.db('hrwindow').collection('contents');

        //get by limit
        app.get('/contents', async (req, res) => {
            const limit = parseInt(req.query.limit);
            const query = {};
            const cursor = contentsCollection.find(query);
            const contents = await cursor.limit(limit).toArray();
            res.send(contents);
        })

        //get by id
        app.get('/contents/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const content = await contentsCollection.findOne(query);
            res.send(content);
        })

        app.patch('/contents/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newReview = req.body;
            const options = { upsert: true };
            const addReview = {
                $push: {
                    reviews: newReview
                }
            }
            const result = await contentsCollection.updateOne(filter, addReview, options);
            res.send(result);
        })

    } finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})