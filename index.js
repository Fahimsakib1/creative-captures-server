const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//requite dot env
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());


//username: creativeCaptures
//pass: RLxtx8RDSlAmhfKR

//db_name: creativeCaptures
//collection_name: services

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const serviceCollection = client.db('creativeCaptures').collection('services');

        //get all the services from database
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
    }
    finally{

    }
}
run().catch(error => console.log(error))




app.get('/', (req, res) => {
    res.send("Creative Captures server is running")
});

app.listen(port, () => {
    console.log("Creative Captures Server is running at port", port)
})
