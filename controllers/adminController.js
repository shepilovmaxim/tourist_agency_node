const db = require('../db/database');
const Sequelize = require('sequelize');
const Hotel = require('../models/Hotel');
const Tour = require('../models/Tour');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const Status = require('../models/Status');
const Role = require('../models/Role');
const seed = require("../db/init");

/* GET /admin/vouchers */
exports.vouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({raw: true, nest: true, include: [{model: Tour}, {model: Status}, {model: User}]});
    res.render("vouchers", {
      vouchers: vouchers,
      isAdmin: true
    })
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* PUT /admin/vouchers/set */
exports.setStatus = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    await Voucher.update({ statusId: req.query.status }, { where: { id: req.query.id }, transaction });
    await transaction.commit();
    res.redirect(303, "/admin/vouchers");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).render("exception", { error: e });
  }
};

/* GET /admin/users */
exports.users = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true, nest: true, include: [{ model: Role }] })
    res.render("users", {
      users: users,
      isAdmin: true
    })
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /admin/users */
exports.ban = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    await User.update({ blocked: Sequelize.literal('NOT blocked') }, { where: { id: req.body.userId }, transaction });
    await transaction.commit();
    res.redirect("/admin/users");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).render("exception", { error: e });
  }
};

/* GET /admin/addTour */
exports.showTourForm = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ raw: true });
    res.render("addTour", {
      isAdmin: true,
      hotels: hotels
    });
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /admin/addTour */
exports.addTour = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { tour_name, tour_amount, tour_type, tour_people, tour_price, tour_date, tour_duration, tour_description, tour_hotel } = req.body;
    await Tour.create({ name: tour_name, amount: tour_amount, typeId: tour_type, people: tour_people, price: tour_price, start_date: tour_date, duration: tour_duration, description: tour_description, hotelId: tour_hotel, image: req.file.filename }, { transaction });
    await transaction.commit();
    res.redirect("/tours");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).render("exception", { error: e });
  }
};

/* GET /admin/addHotel */
exports.showHotelForm = async (req, res) => {
  try {
    res.render("addHotel", {
      isAdmin: true
    });
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /admin/addHotel */
exports.addHotel = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    await Hotel.create({ name: req.body.hotel_name, stars: req.body.hotel_stars, image: req.file.filename }, { transaction });
    await transaction.commit();
    res.redirect("/admin/addHotel");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).render("exception", { error: e });
  }
};

/* GET /admin/init
   used to fill the database with dummy data
*/
exports.init = (req, res) => {
  db.sync({force: true}).then(() => seed())
    .then(() => res.redirect(303, "/tours"))
    .catch((err) => console.log(err))
};