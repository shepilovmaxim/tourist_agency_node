const Sequelize = require("sequelize");
const db = require("../db/database");

const User = db.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  blocked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: "0"
  }
});

module.exports = User;
const Role = require("./Role");
const Voucher = require("./Voucher");

User.hasMany(Voucher);
User.belongsTo(Role);