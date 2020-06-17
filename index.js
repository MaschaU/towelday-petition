const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

//handlebars setup
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

//middleware 
app.use(express.static("./public"));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(cookieSession({
    secret: `I'm always angry`,
    maAge: 1000 * 60 *60 *24 * 14
}));
app.use(express.urlencoded({extended:false}));

//ticker
/*var width = $(".ticker").width(),
    containerwidth = $("#ticker-container").width(),
    left = containerwidth;
$(document).ready(function(e){
    function tick() {
        if(--left < -width){
            left = containerwidth;
        }
        $(".ticker").css("margin-left", left + "px");
        setTimeout(tick, 8);
    }
    tick();
});*/

//petition GET request
app.get("/petition", (req, res) => {
    res.render("petition", {});
});

//petition POST request
app.post("/petition", (req, res) => {
    // check for both input fields
    if (req.firstname != "true" || req.lastname != "true") {
        res.redirect("./thanks");
    } else {
        res.send(`<h1>Please submit your data<h1>`);
    }
});

// GET request for /thanks layout:
app.get("/thanks", (req, res) => {
    res.render("thanks", {});
});

// GET request for /petitioners layout:
app.get("/signers", (req, res) => {
    res.render("signers", {});
});








app.listen(8080, () => console.log("server alive and kickin!"));