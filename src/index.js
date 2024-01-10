const express = require("express");
const path = require("path");
const collection = require("./config");
const savecollection = require("./savemessage")
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home",{ username:""});
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        res.redirect("/login")
        
    }

});
app.post("/contact",async (req,res)=>{
    const data = {
        name: req.body.name,
        email: req.body.email,
        message : req.body.message
    }
    await savecollection.insertMany(data)
    res.redirect("/")

})

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home",{ username: check.name });
        }
    }
    catch {
        res.send("wrong Details");
    }
});


app.get("/logout", (req, res) => {
    
    res.redirect("/");
});


app.get("/contact",(req,res)=>{
    res.render("contact")
})

// Define Port for Application
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
