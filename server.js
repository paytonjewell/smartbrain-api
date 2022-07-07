const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {res.send('all good!')})


// sign in
app.post('/signin', signin.handleSignIn(db, bcrypt))


// register
app.post('/register', register.handleRegister(db, bcrypt))


// profile:id - not currently implemented on the front end
// app.get('/profile/:id', (req, res) => {profile.getProfile(req, res, db)})


// image
app.put('/image', image.handleImageSubmission(db))
app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res)
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
});