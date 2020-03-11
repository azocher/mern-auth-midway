// set imports
require('dotenv').config()
let jwt = require('jsonwebtoken');
let db = require('../models');
let router = require('express').Router()

// POST for login data
router.post('/login', function(req, res) {
    // find my user by their email 
    db.User.findOne({ email: req.body.email })
    .then( user => {
        // check that user or password exist in db
        if (!user || !user.password) {
            return res.status(404).send({ message: 'User not found! Error Error Error' });
        }

        // check if user matches password
        if (!user.isAuthenticated(req.body.password)) {
            return res.status(406).send({ message: 'Invalide Password. Try again.' });
        }

        // if user authenticated, create token
        let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 8
        });

        // send token as response
        res.send({ token });
    })
    .catch(err => {
        console.log(`ERROR on /login POST attempt: ${err}`);
        res.status(503).send({ message: "Incorrect login attempt. Check db and credentials." });
    })
})

// POST for signup data
router.post('/signup', function(req, res) {
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // if my user exist already
        if (user) {
            return res.status(409).send({ message: 'Email address already in db' });
        }

    // create new user in db
    db.User.create(req.body)
        .then(newUser => {
            let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 8
            })
            
            res.send({ token });
        })
    })
    .catch(err => {
        console.log(`Error on POST new user creation: ${err}`);
        res.status(500).send({ message: "new user not created. error"});
    })
})