require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require('mongoose');
const _ = require("lodash");
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(cookieParser());






// MongoDB database code



app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  }));


// making collection schema
const categoriesSchema = {
    categories_name:String,
    total_course:String,
    image:String,
};

// making a collection categories
const Categories = mongoose.model("Categories",categoriesSchema);  

const Categories1 = new Categories({
    categories_name:"Angular Course",
    total_course:"5 Courses",
    image:"home-images/app-development.png"
});

const Categories2 = new Categories({
    categories_name:"Angular Course",
    total_course:"5 Courses",
    image:"home-images/app-development.png"
});

const Categories3 = new Categories({
    categories_name:"Angular Course",
    total_course:"5 Courses",
    image:"home-images/app-development.png"
});
// Categories.insertMany([Categories1, Categories2, Categories3]).then( () => console.log("SUCCESSFULLY INSERTED"));


// making Course schema
const courseSchema = {
    categories_name:{
        type:String,
    },
    price:Number,
    image:String,
};
// making a collection Course
const Course = mongoose.model("Course",courseSchema);  

const Course1 = new Course({
    categories_name:"Angular Course",
    price:299,
    image:"home-images/app-development.png"
});

const Course2 = new Course({
    categories_name:"Angular Course",
    price:299,
    image:"home-images/app-development.png"
});

const Course3 = new Course({
    categories_name:"Angular Course",
    price:299,
    image:"home-images/app-development.png"
});
// Course.insertMany([Course1, Course2, Course3]).then( () => console.log("SUCCESSFULLY INSERTED"));



// making profileSchema
const profileSchema = {
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    about:{
        type:String,
        default:"I'm a IITIAN VISION ACADEMY learner"
    },
    name:{
        type:String,
        default:"NEW USER"
    },
    image:{
        type:String,
    },
    class:{
        type:String,
        default:"Write Your Name"
    },  
    cart:{
        type: [courseSchema],
    },   
    mycourse:{
        type: [courseSchema],
    },
};
// making a collection Profile
const Profile = mongoose.model("Profile",profileSchema);  

// const profile2 = new Profile(
//     {
//         "email": "Abhishekking.allknow@gmail.com",
//         "password": "AK34RS56",
//         "about": "Web Developer, Kharagpur, India",
//         "name": "ABHISHEK KUMAR",
//         "image": "Abhishek.png",
//         "class": "2nd year, IIT kharagpur",
//         "cart": [],
//         "mycourse": [],
//         "__v": 39
//       }

// );
// Profile.insertMany([profile2]).then( () => console.log("SUCCESSFULLY INSERTED"));




app.post("/login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    Profile.findOne({email:email}).then( (docs) => {
        if(docs.password==password){
            req.session.emailid = docs.email;
            res.redirect("/");
        }else{
            res.redirect("/PasswordIncorrect");
        }
    }).catch( () => {
        res.redirect("/new");
    })
});

app.post("/signup",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    Profile.findOne({email:email}).then( (docs) => {
        if(docs){
            res.redirect('alreadyRegistered');
        }
        else{
            const profile3 = new Profile(
                {
                    "email": email,
                    "password": password,
                    "name": name,
                    "image": "Abhishek.png",
                    "class": "Write Your Class",
                    "cart": [],
                    "mycourse": [],
                    "__v": 39
                  }
            
            );
            Profile.insertMany([profile3]).then( () => {});
            req.session.emailid = email;
            res.redirect("/");
        }
    });

});



app.get("/",function(req,res){
    const useremail = req.session.emailid;
    const signin = !!useremail;
    Course.find().then( (docs) => {
        let Course=docs;
            Categories.find().then( (document) =>{
                Profile.findOne({email:useremail}).then( (docss) =>{
                    res.render('home',{Categories:document, Course:docs,signin:signin,profile:docss});
                });
            });
    });
    
});




