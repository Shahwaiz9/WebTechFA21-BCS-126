const express =require('express')
const router = express()

const recipeController=require("../controllers/recipecontroller")

//routes listing

router.get('/',recipeController.homepage)


router.get('/recipe/:id',recipeController.exploreRecipe);
router.get('/categories',recipeController.exploreCategories)
router.get('/categories/:id',recipeController.exploreCategoriesbyID)
router.post('/search',recipeController.searchRecipe)
router.get('/explore-latest',recipeController.exploreLatest)

router.get('/explore-random',recipeController.exploreRandom)

router.get('/submit-recipe', recipeController.isAuthenticated, recipeController.submitrecipe);
router.post('/submit-recipe',recipeController.submitrecipeOnPost)

router.get('/sign-in',recipeController.SigninGet)
router.post('/sign-in',recipeController.SigninPost)

router.get('/log-in', recipeController.LoginGet);

// Route to handle login form submission
router.post('/log-in', recipeController.LoginPost);
router.get('/log-out', recipeController.LogOut);
module.exports=router