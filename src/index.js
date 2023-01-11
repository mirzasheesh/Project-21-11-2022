require('dotenv').config();

const express = require('express');
const cors = require('cors');
const server = express();
const routes = require('./routes/auth');
const database = require('./connectDB');
const swaggerUI = require('swagger-ui-express');

server.use(express.json());
server.use(cors());

server.use('/api-docs', swaggerUI.serve);

server.use('/', routes);

server.listen(process.env.PORT, () => {
    console.log(`Server: ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`);
});

database.authenticate()
.then(() => {
    console.log("Database connected");
})
.catch(() => {
    console.log("Error in database connection");
});