const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    ulrCode: String,
    longUrl: String,
    shortUrl: String,
    date: { type: String, default: date.now }
});

module.export = mongoose.model('url',urlSchema);