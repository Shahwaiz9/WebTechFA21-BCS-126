require('../models/database');
const Category=require('../models/Category');
const Recipe=require('../models/Recipe');
const Products=require('../models/Products')
const User=require('../models/Users');
const Admin=require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')

const SECRET_KEY='Gurus'
let visited1=[];
let adminbool=false;
const { title } = require("process");
let logbool=false;
exports.homepage=async(req,res)=>{

    try{
        const featured=await Products.find({'isFeatured':true})
        const limitcat=6;
        const categories=await Category.find({}).limit(limitcat);
        const latest=await Recipe.find({}).sort({_id:-1}).limit(5)
       
        const thai= await Recipe.find({'category': 'Thai'}).limit(limitcat)
        const american= await Recipe.find({'category': 'American'}).limit(limitcat)
        const chinese= await Recipe.find({'category': 'Chinese'}).limit(limitcat)
        const food={latest,thai,american,chinese};
            
    res.render('index',{title: 'Cookbook Community',categories,featured,food,logbool:logbool,adminbool:adminbool});

    }catch(error){
        console.log(error)
    }
}
// categories get
exports.exploreCategories=async(req,res)=>{

    try{
        const limitcat=20;
        const categories=await Category.find({}).limit(limitcat);


            
    res.render('categories',{title: 'Cookbook Community',categories,logbool:logbool,adminbool:adminbool});

    }catch(error){
        console.log(error)
    }
}


//recipe by id shawo
exports.exploreRecipe=async(req,res)=>{

    try{
       let recid= req.params.id;
      let recipe=await Recipe.findById(recid);
        if(!recipe){
            console.log("unhere");
             recipe=await Products.findById(recid);
        }
        if(req.session.userId){
            if(!req.session.visited){
                req.session.visited=[]
            }
            if (!req.session.visited.includes(recipe)) {
                req.session.visited.push(recipe);
            }
        }
        
    res.render('recipe',{title: 'Cookbook Community',recipe,logbool:logbool,adminbool:adminbool});

    }catch(error){
        console.log(error)
    }
}

exports.Visited=async(req,res)=>{
try {
    visited1=req.session.visited;
    res.render("Visited2",{title: 'Cookbook Community',categbyID: visited1,logbool:logbool,adminbool:adminbool})
} catch (error) {
    console.log(error);
}
}








// categories id get
// exports.exploreCategoriesbyID=async(req,res)=>{

//     try{
//         let cid=req.params.id
//         let page = parseInt(req.query.page) || 1; // Current page number, default is 1
//         let limit1 = parseInt(req.query.limit) || 2;
//         const categbyID=await Recipe.find({'category':cid}).skip((page-1)*limit1).limit(limit1)
   
//     res.render('recipecategories',{title: 'Cookbook Community',categbyID,cid});

//     }catch(error){
//         console.log(error)
//     }
// }

