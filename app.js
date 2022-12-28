
/* * * * * * * Packages and Settings * * * * * * */

require('dotenv').config(); //DotEnv

const express = require("express"); //Express
const app = express();

app.set('view engine', 'ejs'); //EJS

app.use(express.urlencoded({extended: true})); //Body-Parser
app.use(express.static("public")); //Render local files

const mongoose = require("mongoose"); //Mongoose 
mongoose.set("strictQuery", false);

const encrypt = require("mongoose-encryption");

main().catch((err) => console.log(err)); //Catch main Errors

console.log(process.env.API_KEY);

/* * * * * * * Code Start * * * * * * */


//Start Main Function 
async function main() {

    //Start Mongoose Server
    await mongoose.connect("mongodb+srv://admin-nicolas:dbTest98@cluster0.dwacsgf.mongodb.net/userDB");
    console.log("MongoDB Connected");

    // ----------- Authentification Builld ------------ //

    //Create Users Schema
    const userSchema = new mongoose.Schema ({
        email: String,
        password: String
    });

  

    userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

    //Create Users collection
    const User = mongoose.model('User', userSchema);

    //Register Users
    app.post("/register", function(req, res){

        const userEmail = req.body.username; //Getting user email
        const userPassword = req.body.password; //Getting user pw

        const newUser = new User ({ //Creating a new user with the new data
            email: userEmail,
            password: userPassword
        });

        newUser.save(function(err){ //Saving the user in the db
            if(!err){
                res.render('secrets');
            } else {
                console.log(err);
            }
        })
    })

    //Login Users
    app.post("/login", function (req, res){

        const loginEmail = req.body.username; //Getting user email
        const loginPassword = req.body.password; //Getting user pw

        User.findOne({email: loginEmail}, function(err, foundUser){ //Looking for matching user email and pw.
            if(err){
                console.log(err);
                res.send("Wrong email please try again.")                
            } else {
                if(foundUser){
                    if(foundUser.password === loginPassword){
                        res.render('secrets'); //Render Secrets if credentials match
                    } else {
                        console.log(err);
                        res.send("Wrong password, please try again.");   
                    }
                }
            }
        });
    });






};  


app.get("/", function(req,res){
    res.render('home');
});

app.get("/login", function(req,res){
    res.render('login');
});

app.get("/register", function(req,res){
    res.render('register');
});




//Listen Port
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  