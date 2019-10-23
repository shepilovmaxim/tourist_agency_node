const Sequelize = require("sequelize");

module.exports = new Sequelize('heroku_2cb98397c9ba98f', 'b7ef66d3dc26f8', 'baf627fc', {
  host: 'eu-cdbr-west-02.cleardb.net',
  dialect: 'mysql'
});
// mysql://b7ef66d3dc26f8:baf627fc@eu-cdbr-west-02.cleardb.net/heroku_2cb98397c9ba98f?reconnect=true