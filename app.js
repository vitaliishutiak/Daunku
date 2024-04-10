const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config()


app.use(express.json())
app.use(express.static('public'))

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD}@cluster0.1vatyqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('connect to mongoDb')
})

const Goods = mongoose.model('Goods',{title:String,price:Number})

app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','admin','index.html'))
})

app.post('/add-goods',async (req,res)=>{
    try{

        const {title} = req.body
        const {price} = req.body
        const goods = new Goods({title,price})
        await goods.save()
        console.log('goods created')
        res.status(201).json(goods)
    }
    catch(err){
        res.status(500).json({message:err})
    }
    
})



app.get('/goods',async(req,res)=>{
    try{
        const goods = await Goods.find()
        res.json(goods)
    }
    catch(err){
        res.status(500).json({message:err})
    }
})



app.delete('/goods/:id',async (req,res)=>{
    try{
        const id = req.params.id
        console.log(id)
        await Goods.findByIdAndDelete(id)
        res.status(204).json({message:"successful"})
    }
    catch(err){
        res.status(500).json({message:err})
    }
})

app.put('/edit-goods/:id',async(req,res)=>{
    try{
        const goods = await Goods.findByIdAndUpdate(req.params.id ,req.body, {new:true})
        res.status(201).json(goods)
    }
    catch(err){
        res.status(400).json({message:err})
    }
})



app.listen(port,()=>{
    console.log('server work')
})