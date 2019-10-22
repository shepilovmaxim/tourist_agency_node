const express = require("express");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const tourRouter = require("./routers/tourRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");

const app = express();

/* Passport config */
require("./config/passport")(passport);

/* Handlebars */
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    isAdmin: (role, options) => {
      if (role == "1") {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    isManagerOrAdmin: (role, options) => {
      if (role == "1" || role == "3") {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    role: (roleId) => {
      const roles = {
        "1": "admin",
        "2": "client",
        "3": "manager"
      };
      return roles[roleId];
    },
    if_eq: (a, b, options) => {
      if (a == b) {
        return options.fn(this);
      };
    }
  }
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

/* Express-session */
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

/* Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

/* Global vars */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  res.locals.authUser = req.user;
  next();
})

app.get("/", (req, res) => res.redirect("/tours"));
app.use("/tours", tourRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(3000);