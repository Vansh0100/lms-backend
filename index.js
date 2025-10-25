const express=require('express');
const cors=require('cors');
const app=express();

// importing models
const UserModel=require('./models/UserModel');
const BookModel=require('./models/BookModel');
const connection=require('./connection')


const PORT=4000

app.use(cors());
app.use(express.json());


// creating requests

app.get("/",async (req,res)=>{
    return res.json("Welcome to Library Management Portal");
})

// getting all users
app.get("/getAllUsers",async (req,res)=>{
    const response=await UserModel.find();
    console.log(response);
    if(response.length==0){
        return res.status(200).json({"message":"Data is empty"});
    }
    else{
    return res.status(200).json({"response": response});
    }
})

app.get("/findById/:email",async (req,res)=>{
    const {email}=req.params
    // console.log(id);
    const find=await UserModel.findOne({email:email});
    if(find!=null){
        return res.json({
            "user":find
        })
    }
    else{
        return res.json({"message":"User not found"});
    }
})
// registering user
app.post("/registerUser",async (req,res)=>{
    const data=req.body
    console.log(data)
    const findUser=await UserModel.findOne({email:data.email})

    if(findUser!=null){
        return res.json({isPresent:0});
    }
    else{
        const user=await UserModel.create(data);
        return res.json({
            isPresent:1
        })
    }
})

// validating user
app.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body
        const isPresent=await UserModel.findOne({email:email});
        if(isPresent==null){
            return res.send({
                "isPresent":-1,
            })
        }
        else{
            // console.log(isPresent);
            if(password===isPresent.password){
                return res.status(200).send({
                    "isPresent":1,
                })
            }
            else{
            return res.status(200).send({
                "isPresent":0,
            });
            }
        }
    } catch (error) {
        console.log(err);
    }
})

app.get('/getAllBooks',async (req,res)=>{
    try {
        const bookData=await BookModel.find();
        if(bookData==null){
            return res.json({
                data:null
            })
        }
        else{
            return res.json({
                data:bookData
            })
        }
    } catch (error) {
        console.log(error);
    }
})
app.post('/postBooks',async (req,res)=>{
    try{
        const data=req.body
        const postBooks=await BookModel.insertMany(data);
        if(postBooks==null){
            return res.json({
                "message":"Insertion Failed!"
            })
        }
        else{
            return res.json({
                "message":"Insertion Successfull!",
                data:data
            })
        }
    }
    catch(error){
        console.log(error);
    }
})
app.post('/searchBooks',async (req,res)=>{
    try {
        const {title}=req.body;
        const getBooks=await BookModel.find({
            title:{$regex:title,$options:"i"}
        })
        if(getBooks==null){
            return res.json({
                error:`No books for title ${title}`
            })
        }
        else{
            return res.json({
                data:getBooks
            })
        }
    } catch (error) {
        console.log(error);
    }
})
app.post("/insertBook",async (req,res)=>{
    try {
        const data=req.body
        const isPresent=await BookModel.findOne({title:data.title});
        if(isPresent==null){
            const insertBook=await BookModel.insertMany(data);
            return res.json({
                data:insertBook
            });
        }
        return res.json({
            error:"Book Already exists with same title!"
        })
        
    } catch (error) {
        console.log(error);
    }
})
app.put('/updateBook/:title',async(req,res)=>{
    try {
        const {title}=req.params
        const data=req.body
        const isPresent=await BookModel.findOneAndUpdate({title:title},data);
        if(isPresent==null){
            return res.json({
                error:"Book with given title not exists!"
            })
        }
        return res.json({
            data:isPresent
        })
    } catch (error) {
        console.log(error)
    }
})
app.delete('/deleteBook/:title',async(req,res)=>{
    try {
        const {title}=req.params
        const isPresent=await BookModel.findOneAndDelete({title:title});
        if(isPresent==null){
            return res.json({
                error:"Book with given title not exists!"
            })
        }
        return res.json({
            data:isPresent
        })
    } catch (error) {
        console.log(error)
    }
})
app.listen(PORT,()=>{
    connection().then(()=>console.log("Server is up and running!")).catch((err)=>console.log("error-->",err));
})