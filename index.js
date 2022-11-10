const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

//requite dot env
require('dotenv').config();

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.ACCESS_TOKEN_SECRET);


//middle wares
app.use(cors());
app.use(express.json());


//username: creativeCaptures
//pass: RLxtx8RDSlAmhfKR


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



////function for jwt token
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: "Forbidden Access" })
        }

        req.decoded = decoded;
        next();
    })
}




async function run() {
    try {
        const serviceCollection = client.db('creativeCaptures').collection('services');

        const reviewCollection = client.db('creativeCaptures').collection('reviews');

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
        app.post('/services', async (req, res) => {
            const serviceInfo = req.body;
            console.log(serviceInfo);
            const result = await serviceCollection.insertOne(serviceInfo)
            res.send(result);
        })

        //get a specific service data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("Service ID From Client Side: ", id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //add or post reviews on the database
        app.post('/reviews', async (req, res) => {
            const reviewInfo = req.body;
            console.log(reviewInfo);
            const result = await reviewCollection.insertOne(reviewInfo);
            res.send(result);
        })


        //get the reviews by user email
        app.get('/reviews', verifyJWT, async (req, res) => {

            // const email = req.query.email;
            // console.log(email);
            // let query = {};
            // if (email) {
            //     query = {
            //         email: email
            //     }
            // }
            // const cursor = reviewCollection.find(query);
            // const reviews = await cursor.toArray();
            // res.send(reviews)


            const decoded = req.decoded;
            console.log(" Decoded inside reviews get API", decoded);

            if(decoded.email !== req.query.email){
                return res.status(403).send({message: "Forbidden Access"})
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })



        //delete user review based on id
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Trying to Delete The user ID: ", id)
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })



        //get a specific review data
        // app.get('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log("Review of Service By Service ID From Client Side: ", id);

        //     let query = {};
        //     if(id){
        //         query  = {
        //             service_id: id
        //         }
        //     }

        //     const review = await reviewCollection.findOne(query);
        //     res.send(review);

        //     // const query = {service_id: id};
        //     // const review = await reviewCollection.findOne(query);
        //     // res.send(review);

        // })



        //update service review 
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Review of Service by Review ID From Client Side: ", id);
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })




        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);

            //this is the previous line befor changing
            //const filter = {service_id: id};

            //this is the new line that I have added just
            const filter = { _id: ObjectId(id) };

            const reviewInfo = req.body;
            console.log(reviewInfo);

            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    review: reviewInfo.review,
                    reviewDate: reviewInfo.reviewDate,
                    service_rating: reviewInfo.service_rating
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option)
            res.send(result);
        })


        // the the reviews data by service id with query params
        app.get('/reviewss', async (req, res) => {
            let query = {};
            if (req.query.service_id) {
                query = {
                    service_id: req.query.service_id
                }
            }
            const sortReview = { '_id': -1 }
            const cursor = reviewCollection.find(query).sort(sortReview);
            const review = await cursor.toArray();
            res.send(review)
        })


        //code for jwt token
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            console.log("User From Sever side: ", user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
            res.send({ token })
        })


    }


    finally {

    }
}
run().catch(error => console.log(error))




app.get('/', (req, res) => {
    res.send("Creative Captures server is running")
});

app.listen(port, () => {
    console.log("Creative Captures Server is running at port", port)
})
