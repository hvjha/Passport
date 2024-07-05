const express = require('express');
const app = express();
const { connectDb, User } = require('./database');
const passport = require('passport');
const { initializingPassport } = require('./passportConfig');
const expressSession = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


connectDb();


initializingPassport(passport);

app.get('/', (req, res) => {
  res.send("Harsh");
});


app.post('/register', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");

  const newUser = await User.create(req.body);
  res.status(201).send(newUser);
});


app.post('/login', passport.authenticate('local',{session:true}), (req, res) => {
  res.send("harsh");
});


app.get('/protected', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not authenticated');
  }
  res.send(`Hello ${req.user.username}`);
});

app.listen(3000, () => {
  console.log('server is running on 3000');
});
