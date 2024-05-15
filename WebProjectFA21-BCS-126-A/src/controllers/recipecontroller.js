const { title } = require("process");


exports.homepage=async(req,res)=>{

    res.render('index',{title: 'Cookbook Community'});
}