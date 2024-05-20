const express =require('express')
const router = express()

const recipeController=require("../controllers/recipecontroller")

//routes listing

router.get('/',recipeController.homepage)


router.get('/recipe/:id',recipeController.exploreRecipe);
router.get('/categories',recipeController.exploreCategories)
router.get('/categories/:id',recipeController.exploreCategoriesbyID)
router.post('/search',recipeController.searchRecipe)

module.exports=router