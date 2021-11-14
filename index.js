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
        const appoinmentsCollection = database.collection("appoinments");
        const usersCollection = database.collection("userCollection");
        console.log("db success");



        app.get('/appoinments', async (req, res) => {
            const email = req?.query?.email;
            const date = new Date(req.query.date)?.toLocaleDateString();
            const query = { email: email, date: date }
            console.log(query)
            const cursor = appoinmentsCollection.find(query);
            const appoinments = await cursor.toArray();
            res.json(appoinments);

        })

        app.post('/appoinments', async (req, res) => {
            const appoinment = req.body;
            const result = await appoinmentsCollection.insertOne(appoinment);
            console.log(result);
            res.json(result);

        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);

        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updatedoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updatedoc, options);
            res.json(result)

        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updatedoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updatedoc);
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