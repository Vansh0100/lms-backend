const mongoose=require('mongoose');

const BookSchema=new mongoose.Schema({
    title:String,
    publicationYear:Number,
    author:String,
    genre:String,
    description:String
})
const BookModel=mongoose.model("Books",BookSchema);
module.exports=BookModel;