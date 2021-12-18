const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekjpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect()
        const database = client.db('watch_shop')
        const productCollection = database.collection('product')
        const watchCollection = database.collection('orders')
        const reviewCollection = database.collection('review')
        const userCollection = database.collection('user')


        //    get all products api 
        app.get("/product", async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });



        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await productCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });




        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await watchCollection.insertOne(order)
            console.log(result);
            res.json(result)
        })

        // GET API
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        //review add api
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            console.log(result);
            res.json(result)
        })


        app.delete('/deleteproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })


        // GET API // user order data 
        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const result = await watchCollection.find({
                email: email,
            }).toArray();

            res.send(result);
        });






        // GET API
        app.get('/allorder', async (req, res) => {

            const cursor = watchCollection.find({});
            const orders = await cursor.toArray();
            // console.log(email)
            res.send(orders);
        });




        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(id, updatedStatus)
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const result = await watchCollection.updateOne(filter, updateInfo);
            console.log(result);
            res.send(result);
        });







        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };

            const result = await watchCollection.deleteOne(query);
            res.json(result);
        })

        // DELETE API
        app.delete('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await watchCollection.deleteOne(query);
            res.json(result);
        })


        // 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('hit the post api', user);

            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result)
        });



        app.get("/user", async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const filter = { email: email };
            console.log(filter);
            let admin = false;
            const result = await userCollection.findOne(filter);
            console.log(result);

            if (result?.role === 'admin') {
                admin = true;
            }
            res.json({ admin: admin });
        });



        app.put("/admin", async (req, res) => {
            const email = req.query.email;

            console.log(email);
            const filter = { email: email };
            console.log(filter)
            const updateInfo = {
                $set: {
                    role: 'admin',
                },
            };
            const result = await userCollection.updateOne(filter, updateInfo);
            console.log(result);
            res.json(result);
        });



    }

    finally {
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from Watch Database')
})

app.listen(port, () => {
    console.log('Example app listening at', port)
})