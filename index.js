const express = require("express");
const connectDB = require("./config/db")
const app = express();

connectDB();

app.use(express.json({ extented: false }));
const PORT = 5000;
app.listen(PORT, () => console.log('server running on port ${PORT}'));
