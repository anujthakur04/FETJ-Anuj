const express = require("express");
const session = require("express-session")
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});

app.listen(port, function (error) { 
  
    if (error) { 
        console.log('Something went wrong', port); 
    } 
    
    else { 
        console.log('Server is listening on port', port); 
    } 
});

/*  PASSPORT SETUP  */

const passport = require('passport');
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => {
  res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.post('/', function(req, res) {
  res.render("pages/auth");
});


/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '877237542058-4tnuc5vtqfcrpftd50dlufgklk6mtvj3.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
  
    res.redirect('/success');
    
  });