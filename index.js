const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/contents', async (req, res) => {
            const query = {};
            const cursor = contentsCollection.find(query);
            const contents = await cursor.limit(0).toArray();
            res.send(contents);
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