const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');


var cors = require('cors')
var app = express()
app.use(cors())
app.get('/products/:id', function(req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})

app.listen(80, function() {
    console.log('CORS-enabled web server listening on port 80')
})


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