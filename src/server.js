const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })
httpServer.listen(8002)
app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:3000',  // Update with your client's URL
        methods: ['GET', 'POST'],
        credentials: true  // If your client makes requests with credentials (e.g., cookies)
      }
))

// MongoDB connection string
const url = "mongodb://127.0.0.1:27017"
const client = new MongoClient(url)

// connection establish and log error or success
client.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('resGen');
        const collection = db.collection('collection1');
        // Use the collection...
    })
    .catch(error => console.error(error))

// database variable declared empty globally
let db = client.db('resGen')

let users = {}

// Set up socket connection
io.on('connection', function (socket) {
    console.log('A connection has been made');
  
    // Event listener for the 'login' event
    socket.on('login', (userId) => {
        console.log(`User ${userId} logged in`);
        // users[userId] = socket; // Associate this socket with the user

        // // Example code for watching changes in a MongoDB collection
        // const userIdHex = new ObjectId(userId); // Convert userId to ObjectId
        // // console.log(userIdHex)
        // // Replace 'historyCollection' with your actual collection name
        // const historyCollection = db.collection('history');
        // // console.log(historyCollection)
        // // Start listening to changes
        // const changeStream = historyCollection.watch({ $match: { 'fullDocument.userId': userIdHex } });

        // changeStream.on('change', (change) => {
        //     console.log(`Detected change in ${userId}'s history:`, change);
        //     // Emit the change to the client
        //     socket.emit('historyChange', change);
        //     });
    
        // Clean up the change stream when user disconnects
        socket.on('logout', (userId) => {
            console.log(`User ${userId} disconnected`);
            changeStream.close();
            delete users[userId]; // Remove this user's socket
            });
    });
  });

// Multer configuration for file validation. 
// const upload = multer({
//     dest: 'uploads/', // Temporary storage location
//     fileFilter: (req, file, cb) => {
//       // Validate file type
//       if (file.mimetype == 'text/plain' || file.mimetype == 'application/pdf' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//         // Accept file
//         cb(null, true);
//       } else {
//         // Reject file
//         cb(null, false);
//         cb(new Error('Only .txt, .pdf and .docx format allowed!'));
//       }
//     }
//   });
  
// request paths
// Route to handle file upload
// app.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       // No file was uploaded, or wrong file type
//       return res.status(400).send('Invalid file type. Only .png, .jpg and .jpeg are allowed');
//     }
  
//     // File was uploaded & validated. Now we insert its data into the MongoDB database.
//     const fileData = {
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//       path: req.file.path,
//       uploadDate: new Date(),
//     }
  
//     db.collection('uploads').insertOne(fileData, (err, result) => {
//       if (err) {
//         console.error('Error inserting document into MongoDB', err);
//         return res.status(500).send('Error occurred while saving file data')
//       }
  
//       console.log('Successfully inserted document into MongoDB', result);
//       res.send('File uploaded and data stored successfully')
//     })
//     })

    //   let data = await collection.find({}).toArray();
    //   res.json(data);

app.post('/registration', async (req, res) => {
    const db = client.db('resGen')
    const collection = db.collection('users')
    try {
        const existingUser = await collection.findOne({ username: req.body.username })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
    
        const existingEmail = await collection.findOne({ email: req.body.email })

        if (existingEmail) {
            return res.status(400).json({ message: 'this Email is already in use.' })
        }
    // Hash the password before saving in the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = {
        // user_id: reversed and hashed username?
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email

    }
    
    let result = await collection.insertOne(user);
    console.log(result)

    res.status(201).json({ message: 'User created', userId: result.insertedId })
    } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error })
    }
})
 
app.post('/login', async (req, res) => {
    const db = client.db('resGen')
    const collection = db.collection('users') 
    const document = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const existingUser = await collection.findOne({ username: document.username })
    const correctPass = await bcrypt.compare(document.password, hashedPassword)
    let userpass = await collection.findOne({ username: document.username })
    let userId = userpass._id.toString
    if (!existingUser) {
        return res.status(400).json({ message: 'Incorrect Uname' })
    } else if (!correctPass) {
        return res.status(400).json({ message: 'Incorrect Password' })
    } else {
        return res.status(200).json({message: "Login Successful", user: userpass._id})
    }
})

app.post('/historyPost', async (req, res) => {
    const db = client.db('resGen')
    const document = req.body
    // document['"date"'] = new Date(document.date)
    console.log("ID Here:", req.headers.id)
    const collection = db.collection('history')

    try {
        await collection.insertOne(document)
        res.json({ message: 'History data stored successfully' })
        console.log("History data sent to server.", document)
    } catch (error) {
        console.error(`Error occurred while inserting document: ${error}`, "\n\nREQUEST BODY:\n\n",req.body)
        res.status(500).json({ message: 'An error occurred' })
    }
})
// 6498f47069eb98ab30632b81 for anotheruser1
app.get('/historyGet', async (req, res) => {
    const db = client.db('resGen');
    try {
        const collection = db.collection('history');
        const data = await collection.find({userid: req.headers.id}).toArray();
        res.json(data);
    //   console.log(data)
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
})

// this should maybe be in a seperate class than any tasks that have to do with the database. maybe an externalApi class or something
app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
            messages: [{role:"system",content:"You are to respond to requests for polished resume's and cover letters, helping job seekers match these documents to job descriptions they also provide you."},{role: "user", content: req.body.prompt}],
            temperature: 0.1,
            max_tokens: 2000,
            
        })
    }
    try{
        options.body["stream"] = true
        const response = await fetch("https://api.openai.com/v1/chat/completions", options)
        const data = await response.json()
        res.send(data)
    }catch(error){
        console.log(error)
        console.log(`these were your options: ${options}`)
    }
})

app.listen(PORT, () => console.log("Your server is listening on port: "+ PORT))