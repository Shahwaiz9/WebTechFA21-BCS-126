const express =require('express')
const router = express()

const recipeController=require("../controllers/recipecontroller")


router.get('/',recipeController.homepage)


router.get('/recipe/:id',recipeController.exploreRecipe);
router.get('/categories',recipeController.exploreCategories)
router.get('/categories/:id',recipeController.exploreCategoriesbyID)
router.post('/search',recipeController.searchRecipe)
router.get('/search',recipeController.searchRecipeGet)

router.get('/explore-latest',recipeController.exploreLatest)

router.get('/explore-random',recipeController.exploreRandom)

router.get('/submit-recipe', recipeController.isAuthenticated, recipeController.submitrecipe);
router.post('/submit-recipe',recipeController.submitrecipeOnPost)

router.get('/sign-in',recipeController.SigninGet)
router.post('/sign-in',recipeController.SigninPost)

router.get('/log-in', recipeController.LoginGet);
router.post('/log-in', recipeController.LoginPost);

router.get('/log-out', recipeController.LogOut);



router.get('/admin',recipeController.Admin)
router.get('/admin-log-in', recipeController.AdminLoginGet);
router.post('/admin-log-in', recipeController.AdminLoginPost);

router.get('/admin-log-out',recipeController.verifyjwt, recipeController.AdminLogOutPost);
router.post('/admin-signup',recipeController.adminsignup)


router.get('/edit-recipe/:id', recipeController.editget);
router.post('/edit-recipe/:id', recipeController.editpost);
router.post('/delete-recipe/:id', recipeController.deletepost);

module.exports=router