app.get("/cart",function(req,res){
    const useremail = req.session.emailid;
    const signin = !!useremail;
    Profile.findOne({email:useremail}).then( (docs) => {
        price=0;
        for(var i=0;i<(docs.cart).length;i++){
            price+=(docs.cart)[i].price;
        }
        res.render('cart',{Course:docs.cart,signin:signin,price:price,profile:docs});
    });
});

app.post("/addtocart",function(req,res){
    const value = req.body.AddtoCart;
    Course.findOne({_id:value}).then( (docs) =>{
        const useremail = req.session.emailid;
        const signin = !!useremail;
        Profile.findOne({email:useremail}).then( (document) => {
            a=0;
            for(var i=0;i<(document.cart).length;i++){
                if((document.cart)[i]._id==value){
                    a=1;
                }
            }
            if(a==0){
                document.cart.push(docs);
                document.save();
            }else{
                
            }   
        });
    });
    res.redirect("/#");
});
app.post("/removefromcart",function(req,res){
    const value = req.body.RemovefromCart;
    Course.findOne({_id:value}).then( (docs) =>{
        const useremail = req.session.emailid;
        const signin = !!useremail;
        Profile.findOneAndUpdate({email:useremail},{$pull:{cart:{_id:value}}}).then( (document) => {

        });
    });
    res.redirect("/cart");
});



app.get("/course",function(req,res){
    const useremail = req.session.emailid;
    const signin = !!useremail;
    Course.find().then( (docs) => {
        let Course=docs;
            Categories.find().then( (document) =>{
                Profile.findOne({email:useremail}).then( (docss) =>{
                    res.render('course',{Categories:document, Course:docs,signin:signin,profile:docss});
                });
            });
    });
});


app.get("/user",function(req,res){
    res.render('user');
});

app.get("/login",function(req,res){
    res.render('login');
});

app.get("/mylearning",function(req,res){
    const useremail = req.session.emailid;
    const signin = !!useremail;
    Profile.findOne({email:useremail}).then( (docs) => {
        res.render('mylearning',{Course:docs.mycourse,signin:signin,profile:docs});
    });
});

app.post("/updateprofile",function(req,res){
    // const imagee = URL.createObjectURL((req.body.image));
    const aboutt = req.body.about;
    const classs = req.body.class;
    const emailidd = req.session.emailid;
    Profile.updateOne({email:emailidd},{about:aboutt}).then( () => console.log("successfully updated"));
    Profile.updateOne({email:emailidd},{class:classs}).then( () => console.log("successfully updated"));
    // Profile.updateOne({email:emailidd},{image:imagee}).then( () => console.log("successfully updated"));
    res.redirect("/");
})

app.post("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
});

app.get("/admin",function(req,res){
    const AdminEmail = req.session.emailid;
    if(AdminEmail=="Abhishekking.allknow@gmail.com"){
        res.render('admin',{Course:Course,Categories:Categories,Profile:Profile});
    }
});

app.get("/checkout",function(req,res){
    const useremail = req.session.emailid;
    Profile.findOne({email:useremail}).then( (docs) => {
        for(var i=0;i<docs.cart.length;i++){
            var value = docs.cart[i]._id;
            docs.mycourse.push(docs.cart[i]);
            docs.save();
            Profile.findOneAndUpdate({email:useremail},{$pull:{cart:{_id:value}}}).then( (document) => {});
            
        }
        res.redirect("/mylearning");
    });
});

app.get("/alreadyRegistered",function(req,res){
    res.render("false",{message:"You have already Registered ,Please Log In to Continue or create a new account"});
})
app.get("/PasswordIncorrect",function(req,res){
    res.render("false",{message:"Password Incorrect"});
})

app.get("/new",function(req,res){
    res.render("false",{message:"You have not registered yet , Continue creating a new account !"});
})






// mongoose connection
const URLL ='mongodb+srv://abhishekkingallknow:frVy2tQg1T2t7CZW@cluster0.ajr8m72.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(URLL,{
    useNewUrlParser:true,useUnifiedTopology:true
}).then(() => {
    console.log('connected Successfully');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,function(){
        console.log("SERVER STARTED ON PORT 3000");
    });
}).catch((err) => { console.error(err);});