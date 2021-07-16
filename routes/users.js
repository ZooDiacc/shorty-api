const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');






// Load User model
const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
    const { name, email, password, comfirmPassword } = req.body;
    let errors = [];

    if (!name || !email || !password || !comfirmPassword) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != comfirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (name.length < 2) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
     if (lastName.length < 2) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }


    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.status(500).json({
            errors,
            name,
            lastName,
            email,
            password,
            comfirmPassword
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    lastName,
                    email,
                    password,
                    comfirmPassword
                });
            } else {
                const newUser = new User({
                    name,
                    lastName,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save();
                        res.status(200).json({
                            msg: "Success"
                        })
                    });
                });
            }
        });
    }
});

// Login


router.post('/login', async(req, res, next) => {
    User.findOne({
            $or: [{
                email: req.body.email
            }, {
                username: req.body.username
            }]
        }).then(user => {
            if (user) {

                let errors = {};

                if (user.email == req.body.email) {
                    console.log("IN IT")
                    bcrypt.compare(req.body.password, user.password, function(err, result) {

                        if (result) {

                            const newtoken = jwt.sign({ name: user.name,lastName:user.lastName,email: user.email }, "ELYAS", { expiresIn: 86400 })
                            const verify = jwt.verify(newtoken, "ELYAS");
                            console.log("CRYPTé", newtoken)
                            console.log("no crypté", verify)

                            res.status(200).json({
                                name: user.name,
                                email: user.email,
                                token: newtoken
                            });
                        } else {
                            res.status(401).json({
                                message: "Unauthorized"
                            })
                        }
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;