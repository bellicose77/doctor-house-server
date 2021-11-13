const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

require('dotenv').config();

const cors = require('cors');

const port = process.env.PORT || 5000

// Middelware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt5tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();

        // create data base 
        const database = client.db("doctors_portal");
        const appoinmentsCollection = database.collection("appoinments")
        console.log("db success");

        app.post('/appoinments', async (req, res) => {
            const appoinment = req.body;
            const result = await appoinmentsCollection.insertOne(appoinment);
            console.log(result);
            res.json(result);

        })

    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})