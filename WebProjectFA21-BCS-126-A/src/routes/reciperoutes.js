const express =require('express')
const router = express()

const recipeController=require("../controllers/recipecontroller")

//routes listing

router.get('/',recipeController.homepage)

router.get('/categories',recipeController.exploreCategories)




module.exports=router