exports.exploreCategoriesbyID = async (req, res) => {
    try {
         let cid = req.params.id;
        let page = parseInt(req.query.page) || 1; // Current page number, default is 1
        let limit = parseInt(req.query.limit) || 2; // Number of recipes per page, default is 2

        let recipes = await Recipe.find({ 'category': cid })
                                  .skip((page - 1) * limit)
                                  .limit(limit);

        let totalRecipes = await Recipe.countDocuments({ 'category': cid });
        let totalPages = Math.ceil(totalRecipes / limit);

        res.render('recipecategories', {
            title: 'Cookbook Community',categbyID: recipes,cid: cid,currentPage: page,totalPages: totalPages,limit: limit,logbool:logbool,adminbool:adminbool});

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.searchRecipe=async(req,res)=>{
    try {
        const searchTerm = req.body.searchTerm || req.query.searchTerm;
        res.redirect(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
        console.log(error);
    }
}
exports.searchRecipeGet = async (req, res) => {
    try {
        const searchterm = req.body.searchTerm || req.query.searchTerm;
        const page = parseInt(req.query.page) || 1; // Current page number, default is 1
        const pageSize = 2; // Number of recipes per page

        // Store the search term in the session
        if(req.session.userId){
        if (!req.session.terms) {
            req.session.terms = [];
        }
        if (!req.session.terms.includes(searchterm)) {
            req.session.terms.push(searchterm);
        }
    }

        // Find the total number of recipes that match the search term
        const totalRecipes = await Recipe.countDocuments({ $text: { $search: searchterm, $diacriticSensitive: true } });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalRecipes / pageSize);

        // Retrieve recipes for the current page
        const recipes = await Recipe.find({ $text: { $search: searchterm, $diacriticSensitive: true } })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.render('search', {
            title: 'Cookbook Community',
            recipes,
            logbool: logbool,
            adminbool: adminbool,
            searchTerms: req.session.terms,
            currentPage: page,
            totalPages: totalPages,
            searchTerm: searchterm
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};



exports.exploreLatest=async (req,res)=>{
    try{
        let page = parseInt(req.query.page) || 1; // Current page number, default is 1
        let limit = parseInt(req.query.limit) || 3;
        const latest=await Recipe.find({}).sort({_id:-1}).skip((page - 1) * limit).limit(limit);
        
        let totalPages = Math.ceil(10 / limit);
        res.render("explorelatest",{title:'Cookbook Community',latest,currentPage: page,totalPages: totalPages,limit: limit,logbool:logbool,adminbool:adminbool})
    }catch(error){
        console.log(error)
    }

}
exports.exploreRandom=async (req,res)=>{
    try{
        let page = parseInt(req.query.page) || 1; // Current page number, default is 1
        let limit = parseInt(req.query.limit) || 3;
        let count=await Recipe.find().countDocuments()
        let random=Math.floor(Math.random() * count);
        let recipe=await Recipe.find().skip(random).limit(4).exec();
        const latest=await Recipe.find({}).sort({_id:-1}).skip((page - 1) * limit).limit(limit);
        
        let totalPages = Math.ceil(10 / limit);

        res.render("explorerandom",{title:'Cookbook Community',recipe,currentPage: page,totalPages: totalPages,limit: limit,logbool:logbool,adminbool:adminbool})
    }catch(error){
        console.log(error)
    }

}
exports.submitrecipe=async (req,res)=>{
    try{  
        const infoerrorobj=req.flash('infoErrors')
        const infosubobj=req.flash('infoSubmit')
        res.render('submitrec',{title:'Cookbook Community',infoerrorobj,infosubobj,logbool:logbool,adminbool:adminbool})
    }catch(error){
        console.log(error);
    } 
}
exports.submitrecipeOnPost=async (req,res)=>{
    try{  


        let imageUploadFile;
        let uploadPath;
        let newImageName;


        if(!req.files || Object.keys(req.files).length ===0){
            console.log('No Files were uploaded')
        }else{
            imageUploadFile=req.files.image;
            newImageName=Date.now() + imageUploadFile.name;
            uploadPath=require('path').resolve('./') + '/public/uploads/' +newImageName;

            imageUploadFile.mv(uploadPath,function(err){
                if(err) return res.status(500).send(err);
            })
        
        }







        const recipen=new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email ,
            ingredients:  req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });
        await recipen.save();


        req.flash('infoSubmit','Recipe is added successfully')
        res.redirect('/submit-recipe')   
    }catch(error){
        console.log(error)
        req.flash('infoErrors', error)
        res.redirect('/submit-recipe')
    } 
}




// login and signin

exports.SigninGet= async (req,res)=>{
    try {
        const infoerrorobj=req.flash('infoErrors')
        const infosubobj=req.flash('infoSubmit')
        res.render('Signin',{title:'Cookbook Community',infoerrorobj,infosubobj,logbool:logbool,adminbool:adminbool})

    } catch (error) {
        console.log(error)
    }

}
exports.SigninPost= async (req,res)=>{
    try {
        


        const usersub=new User({
            username: req.body.username,
            email: req.body.email1 ,
            password:req.body.password
           
        });
        await usersub.save();
        req.flash('infoSubmit','Recipe is added successfully')



        res.redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('infoErrors', error)

        res.redirect('/sign-in')
    }
}

exports.LoginGet= async (req,res)=>{
    try {
        const infoerrorobj=req.flash('infoErrors')
        const infosubobj=req.flash('infoSubmit')
        res.render('Login',{title:'Cookbook Community',infoerrorobj,infosubobj,logbool:logbool,adminbool:adminbool})

    } catch (error) {
        console.log(error)
    }

}
exports.LoginPost = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
  
      if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        return res.redirect('/submit-recipe');
      } else {
        req.flash('infoErrors', 'Invalid email or password');
        return res.redirect('/log-in');
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
  };
  
  exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        logbool=true;
      return next();
    } else {
      req.flash('infoErrors', 'You must be logged in to access this page');
      return res.redirect('/log-in');
    }
  };


  exports.LogOut = (req, res) => {
    req.session.destroy((err) => {
        logbool=false
      if (err) {
        return res.status(500).send('Could not log out.');
      } else {
        return res.redirect('/log-in');
      }
    });
  };
  
 
  

