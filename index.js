const express= require('express');
const app= express();
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
require('dotenv').config()
const cors= require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
// carService
// ld0zXGhKAQDVVYVi

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hes3p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run (){
    try{
        await client.connect();
        const database = client.db('travelService');
        const carCollection = database.collection('carService');
        const singleCollection = database.collection('singleService');
        console.log('database connect');

        app.get('/carsercives', async (req, res)=>{
            const cursor = carCollection.find({});
            const services= await cursor.toArray();
            res.json(services)
        });

        app.post('/carsercives', async(req, res)=>{
              
            const service = req.body ;
              const result = await carCollection.insertOne(service);
              console.log(result)
             console.log('hit the post api' , service)
             res.json(result)
 
         });

            // get single data
            app.get('/getservices', async(req, res)=>{

                const cursor = singleCollection.find({});
                const service= await cursor.toArray();
                res.json(service)
            });

             app.get('/getservices/:email', async(req, res)=>{

                const cursor = singleCollection.find({email:req.params.email});
                const service= await cursor.toArray();
                res.json(service)
            });

            app.get('/getservices/:id',async (req, res)=>{
                const id = req.params.id;
                const query ={_id: ObjectId(id)};
                console.log('this is id ', id)
    
                const service = await singleCollection.findOne(query);
                console.log('geting specific service')
                res.json(service)
            })



            app.post('/getservices', async (req , res)=>{
                    const cursor = req.body;
                    const result = await singleCollection.insertOne(cursor);
                    console.log('hit the post api', cursor)
                    res.json(result)
            
                });

                app.delete('/getservices/:id', async(req, res)=>{
                    const id = req.params.id;
                    const query = {_id: ObjectId(id)};
                    console.log('this is id ', id)
                    const result = await singleCollection.deleteOne(query);
                    console.log(result)
                    res.json(result);

                })






    }finally{
        // await client.close()
    }
}

run().catch(console.dir);


// async function start (){
//     try{  await client.connect();
//     const database = client.db('orderReview');
//     const carCollection = database.collection('services');
//     console.log('database connect')

//     app.get('/getServices/:id', async(req, res)=>{
//         const id = req.params.id;
//         const query ={_id: ObjectId(id)}
//         const cursor = carCollection.findOne(query);
//         const service= await cursor.toArray();
//         res.send(service)
//     })

//     app.post('/getServices', async (req , res)=>{
//         const cursor = req.body;
//         const result = await carCollection.insertOne(cursor);
//         console.log('hit the post api', cursor)
//         res.json(result)

//     })

// }finally{
//     // await client.close()
// }

// }

// start().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('this is carserver')
});

app.listen(port, ()=>{
    console.log('listening port', port)
})
