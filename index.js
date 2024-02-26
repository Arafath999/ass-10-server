const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000

app.use(cors());
app.use(express.json());


// ass-10
//qpbrU0gPNKZtdc7O



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.62rluh7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const brandCollection = client.db("brandDB").collection("brand");
    const userCollection = client.db("brandDB").collection("user")
    const cartCollection = client.db("brandDB").collection("cart")
    app.get("/brands",async (req,res) => {
      try {
        const category = req.query.category;
        const query = {}
        if(category){
            query.brand =   { $eq: category.toLowerCase() } 
        }
        console.log(query)
        const cursor = brandCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error)
        console.log(error.message)
      }
       
    })

    app.get("/brands/:id" ,async (req,res) => {
      const id = req.params.id;
      const query = {_id: new  ObjectId(id)}
      const result = await brandCollection.findOne(query)
      res.send(result)
    })
    

    app.post("/brands", async (req,res) => {
        const newBrand = req.body;
        console.log(newBrand)
        const result = await brandCollection.insertOne(newBrand);
        res.send(result)

    })
     app.put('/brands/:id', async (req,res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upset:true }
        const updatedCars = req.body;
        const cars = {
            $set: {
                name: updatedCars.name,
                type: updatedCars.type,
                price: updatedCars.price,
                rating: updatedCars.rating,
                description: updatedCars.description,
                price: updatedCars.price,
                photo: updatedCars.photo

            }
        }
        const result = await brandCollection.updateOne(filter,cars,options)
        res.send(result)
    })

    app.post('/user',async (req,res) => {
      const user= req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
      

    })

    app.patch('/user', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }; // Use email as a filter
      const result = await userCollection.updateOne(filter, { $set: user });
      res.send(result);
    });
    
   app.post('/carts', async (req,res) => {
    const {_id, ...newCart} = req.body;
    const result = await cartCollection.insertOne(newCart)
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


app.get('/', (req,res) => {
    res.send('server is running on port')
})

app.listen(port, () => {
    console.log(`cars server is runinig on port: ${port}`)
})
