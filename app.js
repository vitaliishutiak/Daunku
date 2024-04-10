const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')

require('dotenv').config()


app.use(express.json())
app.use(express.static('public'))

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD}@cluster0.1vatyqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('connect to mongoDb')
})

app.listen(port,()=>{
    console.log('server work')
})