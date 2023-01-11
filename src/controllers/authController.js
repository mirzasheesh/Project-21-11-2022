const model = require('../models/userModel');

const { newToken } = require('./authentication');
const { encrypt, decrypt} = require('./encryption');

const signin = async (request, response) => {
    
    const {email, password} = request.body;

    const user = await model.findOne({where : {email: `${email}`}});
    
    if(!user || !decrypt(password, user.password)){

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "invalid credentials"
        }));

        return;
    }

    if(user.is_active === 0){

        
        response.status(401).end(JSON.stringify({
            status: "error",
            message: "user is inactive"
        }));

        return;

    }

    const thisToken = newToken({firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role});

    response.status(201).end(JSON.stringify({
        status: "success",
        token: `${thisToken}`
    }));
};

const signup = async (request, response) => {

    const {firstName, lastName, email, password, role, ref} = request.body;
    
    const isUser = await model.findOne({where : {email: `${email}`}});
    
    if(isUser){

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "user with this email already exists"
        }));
        
        return;
    }

    let thisRole = 3;
    
    if(ref === process.env.superRef) thisRole = 1;

    const user = {
        firstName: `${firstName}`,
        lastName: `${lastName}`,
        email: `${email}`,
        password: `${encrypt(password)}`,
        role: thisRole,
        is_active: 1,
    };
    
    model.create(user);
    
    response.status(201).end(JSON.stringify({
        status: "success",
        message: "user registered"
    }));
};

module.exports = {signin, signup};