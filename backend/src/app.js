//DESCRIPTION: configures express, define middlewares and connect routers

//NOTES:
//  routes is used to avoid clutter of all functions inside this file
//      meaning, for userRouter leads to the user where inside user are organized in diff operations 
//      the operations are compiled inside a controller: userController
//  'use' is a method from express that accepts all requests: get, post
//  ussing session makes the property persistent as the req

require('dotenv').config();

//IMPORTS
// -- import third-party mod --
const express = require("express"); 
// -- import built-in mod --
const path = require("path");
// import local mod --
const userRouter = require('./routes/user'); 
const adminRouter = require('./routes/admin');
const orgRouter = require('./routes/org');
const sponsorRouter = require('./routes/sponsor')

const db = require('./config/db'); // for test only

//middleware: for creating session
const session = require("express-session");

const app = express(); 


//define scope of the middleware: app.use( //scope )
//middleware: for parsing
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); //configure: translates req into json format

//middleware: session
app.use(
    //configure: lets server remember users
    session({
        secret: "goodness grey shoes", //adds cryptographic signature at the end of session id  
        saveUninitialized: false, //avoids saving sessions from users not logged in n(visitors)
        resave: false,
        cookie: {
            maxAge: 86400000 //log in expires after 24hrs
        }
    })
);


//middleware: routers
//how it works: mount userRouter to user path meaning call userRouter when path '/user' match 
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/org', orgRouter);
app.use('/api/sponsor', sponsorRouter)


// middleware: serve frontend files (non-dynamic) directly to browser; no need manual routes
app.use(express.static(path.join(__dirname, "../../frontend")));
// app.use(express.static(path.join(process.cwd(), "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/home.html"));
    // res.sendFile(path.join(process.cwd(), "frontend/home.html"));
});

//handless the links for admin
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use('/uploads', express.static(path.join(__dirname, './uploads')));
// app.use('/uploads', express.static('/Users/Trisha/Desktop/Pawradise-WebApp/backend/uploads'));

const uploadsPath = path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsPath));

//for test only: go to localhost:3000/test-db
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user');
        console.log("Database response:", rows);
        
        res.json({ 
            message: "db connection successful", 
            table_data: rows 
        });
    } catch (err) {
        console.error("db onnection failed:", err.message);
        
        res.status(500).json({ 
            message: "Database connection failed!", 
            error: err.message 
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;