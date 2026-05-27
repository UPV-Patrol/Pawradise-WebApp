const mysql = require('mysql2');

//connection
const pool = mysql.createPool ({
    host: process.env.DB_HOST,          // host: 'localhost',       
    user: process.env.DB_USER,          // user: 'root',            
    password: process.env.DB_PASSWORD,  // password: '',         
    database: process.env.DB_NAME,      // database: 'upv_pawtrol',  
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,                // accomm only 10 people at the same time
    queueLimit: 0
});

const db = pool.promise();
module.exports = db; 