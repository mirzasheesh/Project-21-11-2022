const Sequelize = require('sequelize');
const database = require('../connectDB');

const table = "users";

const schema = {
    userID:  {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: Sequelize.DataTypes.STRING,
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
    },
    password: {
        type: Sequelize.DataTypes.STRING,
    },
    role: {
        type: Sequelize.DataTypes.INTEGER,
    },
    is_active: {
        type: Sequelize.DataTypes.INTEGER,
    }
};

const model = database.define(table, schema, {timestamps: true});

model.sync({ force: false })
.catch((e) => (`Error in creating ${table} tables`));

module.exports = model;