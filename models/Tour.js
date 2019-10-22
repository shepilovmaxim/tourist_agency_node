const Sequelize = require("sequelize");
const db = require("../db/database");

const Tour = db.define("tour", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(1234),
    allowNull: false
  },
  people: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING
  }
});
module.exports = Tour;
const Type = require("./Type");
const Hotel = require("./Hotel");
const Voucher = require("./Voucher");

Tour.hasMany(Voucher);
Tour.belongsTo(Type);
Tour.belongsTo(Hotel, { onDelete: 'cascade', hooks: true });