// exports.adminsignup=async (req,res)=>{
//     const {username,email,password}=req.body;
//     try{

//             const hashp=await bcrypt.hash(password,10);
//             const adm=await Admin.create({
//                 username: req.body.username,
//                 email: req.body.email ,
//                 password:req.body.password
               
//             });
//             const token=jwt.sign({email:adm.email,id:adm._id},SECRET_KEY,{ expiresIn: '15m' })
//             res.status(201).json({admin:adm,token:token})


//     }catch(error){
//         console.log(error)
//     }
// }


exports.adminsignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashp = await bcrypt.hash(password, 10);
        const adm = await Admin.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        const token = jwt.sign({ email: adm.email, id: adm._id }, SECRET_KEY, { expiresIn: '15m' });
        res.status(201).json({ admin: adm, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.AdminLoginGet =async (req,res)=>{
    try {
        const infoerrorobj=req.flash('infoErrors')
        const infosubobj=req.flash('infoSubmit')
        res.render('LoginAdmin',{title:'Cookbook Community',infoerrorobj,infosubobj,logbool:logbool,adminbool:adminbool})

    } catch (error) {
        console.log(error)
    }

}
// exports.AdminLoginPost = async (req, res) => {
//     try {
//       const { email, password } = req.body;
//     const adminfind=await Admin.findOne({email:email})
//     if(!adminfind){
//         console.log("not found email")
//         res.redirect('/admin-log-in')
//     }

//     const matchp=await bcrypt.compare(password,adminfind.password)
//     if(!matchp){
//         console.log("not found password")
//         res.redirect('/admin-log-in')
//     }
//     adminbool=true; 

//     const token=jwt.sign({email:adminfind.email,id:adminfind._id},SECRET_KEY,{ expiresIn: '15m' })

//     res.render('Admin1',{title:'Cookbook Community',logbool:logbool,adminbool:adminbool})
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send('Internal Server Error');
//     }
//   };

  exports.Admin=async (req,res)=>{
    try {
        let recipes = await Recipe.find({ })
                                  


        res.render('Admin1', {
            title: 'Cookbook Community',categbyID: recipes,logbool:logbool,adminbool:adminbool});

       
    } catch (error) {
        console.log("error")
    }
  }
//   exports.AdminLogOutPost = async (req, res) => {
//     try {
       
//         if (!req.headers.authorization) {
//             return res.status(400).json({ error: 'Authorization header missing' });
//         }

//         const token = req.headers.authorization.split(' ')[1];

//         blacklistedTokens.add(token);

//         res.redirect('/')
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.verifyjwt=async(req,res,next)=>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        
        req.user = decoded;
        next();
    });
    next();
}


