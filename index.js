const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const spicedPg = require("spiced-pg");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session"); //protecting against changing cookies
const helmet = require("helmet"); //for securing Express by setting various HTTP headers
const csurf = require('csurf'); //protecting against CSRF
const {hash, compare} = require("./bc.js");
const { addSigner, getSigners, getMyData, newUser, insertSignature, getHashedPass } = require("./db.js");



//h1 animation
//TweenLite.to("h1", 1, {x:500});


//handlebars setup
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

//MIDDLEWARE
app.use(express.static("./public"));
app.use(express.static(__dirname));

app.use(cookieParser());
app.use(cookieSession({
    secret: `I'm always angry`,
    maxAge: 1000 * 60 *60 *24 * 14
}));
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(csurf());


//avoiding click-jacking attacks
app.use(function(req, res, next){ 
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
}); 

//CSRF setup
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});   

//SETTING UP ROUTES//

//slash GET request
app.get("/", (req, res)=>{
    res.render("./registration");
});

//registration GET request
app.get("/registration", (req, res)=>{
    res.render("./registration");
});


//registration POST request
app.post("/registration", (req, res)=>{
    //check for matching passwords
    if(req.body.password1 != req.body.password2) {
        const passwordError = "Check that your passwords match!";
        res.render("registration", { passwordError});
    } else {
        hash(req.body.password1).then(hashedPassword => {
            return newUser(req.body.firstname, req.body.lastname, req.body.email, hashedPassword);
        }).then(results => {
            //setting cookies
            res.cookie("user_id", results.rows[0].user_id);
            //attaching a user object to request.session
            req.session.user_id = results.rows[0].user_id;
            res.redirect("/petition");
            res.end();
        }).catch((error)=>{
            console.log("Erroooor:", error);
            res.redirect("/registration");
            res.render("./registration", { error: "Oooops! Try again  but this time, give us all your data!" });
            
        });
    }
});

//login GET request
app.get("/login", (req, res)=>{
    res.render("./login");
});

//petition GET request, reading cookie
app.get("/", (req,res)=> {
    console.log(req.cookies);
    if(req.cookies.signed != "true")
    {
        res.render("petition", {});
    }
    else {
        thanksRoute(req,res);
    }
});

function thanksRoute(req, res) {

    // This code is broken out from the /thanks route because it's also needed
    // for the root and petition routes if the user has already signed

    console.log("Second Thanks route");
    const id = req.cookies.signerId;
    console.log("Identitz is " + id);
    getMyData(id).then((results)=> {
        console.log (results.rows);
        const firstname = results.rows[0].firstname;
        const sig = results.rows[0].sig;
        res.render("thanks", {firstname, sig});
        console.log(sig);
    }).catch((error)=>{
        console.log("Erroooor:", error);
        res.send(`<h1>Oooops. Something went wrong. Try and try again.</h1>`);
    });
}

//petition GET request
app.get("/petition", (req, res) => {
    if(req.cookies.signed != "true")
    {
        res.render("petition", {});
    }
    else {
        thanksRoute(req,res);
    }
});

//petition POST request
app.post("/petition", (req, res) => {
    if (req.body.firstname && req.body.lastname && req.body.sig) {
        console.log("I'm inside of if statement");
        
        addSigner(req.body.firstname, req.body.lastname, req.body.sig)
            .then((result) => {
                //setting cookie
                res.cookie("signed", "true", { });
                res.cookie("signerId", result.rows[0].signature_id);
                res.redirect("/thanks");
            }).catch((error) => {
                res.render("petition", { error: true });
            });
    } else {
        res.render("petition", { error: true });
    }
});


//GET request for /petitioners layout:
app.get("/petitioners", (req, res)=>{
    getSigners().then((results)=>{
        console.log(getSigners);
        const petitioners = [];
        results.rows.forEach((r)=>{
            petitioners.push({
                name: `${r.firstname} ${r.lastname}`
            });
            console.log(petitioners);
        });
        res.render("./petitioners", { petitioners });
    }).catch((error)=>{
        console.log(error);
       
    });
});

//Get route for signatures
app.get("/thanks", (req, res)=>{
    thanksRoute(req, res);
});


//register
//app.post("/register", (req,res)=>{
//    hash("userInput").then(hashedPw=>{
//      console.log(hashedPw);    
//}).catch(err=>{
//    console.log(err);
//    res.senStatus(500);
//})
//NEXT STEPS: save signatures to data base
//set up cookies so I know which users have signed
//render the rest of the pages to people who signed
//








app.listen(8080, () => console.log("server alive and kickin!"));