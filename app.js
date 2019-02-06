const express   =   require("express");
const app       =   express();
const bodyParser=   require("body-parser");
const cors      =   require("cors")
const mongoose  =   require("mongoose");

//Connecting to mongoose
mongoose.connect("mongodb://henil:face12@ds123635.mlab.com:23635/facerecognition",{ useNewUrlParser: true });

//Schema
var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    score:Number,
})

var User = mongoose.model("User" , userSchema);

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    User.find({},function(err,users){
        if(err){
            res.json(err);
        }
        else {
            res.json(users);
        }
    })
    // res.json(database.users);
})

app.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    let found = false;
    User.find({},function(err,users){
        users.forEach(function(user){
            if(user.email === email && user.password === password){
                found = true;
                res.json(user);
            }
        })
        if(!found)
            res.status(400).json('Error');
    })
    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     res.json(database.users[0]);
    // }
    // else{
    //     res.status(400).json('Error');
    // }
})

app.post('/register',(req,res)=>{
    const {email, name, password } = req.body;
    if(email=="" || name =="" || password==""){
        return res.status(400).json('Error');
    }
    var newUser = {
        name:name,
        email:email,
        password:password,
        score:0
    }
    User.create(newUser,function(err,user1){
        if(err){
            res.status(400).json('Error');
        }else{
            console.log(user1);
            res.json(user1)
        }
    })
    // database.users.push({
    //     id:'3',
    //     name:name,
    //     email:email,
    //     password:password,
    //     score:0,
    //     joined:new Date()
    // })
    // res.json(database.users[database.users.length-1])
})

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    let found = false;
    database.users.forEach(user=>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(404).json("No such User");
    }
})


app.post('/image',(req,res)=>{
    const {id} = req.body;
    User.findById(id,function(err,user){
        if(err){
            res.status(404).json("No such User");
        }
        else{
            user.score++;
            user.save();
            return res.json(user.score);
        }
    })
    // let found = false;
    // database.users.forEach(user=>{
    //     if(user.id === id){
    //         found = true;
    //         user.score++;
    //         return res.json(user.score);
    //     }
    // })
    // if(!found){
    //     res.status(404).json("No such User");
    // }
})

app.listen(3000,()=>{
    console.log('Started')
})