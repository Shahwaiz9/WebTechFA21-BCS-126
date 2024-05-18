require('../models/database');
const Category=require('../models/Category');



const { title } = require("process");

exports.homepage=async(req,res)=>{

    try{
        const limitcat=5;
        const categories=await Category.find({}).limit(limitcat);


            
    res.render('index',{title: 'Cookbook Community',categories});

    }catch(error){
        console.log(error)
    }
}

// async function insertDymmyDataCategory(){
//     try{
//         await Category.insertMany(
//             [
//                 {
//                     "name":"American",
//                     "image":"americanfood2.jpg"
//                 },
//                 {
//                     "name":"Pakistani",
//                     "image":"pakistanfood.jpg"
//                 },
//                 {
//                     "name":"Chinese",
//                     "image":"chinesefood2.jpg"
//                 },
//                 {
//                     "name":"Spanish",
//                     "image":"spanishfood2.jpg"
//                 },
//                 {
//                     "name":"Thai",
//                     "image":"thaifood2.jpg"
//                 },
//                 {
//                     "name":"Mexican",
//                     "image":"mexicanfood2.jpg"
//                 }
//             ]

//         );
        
//     }catch(error){
//         console.log(error +' in insertdatadum')
//     }
// }
//   insertDymmyDataCategory();