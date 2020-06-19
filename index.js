const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session"); //protecting against changing cookies
const helmet = require("helmet"); //for securing Express by setting various HTTP headers
const csurf = require('csurf'); //protecting against CSRF
const {hash, compare} = require("./bc.js");
const { addSigner } = require("./db.js");



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

//petition GET request
app.get("/", (req,res)=> {
    res.render("petition", {});
});

app.get("/petition", (req, res) => {
    res.render("petition", {});
});

//petition POST request
app.post("/petition", (req, res) => {
    console.log(req.body.firstname);
    if (req.body.firstname && req.body.lastname && req.body.sig) {
        console.log("I'm inside of if statement");
        
        addSigner(req.body.firstname, req.body.lastname, req.body.sig)
            .then((result) => {
                console.log("Something is working!Woop!Woop!");
                const { id, permission } = req.session;
                req.session.id = result.rows[0].user_id;
                req.session.permission = true; 
                if (req.session.id && req.session.permission) {
                    res.redirect("/thanks");
                } else {
                    console.log("errooooorrr!!!");
                    res.render("petition", { error: true });
                }
                
            })
            .catch((error) => {
                res.render("petition", { error: true });
                console.log("errooooorrrr on addSigner ", error);
            });
    } else {
        res.render("petition", { error: true });
    }
});

//GET request for /thanks layout:
//app.get("/thanks", (req, res) => {
// if (req.session.id) {

// }
//});


//GET request for /petitioners layout:
//app.get("/petitioners", (req, res) => {
//    res.render("petitioners", {});
//});

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