const roleModel = require('../models/roleModel');
const { checkToken } = require('./authentication');

const newRole = async (request, response) => {

    const { newRole, token } = request.body;

    if (!newRole || !token || newRole.trim() != "") {

        response.status(400).end(JSON.stringify({
            status: "error",
            message: "invalid request parameters"
        }));

        return;
    }

    let user = checkToken(token);

    if (!user || user.role != 1) {

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "access denied"
        }));

        return;
    }

    let thisRole = await roleModel.findOne({ roleName: newRole });

    if (thisRole == null) {

        thisRole = await roleModel.create({ roleName: newRole });

        response.status(201).end(JSON.stringify({
            status: "success",
            roleID: `${thisRole.roleID}`
        }));

        return;

    } else {

        response.status(401).end(JSON.stringify({
            status: "error",
            message: "this role already exists"
        }));

        return;
    }
}

module.exports = { newRole };