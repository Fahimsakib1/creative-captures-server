const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const reviewCollection = client.db('creativeCaptures').collection('reviews');

        //get all the services from database
        // app.get('/services', async (req, res) => {
        //     const query = {};
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.limit(3).toArray();
        //     res.send(services);
        // })


        //get the services from database
        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            console.log(size);
            
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(size).toArray();
            res.send(services);
        })

        //add service on database by the user
        app.post ('/services', async (req, res) => {
            const serviceInfo = req.body;
            console.log(serviceInfo);
            const result = await serviceCollection.insertOne(serviceInfo)
            res.send(result);
        })

        //get a specific service data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("Service ID From Client Side: ", id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //add or post reviews on the database
        app.post ('/reviews', async (req, res) => {
            const reviewInfo = req.body;
            console.log(reviewInfo);
            const result = await reviewCollection.insertOne(reviewInfo);
            res.send(result);
        })

        //get the reviews by user email
        app.get('/reviews', async (req, res) => {
            
            const email = req.query.email;
            console.log(email);
            let query = {};
            if(email){
                query = {
                    email: email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)

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
