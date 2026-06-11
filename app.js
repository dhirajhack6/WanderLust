const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRouter = require('./Routes/listing.js');
const reviewRouter = require('./Routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./Routes/user.js');

const chatRouter = require("./Routes/chat");



// ================= DATABASE CONNECTION =================i

const dbUrl = process.env.ATLAS_DB_URL;

console.log('DB URL:', dbUrl);

async function startServer() {
  try {
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');

    app.listen(8080, () => {
      console.log('🚀 Server is listening on port 8080');
    });
  } catch (err) {
    console.log('❌ MongoDB Connection Error');
    console.log(err);
  }
}

// ================= APP CONFIG =================

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ================= SESSION =================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    // secret: 'mysupersecretcode',
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on('error', () => {
  console.log('ERROR in Mongo Session Store, err');
});

const sessionOption = {
  store,
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL LOCALS =================

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// ================= ROUTES =================

app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings', listingRouter);
app.use('/', userRouter);
app.use('/chat', chatRouter);


// ================= 404 HANDLER =================

app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  return res.status(status).render('error.ejs', { message });
});

// ================= START SERVER =================

startServer();
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:');
  console.error(err.stack);
});
