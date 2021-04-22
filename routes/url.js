const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');


router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
});


// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten', async(req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');


    // Check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    // Create url code
    const urlCode = shortid.generate();

    // Check long url
    if (validUrl.isUri(longUrl)) {
        try {

            const shortUrl = baseUrl + urlCode;

            url = new Url({
                longUrl,
                shortUrl,
                urlCode,
                userId: "",
                date: new Date()
            });

            await url.save();

            res.json(url);
            // }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        res.status(401).json('Invalid long url');
    }
});

router.get('/', function(req, res, next) {

});
module.exports = router;