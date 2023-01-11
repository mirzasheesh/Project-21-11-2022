const userModel = require('../models/userModel');

const { encrypt, decrypt } = require('./encryption');
const { checkToken } = require('./authentication');

const thisUser = async (request, response) => {

    const { token } = request.body;

    if(token){

        const thisUser = checkToken(token);

        if(thisUser){

            response.status(200).end(JSON.stringify({
                firstName: thisUser.firstName,
                lastName: thisUser.lastName,
                email: thisUser.email,
                role: thisUser.role,
            }));

            return;
        }
    }

    response.status(400).end(JSON.stringify({
        status: "error",
        message: "request is not valid"
    }));
}

const listUsers = async (request, response) => {

    const { token, reqRole } = request.body;

    if(token){

        const user = checkToken(token);

        if(user && user.role < 3){
            
            let list;

            if(reqRole > 1){

                list = await userModel.findAll({where: { role: reqRole }});

            }else{
                
                list = await userModel.findAll();
            }

            list = list.map((eachUser) => {

                let user = {
                    name: `${eachUser.firstName} ${eachUser.lastName}`,
                    email: `${eachUser.email}`,
                    role: `${eachUser.role}`,
                    is_active: `${eachUser.is_active}`
                }

                return user;
            });

            response.status(201).end(JSON.stringify(list));

            return;

        }else{

            response.status(401).end(JSON.stringify({
                status: "error",
                message: "access denied"
            }));
    
            return;
        }
    }

    response.status(400).end(JSON.stringify({
        status: "error",
        message: "request is not valid"
    }));
}

const removeUser = (request, response) => {

    const { email, password } = request.body;

    userModel.findOne({ where: { email: email } }).then((thisUser) => {

        if (decrypt(password, thisUser.password)) {

            thisUser.is_active = 0;

            thisUser.save();

            response.status(200).end(JSON.stringify({
                status: "success",
                message: "user removed"
            }));

        } else {

            response.status(401).end(JSON.stringify({
                status: "error",
                message: "invalid credentials"
            }));

        }

    }).catch(() => {

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "invalid credentials"
        }));

    });
};

const updateUser = (request, response) => {

    const { firstName, lastName, email, oldPassword, password } = request.body;

    userModel.findOne({ where: { email: email } }).then((thisUser) => {

        if (decrypt(oldPassword, thisUser.password)) {

            if (firstName) thisUser.firstName = firstName;
            if (lastName) thisUser.lastName = lastName;
            if (password) thisUser.password = `${encrypt(password)}`;

            thisUser.save();

            response.status(200).end(JSON.stringify({
                status: "success",
                message: "user details updated"
            }));

        } else {

            response.status(401).end(JSON.stringify({
                status: "error",
                message: "invalid credentials"
            }));

        }

    }).catch(() => {

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "invalid credentials"
        }));

    });
};

module.exports = { thisUser, listUsers, updateUser, removeUser };