const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const spicedPg = require("spiced-pg");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session"); //protecting against changing cookies
const helmet = require("helmet"); //for securing Express by setting various HTTP headers
const csurf = require('csurf'); //protecting against CSRF
const {hash, compare} = require("./bc.js");
const { addSigner, getSigners, getUserData, newUser, insertSignature, getHashedPass, getPassword, getUserPetitionSignatureImage, getMySignature, updateUsersProfiles, getProfileFromUserId, deleteSignature } = require("./db.js");
const { decodeBase64 } = require('bcryptjs');
const { permittedCrossDomainPolicies } = require('helmet');


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
app.use(function(req, res, next){ //avoiding click-jacking attacks
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
}); 
app.use(function(req, res, next) { //CSRF setup
    res.locals.csrfToken = req.csrfToken();
    next();
});   

/////SETTING UP ROUTES/////

//slash GET request
app.get("/", (req, res)=>{
    res.render("./registration");
});

//registration GET request
app.get("/registration", (req, res)=>{
    const {user_id} = req.session;
    if (user_id) {
        res.redirect("/thanks");
    } else {
        res.render("registration");
    } 
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
            res.redirect("/login");
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
    res.render("login");
});

//login POST request

app.post("/login", (req, res)=>{
    let pass = req.body.password;
    let email = req.body.email;
    getHashedPass(email).then((result)=>{
        if((result.rows != undefined) && (result.rows.length>0)) {
            compare(pass, result.rows[0].password_hash).then((match)=>{
                if(match) {
                    let userid = result.rows[0].user_id;
                    req.session.user_id = userid;
                    getUserPetitionSignatureImage(req.session.user_id).then((result)=>{
                        const isSigned = (result.rows.length > 0);
                        res.redirect(isSigned? "/thanks" : "/profile");                         
                    }).catch((error)=>{
                        console.log("Error in redirect:", error);
                    });
                }
            }).catch((error)=>{
                console.log("The inner error:", error);
            });
        }
    }).catch((error)=>{
        console.log("The outer most error:", error);
    });
});

//petition GET request

app.get("/petition", (req, res) => {
    const userId = req.session.user_id;
    console.log(req.session);
    console.log("userId is " + userId);
    if (userId == undefined || userId == null || userId.length == 0) {
        console.log ("rendering Registration");
        res.render("registration", {});
    } else {
        console.log ("rendering Petition");
        res.render("petition", {});
    }
});

function thanksRoute(req, res) {
    // This code is broken out from the /thanks route because it's also needed
    // for the root and petition routes if the user has already signed
    console.log("Second Thanks route");
    const id = req.session.user_id;
    console.log("Identitz is " + id);
    getMySignature(id).then((results)=> {
        console.log (results.rows);
        //const firstname = results.rows[0].firstname;
        const sig = results.rows[0].sig;
        res.render("thanks", { sig});
        console.log(sig);
    }).catch((error)=>{
        console.log("ErroooorThanks:", error);
        res.send(`<h1>Oooops. Something went wrong. Try and try again.</h1>`);
    });
}

//GET route for signatures
app.get("/thanks", (req, res)=>{
    thanksRoute(req, res);
});

//petition GET request
app.get("/petition", (req, res) => {
    if(req.session.signed != "true")
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
        
        addSigner(req.body.sig, req.session.user_id)
            .then((result) => {
                const signatureId = result.rows[0].signature_id;
                //setting cookie
                req.session.signed= true;
                req.session.signerId = signatureId;
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
        console.log(results);
        const petitioners = [];
        results.rows.forEach((r)=>{
            petitioners.push({
                name: `${r.firstname} ${r.lastname}`,
                city: `${r.city}`
            });
            console.log(petitioners);
        });
        res.render("./petitioners", { petitioners });
    }).catch((error)=>{
        console.log(error);
       
    });
});

//profile GET request
app.get("/profile", (req, res) => {
    getProfileFromUserId(req.session.user_id).then((results)=>{
        var profileData = {};
        if (results.rows.length>0) {
            profileData.city = results.rows[0].city;
            profileData.age = results.rows[0].age;
            profileData.webpage = results.rows[0].url;
        }
        res.render("./profile", {profileData});
    }).catch((error)=>{
        console.log("Error in profile GET:", error);
    });
    

});

//profile POST request
app.post(("/profile"), (req, res)=>{
    if (req.session.user_id) {
        console.log("I'm getting this:", req.session.user_id);
        if (!req.body.webpage.startsWith("https://") || !req.body.webpage.startsWith("http://")) {
            console.log("Bad url!!!");
            req.body.url = `https://${req.body.url}`;
        }
        updateUsersProfiles(req.body.age, req.body.city, req.body.webpage, req.session.user_id).then((result)=>{
            console.log("Inserted bloody data!!!");
            res.redirect("/petition");
            res.end();
        }).catch((error)=>{
            console.log("There's an error in insert!", error);
        });
    }
});

//delete GET route
app.get("/delete", (req, res)=>{
    deleteSignature(req.session.user_id).then((results)=>{
        req.session.signed = "false";
        res.redirect("/petition");
        res.end();
    }).catch((error)=>{
        console.log("Error in deleting sig:", error);
    });
});





//petition GET request, reading cookie
//app.get("/", (req,res)=> {
//    console.log(req.cookies);
//    if(req.cookies.signed != "true")
//    {
//        res.render("petition", {});
//    }
//    else {
//        thanksRoute(req,res);
//    }
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
//petition POST request
/*
app.post("/petition", (req, res) => {
    const { userId } = req.session;
    const { signature } = req.body;
    addSigner(userId, signature)
        .then((results) => {
            res.redirect("/thanks");
        })
        .catch((e) => {
            console.log(e);
            res.redirect("/petition");
        });
});*/






//heroku and local port
app.listen(process.env.PORT || 8080, () => console.log("server alive and kickin!"));