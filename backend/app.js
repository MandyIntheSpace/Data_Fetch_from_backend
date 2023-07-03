const express = require('express')
const mysql = require('mysql')
const mysql1 = require('mysql')
// const dotenv = require('dotenv')
const path = require('path')
const app = express()
const cors = require('cors')
const fs = require('fs')
const url = require('url')
PORT = 5000
const nodemailer = require('nodemailer')
const router = require('router')
const multer = require('multer')
// app.use(express.static('./productImage'))
app.use('/productImage', express.static(path.join(__dirname, 'productImage')));

app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './productImage'))
    },

    filename: (req, file, cb) => {
        console.log(file)
        const fileName = Date.now() + path.extname(file.originalname)
        const cleanFileName = fileName.replace("C:\\fakepath\\", "");
        cb(null, cleanFileName)
    }

})

const limits = {
    fileSize: 10 * 1024 * 1024
};

const upload = multer({storage: storage, limits: limits})

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
    else {
        console.log('The database was successfully connected')
        // res.sendStatus(200)
    }
})

app.post('/adminlogin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const admin = await db.query("Select * from adminlogin where username = ? and password = ?", [username, password])

    if (admin.length > 0) {
        res.status(401).json({
            success: false,
            message: "Invalid"
        })
    }
    else {
        res.status(200).json({
            success: true,
            admin: admin[0]
        })
    }
})



app.post('/addProduct', upload.single('productImage'), (req, res) => {
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productCategory = req.body.productCategory;
    const productImage = req.file.filename;

    const query = 'INSERT INTO addproduct (productName, productPrice, productCategory, productImage) VALUES (?,?,?,?)'
    db.query(query, [productName, productPrice, productCategory, productImage], (err, result) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
        }
        else{
            console.log('The product has been successfully added')
            res.sendStatus(200)
        }
    })
    console.log(req.body)
})


app.get('/fetchProduct', async (req, res) => {
    await db.query("select * from addproduct", (err, result) => {
        if (err) {
            req.setEncoding({ err: err })
        }
        else {
            res.send({ pro: result })
        }
    })
})

app.listen(PORT, () => {
    console.log(`The server has started on the ${PORT}`)
})
