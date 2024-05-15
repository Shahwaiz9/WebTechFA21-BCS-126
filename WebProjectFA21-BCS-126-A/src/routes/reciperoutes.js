const express =require('express')
const router = express()

const recipeController=require("../controllers/recipecontroller")

//routes listing

router.get('/',recipeController.homepage)





module.exports=router