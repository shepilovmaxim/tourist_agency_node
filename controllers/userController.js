const User = require("../models/User");
const Voucher = require("../models/Voucher");
const Status = require("../models/Status");
const Tour = require("../models/Tour");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db/database");

/* GET /user/login */
exports.showLoginForm = async (req, res) => {
  try {
    res.render("login");
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /user/login */
exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: "/tours",
      failureRedirect: "/user/login",
      failureFlash: true
    })(req, res, next)
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* GET /user/registration */
exports.showRegistrationForm = async (req, res) => {
  try {
    res.render("registration");
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /user/registration */
exports.registration = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { email, login, password, firstName, lastName, phoneNumber } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.create({ email, login, password: hash, firstName, lastName, phoneNumber, roleId: 2 }, { transaction });
    req.flash('success_msg', 'You are now registered and can log in');
    await transaction.commit();
    res.redirect("/user/login");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).render("exception", { error: e });
  }
};

/* GET /user/logout */
exports.logout = (req, res) => {
  try {
    req.logout();
    res.redirect("/user/login");
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* GET /user/registration/check */
exports.check = async (req, res) => {
  try {
    let message = '';
    if (req.query.login) {
      const user = await User.findOne({ where: { login: req.query.login } });
      if (user != null) {
        message = "Login is not available";
      } else {
        message = "Login is available";
      }
    } else if (req.query.email) {
      const user = await User.findOne({ where: { email: req.query.email } });
      if (user != null) {
        message = "Email is not available";
      } else {
        message = "Email is available";
      }
    }
    res.send(message);
  } catch(e) {
    res.status(500).send(e.name);
  }
};

/* GET /user/account */
exports.account = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({ raw: true, nest: true, where: { userId: req.user.id }, include: [{ model: Status }, { model: Tour }], order: [ ['id', 'ASC'] ] });
    res.render("account", {
      vouchers: vouchers
    })
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};