const blacklistedTokens = new Set();
exports.AdminLoginPost = async (req, res) => {
    // try {
    //     const { email, password } = req.body;
    //     const adminfind = await Admin.findOne({ email: email });
    //     if (!adminfind) {
    //         console.log("not found email")
    //         res.status(401).json({ error: 'Invalid email or password' });
    //     }
    //     const matchp = await bcrypt.compare(password, adminfind.password);
    //     if (!matchp) {
    //         console.log("not found password")
    //         res.status(401).json({ error: 'Invalid email or password' });
    //     }
    //     const token = jwt.sign({ email: adminfind.email, id: adminfind._id }, SECRET_KEY, { expiresIn: '15m' });
    //     res.cookie('token', token, { httpOnly: true }); 
    //     adminbool=true;
    //     res.redirect('/admin'); 
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
    try {
        const { email, password } = req.body;
        const adminfind = await Admin.findOne({ email: email });
        if (!adminfind) {
            console.log("not found email");
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const matchp = await bcrypt.compare(password, adminfind.password);
        if (!matchp) {
            console.log("not found password");
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: adminfind.email, id: adminfind._id }, SECRET_KEY, { expiresIn: '15m' });
        res.cookie('token', token, { httpOnly: true }); 
        adminbool = true;
        res.redirect('/admin'); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

exports.AdminLogOutPost = async (req, res) => {
    try {
        const token = req.cookies.token;
        blacklistedTokens.add(token); // Assuming you have a mechanism to store blacklisted tokens
        res.clearCookie('token'); // Clear JWT token cookie
        adminbool = false;
        res.redirect('/'); // Redirect to home page or any other desired location
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.editget = async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);
        const name2 = recipe.name;
        res.render('EditRec', {
            title: 'Cookbook Community',
            logbool: logbool,
            adminbool: adminbool,
            id,
            name2
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};



exports.editpost = async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);
        const name2=recipe.name;
        if (!recipe) {
            req.flash('infoErrors', 'Recipe not found');
            return res.redirect('/');
        }

        let imageUploadFile;
        let uploadPath;
        let newImageName = recipe.image; // Use existing image name as default

        if (req.files && Object.keys(req.files).length > 0) {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err);
            });
        }

        await Recipe.updateOne(
            { name:name2},
            {
                name: req.body.name,
                description: req.body.description,
                email: req.body.email,
                ingredients: req.body.ingredients,
                category: req.body.category,
                image: newImageName,
            }
        );

        req.flash('infoSubmit', 'Recipe updated successfully');
        res.redirect('/');
    } catch (error) {
        console.log(error);
        req.flash('infoErrors', error.message);
        res.redirect('/');
    }
};

