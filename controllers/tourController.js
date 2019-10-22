const db = require('../db/database');
const Sequelize = require('sequelize');
const Hotel = require('../models/Hotel');
const Tour = require('../models/Tour');
const Type = require('../models/Type');
const Voucher = require('../models/Voucher');
const Op = Sequelize.Op;

let maxPrice = 0;

/* GET /tours */
exports.index = async (req, res) => {
  try {
    const tours = await Tour.findAll({ raw: true, nest: true,  include: [{ model: Type }], order: [ ['id', 'ASC'] ] });
    maxPrice = Math.max.apply(null, tours.map(tour => tour.price));
    res.render('tours', {
      tours: tours,
      max: maxPrice
    });
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* POST /tours */
exports.filter = async (req, res) => {
  try {
    console.log(req.body);
    const whereStatement = {};
    for (let prop in req.body) {
      if (req.body[prop] != '0' && req.body[prop] != null) {
        if (prop == "amount") {
          const priceRange = req.body[prop].split(" - ");
          const min = priceRange[0];
          const max = priceRange[1];
          whereStatement.price = {[Op.lte]: max, [Op.gte]: min};
        } else if (prop == "stars") {
          whereStatement['$hotel.stars$'] = req.body[prop];
        } else {
          whereStatement[prop] = req.body[prop];
        }
      }
    }
    console.log(whereStatement);
    const filteredTours = await Tour.findAll({ raw: true, nest: true, where: whereStatement, include: [{ model: Type }, { model: Hotel, as: "hotel" }] });
    console.log(filteredTours);
    res.render('tours', {
      isAdmin: true,
      tours: filteredTours,
      max: maxPrice
    })
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* GET /tours/:id */
exports.card = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByPk(id, { raw: true, nest: true, include: [ { model: Type }, { model: Hotel } ] });
    if (tour != null) {
      res.render('card', {
        isAdmin: true,
        tour: tour
      })
    } else {
      throw new Error("No such tour.");
    }
  } catch(e) {
    res.status(500).render("exception", { error: e });
  }
};

/* PUT /tours/:id */
exports.edit = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const pageId = req.params.id;
    await Tour.update({ name: req.body.name, description: req.body.description, people: req.body.people, start_date: req.body.date, duration: req.body.duration, price: req.body.price, amount: req.body.amount, typeId: req.body.type }, { raw: true, nest: true, where: { id: req.body.tourId }, transaction });
    await transaction.commit();
    res.redirect(303, `/tours/${pageId}`);
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).send(e.message);
  }
};

/* DELETE /tours/:id */
exports.delete = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const tourId = req.params.id;
    await Tour.destroy({ where: { id: tourId }, transaction });
    await transaction.commit();
    res.redirect(303, "/tours");
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).send(e.message);
  }
};

/* POST /tours/:id */
exports.order = async (req, res) => {
  let transaction;
  try {
    if (res.locals.authUser.blocked == "1") {
      throw new Error("Your account has been blocked. You can not make an order")
    }
    transaction = await db.transaction();
    const tourId = req.params.id;
    const userId = req.user.id;
    const tour = await Tour.findByPk(tourId, { raw: true, transaction });
    if (tour.amount < 1) {
      throw new Error("No tour instances available");
    }
    const voucher = await Voucher.findOne({ where: { tourId, userId }, transaction });
    if (voucher != null) {
      throw new Error("Tour has already been booked by this user");
    }
    const newVoucher = await Voucher.create({ userId, tourId, statusId: "2" }, { transaction });
    if (newVoucher) {
      const newAmount = tour.amount - 1;
      await Tour.update({ amount: newAmount }, { where: { id: tourId }, transaction });
      await transaction.commit();
      res.redirect(303, "/user/account");
    }
  } catch(e) {
    if (transaction) await transaction.rollback();
    res.status(500).send(e.message);
  }
};