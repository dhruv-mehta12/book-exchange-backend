const config = require('./config');
const db = require('./database');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const logger = require('./logger')
const sendMail = require('./mailer')

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
    res.send("You've reached the home route")
})


app.get('/books/:uid', async (req, res) => {
    try{
        const user_uid = req.params.uid;
        logger.info(`request received for ${user_uid}`);
        const booksForExchange = await db.collection('books').get();
        const books = []

        booksForExchange.docs.forEach((book)=>{
            books.push(book.data())
        })

        res.json(books)
    } catch(err){
        res.status(500).send(err.message)
    }
})

// /search/books?title=&user=
app.get("/search/books", async (req, res) => {
    const title = req.query.title
    const user = req.query.user

    logger.info(`search request for book title : ${title}; by user : ${user}`)

    try{
        const promise = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`);
        const results = await promise.json();

    res.send(results.items)
    } catch(e){
        logger.error(e.message)
    }
})

app.post("/add/book", async (req, res) => {
    // const {title, thumbnail, user, name} = req.body;
    const book = req.body
    try{

        await db.collection('books').add(book)
        await db.collection('user-books').doc(book.owner_uid).collection('books').add(book)
        res.status(200)
    } catch(e){
        res.status(500)
    }
})

app.get("/mycollection/:user", async (req, res) => {
    const user = req.params.user
    logger.info(`fetching collections for user : ${user}`)
    try {
        const promise = await db.collection('user-books').doc(user).collection('books').get()
        const mycollection = []

        promise.docs.forEach((book) => {
            mycollection.push(book.data())
        })

        if (mycollection.length != 0){
            res.send(mycollection).status(200)
        } else {
            res.status(404).send(mycollection)
        }

    } catch(e){
        logger.error(e)
    }
})

app.post("/request-book", async (req, res) => {
    const {to, from, book} = req.body;
    
    console.log(from, to, book)
    sendMail(from, to, book)
})

PORT = config.port
app.listen(PORT, ()=>{
    logger.info(`server started on ${PORT}`)
})