exports.deletepost = async (req, res) => {
    try {
        const id = req.params.id;
        await Recipe.deleteOne({ _id: id });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};



















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

// async function insertDymmyDatarecipe(){
//     try{
//         await Products.insertMany(
//             [{
//                 "name": "Crab cakes",
//                 "description": "\n        Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie dish with a little of the butter.\n        For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.\n        Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.\n        Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.\n        For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.\n        Mix in 6 tablespoons of lime juice, then pour the filling into the pie crust and level over with the back of a spoon.\n        Return to the oven for 15 minutes, then place on a wire rack to cool.\n        Once cooled, refrigerate for 6 hours or overnight.\n        To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.\n    \n        Source: https://www.jamieoliver.com/recipes/fruit-recipes/key-lime-pie/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "4 large free-range egg yolks",
//                   "400 ml condensed milk",
//                   "5 limes",
//                   "200 ml double cream"
//                 ],
//                 "category": "American",
//                 "image": "crab-cakes.jpg",
//                 "isFeatured": "true",
//               },
//               {
//                 "name": "Thai-style mussels",
//                 "description": "Wash the mussels thoroughly, discarding any that aren’t tightly closed.\n        Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.\n        In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.\n        \n        Source: https://www.jamieoliver.com/recipes/seafood-recipes/thai-style-mussels/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "1 kg mussels , debearded, from sustainable sources",
//                   "groundnut oil",
//                   "4 spring onions",
//                   "2 cloves of garlic",
//                   "½ a bunch of fresh coriander"
//                 ],
//                 "category": "Thai",
//                 "image": "thai-style-mussels.jpg",
//                 "isFeatured": "true",
//               },
//               {
//                 "name": "Thai-style mussels",
//                 "description": "Peel and crush the garlic, then peel and roughly chop the ginger. Trim the greens, finely shredding the cabbage, if using. Trim and finely slice the spring onions and chilli. Pick the herbs.\n        Bash the lemongrass on a chopping board with a rolling pin until it breaks open, then add to a large saucepan along with the garlic, ginger and star anise.\n        Place the pan over a high heat, then pour in the vegetable stock. Bring it just to the boil, then turn down very low and gently simmer for 30 minutes.\n        Source: https://www.jamieoliver.com/recipes/vegetables-recipes/asian-vegetable-broth/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "3 cloves of garlic",
//                   "5cm piece of ginger",
//                   "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
//                   "2 spring onions",
//                   "1 fresh red chilli"
//                 ],
//                 "category": "Thai",
//                 "image": "thai-inspired-vegetable-broth.jpg",
//                 "isFeatured": "true",
//               },
//               {
//                 "name": "Thai-Chinese-inspired pinch salad",
//                 "description": "Peel and very finely chop the ginger and deseed and finely slice the chilli (deseed if you like). Toast the sesame seeds in a dry frying pan until lightly golden, then remove to a bowl.\n        Mix the prawns with the five-spice and ginger, finely grate in the lime zest and add a splash of sesame oil. Toss to coat, then leave to marinate.\n    \n        Source: https://www.jamieoliver.com/recipes/seafood-recipes/asian-pinch-salad/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "5 cm piece of ginger",
//                   "1 fresh red chilli",
//                   "25 g sesame seeds",
//                   "24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
//                   "1 pinch Chinese five-spice powder"
//                 ],
//                 "category": "Chinese",
//                 "image": "thai-chinese-inspired-pinch-salad.jpg",
//                 "isFeatured": "true",
//               },
//               {
//                 "name": "Southern fried chicken",
//                 "description": "\n        To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.\n    \n        Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.\n    \n        After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.\n    \n        When you’re ready to cook, preheat the oven to 190°C/375°F/gas 5.\n    \n        Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.\n    \n        Meanwhile, make the pickle – toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.\n    \n        Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "4 free-range chicken thighs , skin on, bone in",
//                   "4 free-range chicken drumsticks",
//                   "200 ml buttermilk",
//                   "4 sweet potatoes",
//                   "200 g plain flour",
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika"
//                 ],
//                 "category": "American",
//                 "image": "southern-friend-chicken.jpg",
//                 "isFeatured": "true",
//               },
//               {
//                 "name": "Chocolate & banoffee whoopie pies",
//                 "description": "\n        Preheat the oven to 170ºC/325ºF/gas 3 and line 2 baking sheets with greaseproof paper.\n        Combine the cocoa powder with a little warm water to form a paste, then add to a bowl with the remaining whoopie ingredients. Mix into a smooth, slightly stiff batter.\n        Spoon equal-sized blobs, 2cm apart, onto the baking sheets, then place in the hot oven for 8 minutes, or until risen and cooked through.\n        Cool for a couple of minutes on the sheets, then move to a wire rack to cool completely.\n        Once the whoopies are cool, spread ½ a teaspoon of dulce de leche on the flat sides.\n        Peel and slice the bananas, then top half the pies with 2 slices of the banana.\n        Sandwich together with the remaining halves, and dust with icing sugar and cocoa powder.\n    \n        Source: https://www.jamieoliver.com/recipes/chocolate-recipes/chocolate-amp-banoffee-whoopie-pies/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "3 spring onions",
//                   "½ a bunch of fresh flat-leaf parsley",
//                   "1 large free-range egg",
//                   "750 g cooked crabmeat , from sustainable sources",
//                   "300 g mashed potatoes",
//                   "1 teaspoon ground white pepper",
//                   "1 teaspoon cayenne pepper",
//                   "olive oil"
//                 ],
//                 "category": "American",
//                 "image": "chocolate-banoffe-whoopie-pies.jpg",
//                 "isFeatured": "false",
//               },
//               {
//                 "name": "Veggie pad Thai",
//                 "description": "\n        Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.\n        Lightly toast the peanuts in a large non-stick frying pan on a medium heat until golden, then bash in a pestle and mortar until fine, and tip into a bowl.\n        Peel the garlic and bash to a paste with the tofu, add 1 teaspoon of sesame oil, 1 tablespoon of soy, the tamarind paste and chilli sauce, then squeeze and muddle in half the lime juice.\n        Peel and finely slice the shallot, then place in the frying pan over a high heat. Trim, prep and slice the crunchy veg, as necessary, then dry-fry for 4 minutes, or until lightly charred (to bring out a nutty, slightly smoky flavour).\n    \n        Source: https://www.jamieoliver.com/recipes/vegetable-recipes/veggie-pad-thai/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "150 g rice noodles",
//                   "sesame oil",
//                   "2 cloves of garlic",
//                   "80 g silken tofu",
//                   "low-salt soy sauce"
//                 ],
//                 "category": "Thai",
//                 "image": "veggie-pad-thai.jpg",
//                 "isFeatured": "false",
//               },
//               {
//                 "name": "Chinese steak & tofu stew",
//                 "description": "Get your prep done first, for smooth cooking. Chop the steak into 1cm chunks, trimming away and discarding any fat.\n        Peel and finely chop the garlic and ginger and slice the chilli. Trim the spring onions, finely slice the top green halves and put aside, then chop the whites into 2cm chunks. Peel the carrots and mooli or radishes, and chop to a similar size.\n        Place a large pan on a medium-high heat and toast the Szechuan peppercorns while it heats up. Tip into a pestle and mortar, leaving the pan on the heat.\n        Place the chopped steak in the pan with 1 tablespoon of groundnut oil. Stir until starting to brown, then add the garlic, ginger, chilli, the white spring onions, carrots and mooli or radishes.\n    \n        Source: https://www.jamieoliver.com/recipes/stew-recipes/chinese-steak-tofu-stew/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "250g rump or sirloin steak",
//                   "2 cloves of garlic",
//                   "4cm piece of ginger",
//                   "2 fresh red chilli",
//                   "1 bunch of spring onions"
//                 ],
//                 "category": "Chinese",
//                 "image": "chinese-steak-tofu-stew.jpg",
//                 "isFeatured": "false",
//               },
//               {
//                 "name": "Spring rolls",
//                 "description": "Put your mushrooms in a medium-sized bowl, cover with hot water and leave for 10 minutes, or until soft. Meanwhile, place the noodles in a large bowl, cover with boiling water and leave for 1 minute. Drain, rinse under cold water, then set aside.\n        For the filling, finely slice the cabbage and peel and julienne the carrot. Add these to a large bowl with the noodles.\n    \n        Source: https://www.jamieoliver.com/recipes/vegetables-recipes/spring-rolls/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "40 g dried Asian mushrooms",
//                   "50 g vermicelli noodles",
//                   "200 g Chinese cabbage",
//                   "1 carrot",
//                   "3 spring onions"
//                 ],
//                 "category": "Chinese",
//                 "image": "spring-rolls.jpg",
//                 "isFeatured": "false",
//               },
//               {
//                 "name": "Tom Daley's sweet & sour chicken",
//                 "description": "Drain the juices from the tinned fruit into a bowl, add the soy and fish sauces, then whisk in 1 teaspoon of cornflour until smooth. Chop the pineapple and peaches into bite-sized chunks and put aside.\n        Pull off the chicken skin, lay it flat in a large, cold frying pan, place on a low heat and leave for a few minutes to render the fat, turning occasionally. Once golden, remove the crispy skin to a plate, adding a pinch of sea salt and five-spice.\n        Meanwhile, slice the chicken into 3cm chunks and place in a bowl with 1 heaped teaspoon of five-spice, a pinch of salt, 1 teaspoon of cornflour and half the lime juice. Peel, finely chop and add 1 clove of garlic, then toss to coat.\n    \n        Source: https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/",
//                 "email": "hello@email.com",
//                 "ingredients": [
//                   "1 x 227 g tin of pineapple in natural juice",
//                   "1 x 213 g tin of peaches in natural juice",
//                   "1 tablespoon low-salt soy sauce",
//                   "1 tablespoon fish sauce",
//                   "2 teaspoons cornflour",
//                   "2 x 120 g free-range chicken breasts , skin on"
//                 ],
//                 "category": "Chinese",
//                 "image": "tom-daley.jpg",
//                 "isFeatured": "false",
//               }
//              ]
//         );
//         console.log('In here')
        
//     }catch(error){
//         console.log(error +' in insertdatadum')
//     }
// }
//   insertDymmyDatarecipe();