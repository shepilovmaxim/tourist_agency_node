const Sequelize = require("sequelize");

module.exports = new Sequelize('tourist_agency', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});