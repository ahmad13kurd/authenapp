const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require ('express-session');
const passport = require('passport');
const app = express();

// passport config
require('./config/passport')(passport);

// connect to the DB
const db = require("./config/secret").MongoURI;

// connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log('Mongo is connected'))
.catch(err => console.log(err));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extenden: false}));

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use("/users", require("./routes/users"));



const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server started on Port ${PORT}`));