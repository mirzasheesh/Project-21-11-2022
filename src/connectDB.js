require('dotenv').config();

const { Sequelize } = require('sequelize');

const connection = new Sequelize({
    dialect: "mysql",
    database: process.env.databaseNAME,
    host: process.env.databaseHOST,
    port: process.env.databasePORT,
    username: process.env.databaseUSER,
    password: process.env.databasePASS,
    logging: false,
});

module.exports = connection;