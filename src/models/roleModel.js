const Sequelize = require('sequelize');
const database = require('../connectDB');

const table = "roles";

const schema = {
    roleID:  {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roleName: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
    },
};

const model = database.define(table, schema, {timestamps: false});

model.sync({ force: false })
.catch((e) => (`Error in creating ${table} tables`));

module.exports = model;