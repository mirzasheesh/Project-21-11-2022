const Sequelize = require('sequelize');
const database = require('../connectDB');

const table = "chats";

const schema = {
    chatID:  {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clientWhatsAppID: {
        type: Sequelize.DataTypes.STRING,
    },
    customerNumber: {
        type: Sequelize.DataTypes.BIGINT,
    },
    customerMessage: {
        type: Sequelize.JSON,
    },
    clientReply: {
        type: Sequelize.JSON,
    }
};

const model = database.define(table, schema, {timestamps: false});

model.sync({ force: false })
.catch((e) => console.log(`Error in creating ${table} tables`));

module.exports = model;