const express = require('express')
const mysql = require('mysql')
const express1 = require('express')
const mysql1 = require('mysql')
// const dotenv = require('dotenv')
const path = require('path')
const app = express()
const cors = require('cors')
const fs = require('fs')
const url = require('url')
PORT = 5001
const nodemailer = require('nodemailer')
const router = require('router')

app.use(cors())
app.use(express1.json())

const db = mysql1.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'practise'
})

db.connect((error) => {
    if (error) {
        console.log(`The error have occured ${error}`)
    }
    else{
        console.log('The database was successfully connected')
    }
})

