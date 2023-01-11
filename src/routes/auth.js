const express = require('express');
const swaggerUI = require('swagger-ui-express');
const router = express.Router();

const { validLogin, validSignup } = require('../middlewares/authValidations');
const { thisUser, listUsers, updateUser, removeUser } = require('../controllers/userController');
const { signin, signup } = require('../controllers/authController');
const { newRole } = require('../controllers/roleController');
const { listener, transmitter, findNumbers, findChat } = require('../controllers/chatController');

/**************************************************************/

const swaggerDocs = require('../swagger');

/********************* Swagger API ****************************/

router.get('/api-docs', swaggerUI.setup(swaggerDocs));

/********************* User Controller API ********************/

router.post('/user/:token', thisUser);
router.post('/user', listUsers);
router.put('/user', validSignup, updateUser);
router.delete('/user', validLogin, removeUser);

/********************* Authentication API *********************/

router.post('/auth/signin', validLogin, signin);
router.post('/auth/signup', validSignup, signup);

/********************* Role Controller API ********************/

router.post('/sys/role', newRole);

/********************* WhatsApp Messaging API *****************/

router.get('/message', listener);
router.post('/message', listener);

/********************* Chat and Conversation API **************/

router.post('/chat', findNumbers);
router.post('/chat/:customerNumber', findChat);

/**************************************************************/

module.exports = router;