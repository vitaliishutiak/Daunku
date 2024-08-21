const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const path = require('path');
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer");
const botToken = "6775759691:AAGo5HMH_yfkLK1ABUqCkcr8mAUjoBpWuX8";

const chatId = "1326603205";

const telegramBot = require("node-telegram-bot-api");

const bot = new telegramBot(botToken, { polling: false });

const multer = require('multer')


require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD}@cluster0.1vatyqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('connect to mongoDb')
})


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vitaliishutiak@gmail.com',
      pass: 'rwwx fdoy qcdg rtcd'
    }
  });

const Goods = mongoose.model('Goods',{title:String, price:Number, filename:String, path:String})
const AdminImage = mongoose.model('AdminImage',{filename:String, path:String})
const Email = mongoose.model('Email',{email:String})
const Orders = mongoose.model('Orders', { name: String, phone: String, addres: String, list: Array });
const Contacts = mongoose.model('Contacts',{email:String,address:String,phone:String})



const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads/')
    },
    filename: function(req, file ,cb){
        cb(null,Date.now()+ '-' + file.originalname);
    }
})
const storagePhoto = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/upload-admin-photo/')
    },
    filename: function(req, file ,cb){
        cb(null,Date.now()+ '-' + file.originalname);
    }
})

const upload = multer({storage:storage})
const uploadPhoto = multer({storage:storagePhoto})

app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','admin','index.html'))
})

app.post('/upload', upload.single('image'), async (req, res) => {
    try {

        const { filename, path } = req.file;
        const { price, title } = req.body;

        console.log(filename,path)
        let goods = new Goods({title,price,filename,path})

        await goods.save()
        console.log('goods created')

        res.status(201).send('Uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/upload-admin-photo', uploadPhoto.single('image'), async (req, res) => {
    try {

        const { filename,path }  = req.file;

        console.log(filename,path)


        let adminPhoto = new AdminImage({filename,path})

        await adminPhoto.save()
        console.log('goods created')

        res.status(201).send('Uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/send-code',async (req,res)=>{
    try {
        const {email}= req.body; 
        const {code} = req.body
        console.log(code)
        console.log(email)
        sendCode(email,code)

    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
})

app.post('/send-mail', async (req, res) => {
    try {
        const { email } = req.body; // Отримуємо поле email з запиту
  
        console.log(email);

        const mail = new Email({ email }); // Створюємо новий об'єкт електронної пошти з вказаним email

        await mail.save(); // Зберігаємо об'єкт електронної пошти в базі даних
        console.log('Mail created');
        res.status(201).json(mail); // Повертаємо успішну відповідь з об'єктом електронної пошти

    } catch (err) {
        res.status(500).json({ message: err.message }); // Повертаємо помилку у відповіді у випадку помилки
    }
});

function sendCode(arr,code){
    let mailOptions = {
        from: 'youremail@gmail.com',
        to: arr,
        subject: 'Sending Email using Node.js',
        text: `${code}`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
        
          console.log('Email sent: ' + info.response);
        }
      });
}


app.post('/orders', async (req, res) => {
    try {
        const { name, phone, addres, list } = req.body;
        console.log(req.body)
        const order = new Orders({ name, phone, addres, list });
        await order.save();

        let msg = "New Orders:"; // Почати повідомлення з заголовка
        let nameAdded = false;
let phoneAdded = false;
    let addressAdded = false;

for (const el of list) {
    msg += (!nameAdded ? '\nName: ' + name : '') +
           (!phoneAdded ? '\nPhone: ' + phone : '') +
           (!addressAdded ? '\nAddress: ' + addres : '') +
           '\nFlower: ' + el.title + ', Price: ' + el.price + ', Count: ' + el.sum 
    nameAdded = true;
    phoneAdded = true;
    addressAdded = true;
}

       
        bot.sendMessage(chatId, msg);

        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
  
  
app.post('/send-msg',async (req,res)=>{
    try{
        const{message} = req.body
        const email = await Email.find()
        let emails = [];
        for(let el of email){
            emails.push(el.email)
        }
        sendMail(emails,message)
        sendCode(code)
    }catch (err) {
        res.status(500).json({ message: err.message }); 
    }
})


function sendMail (arr,msg){
    let i = 0;
    let timerID =  setInterval(()=>{
        let mailOptions = {
            from: 'youremail@gmail.com',
            to: arr[i],
            subject: 'Sending Email using Node.js',
            text: msg
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
            
              console.log('Email sent: ' + info.response);
            }
          });
          i<arr.length-1?i++: clearInterval(timerID)
        
    },500)
}



// КІНЕЦЬ РОЗСИЛКИ НА ПОШТУ!

app.get('/goods',async(req,res)=>{
    try{
        const goods = await Goods.find()
        res.json(goods)
    }
    catch(err){
        res.status(500).json({message:err})
    }
})
app.get('/admin-photo',async(req,res)=>{
    try{
        const adminPhoto = await AdminImage.find()
        res.json(adminPhoto)
    }
    catch(err){
        res.status(500).json({message:err})
    }
})



app.get('/get-orders',async(req,res)=>{
    try{
        const orders = await Orders.find()
        res.json(orders)
    }
    catch(err){
        res.status(500).json({message:err})
    }
})

app.delete('/goods/:id',async (req,res)=>{
    try{
        const id = req.params.id
        await Goods.findByIdAndDelete(id)
        res.status(204).json({message:"successful"})
    }
    catch(err){
        res.status(500).json({message:err})
    }
})
app.delete('/confirm/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Orders.findByIdAndDelete(id); // Змінився виклик методу видалення
        res.status(204).json({ message: "successful" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// ВІДПРАВКА І ВИТЯГ КОНТАКТНИГ ДАНИХ ДЛЯ САЙТУ !

app.post('/send-contacts',async (req,res)=>{
    try{
        const {email,address,phone} = req.body
        const contacts = new Contacts({email,address,phone})
        await contacts.save()
    }
    catch(err){
        res.status(500).json({message:err})
    }
})

app.get('/get-contacts',async(req,res)=>{
    try{
        const contacts = await Contacts.find()
        res.json(contacts)
    }
    catch(err){
        res.status(400).json({message:err})
    }
})

// ЗАКІНЧЕННЯ ! 

app.put('/edit-goods/:id',async(req,res)=>{
    try{
        const goods = await Goods.findByIdAndUpdate(req.params.id ,req.body, {new:true})
        res.status(201).json(goods)
    }
    catch(err){
        res.status(400).json({message:err})
    }
})




app.put('/edit-contacts/:id',async (req,res)=>{
    try{
        const contact = await Contacts.findByIdAndUpdate(req.params.id ,req.body, {new:true})
        res.status(201).json(contact)
    }
    catch(err){
        res.status(500).json({message:err})
    }
})



app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
