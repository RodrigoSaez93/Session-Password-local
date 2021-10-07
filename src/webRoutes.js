const express = require("express");
const router = express.Router();
const passport = require('passport')

router.get("/login", (req, res) => {
    if(req.isAuthenticated()) {
        console.log('usuario logueado')
        res.redirect('/productos/ingresar')
    }else {
        res.render("login");

    }
})

router.get("/signup", (req, res) => {
    res.render('signup')
})

router.get("/login-error", (req, res) => {
    res.render("login-error")
})

router.get("/signup-error", (req, res)=> {
    res.render("signup-error")
})


router.post("/login", passport.authenticate('login', {failureRedirect: 'login-error'}), (req, res) => {
    req.session.nombre = req.body.username;
    res.redirect("/productos/ingresar");
})

router.post("/signup",passport.authenticate('signup', {failureRedirect: 'login-error'}), (req, res) => {
    res.redirect("/productos/ingresar"); 
})

router.get("/logout", (req, res) => {
    const data = { nombre: req.session.nombre};
    req.session.destroy();
    req.logout()
    res.render("logout", data)
})

module.exports = router;