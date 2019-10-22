const Sequelize = require("sequelize");
const db = require("../db/database");

const Voucher = db.define("voucher", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
});
module.exports = Voucher;

const User = require("./User");
const Tour = require("./Tour");
const Status = require("./Status");

Voucher.belongsTo(User, { onDelete: 'cascade', hooks: true });
Voucher.belongsTo(Status);
Voucher.belongsTo(Tour, { onDelete: 'cascade', hooks: true });