const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')

const mongoose = require('mongoose')
const db = "mongodb+srv://marcopolo:supersecret@cluster0.xwrxt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

let products = [
    {
        "id": 0,
        "title": "PlayStation 1",
        "short_description": "First Gaming Console",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        "id": 1,
        "title": "PlayStation 2",
        "short_description": "Second Gaming Console",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        "id": 2,
        "title": "PlayStation 3",
        "short_description": "Third Gaming Console",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        "id": 3,
        "title": "PlayStation 4",
        "short_description": "Fourth Gaming Console",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        "id": 4,
        "title": "PlayStation 5",
        "short_description": "Fifth Gaming Console",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
]

mongoose.connect(db, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Connected to mmongodb')
    }
})

router.get('/', (req, res) => {
    res.send('Hello from server')
})

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)

    user.save((err, registeredUser) => {
        if (err) console.error(err)
        else {
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'secret')
            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({email: userData.email}, (err, user) => {
        if (err) console.error(err)
        else {
            if (!user) {
                res.status(401).send('Invalid email')
            } else {
                if (user.password !== userData.password) {
                    res.status(401).send('Invalid password')
                } else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secret')
                    res.status(200).send({token})
                }
            }
        }
    })
})

router.get('/products', (req, res) => {
    res.json(products)
})

router.post('/products', (req, res) => {
    let productIndex = products.findIndex(product => product.id == req.body.id)
    products[productIndex] = req.body

    res.json(products)
})

router.delete('/products', (req, res) => {
    products = products.filter(product => product.id !== req.body.id)
    
    res.json(products)
})

module.exports = router