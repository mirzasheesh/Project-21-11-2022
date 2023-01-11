const validLogin = (request, response, next) => {

    const { email, password } = request.body;

    if (email.length <= 1 || password.length <= 1) {

        response.status(400).end(JSON.stringify({
            status: "error",
            message: "email or password are not valid"
        }));

    } else {

        next();

    }
};

const validSignup = (request, response, next) => {

    const { firstName, lastName, email, password } = request.body;

    if (firstName == undefined || lastName == undefined || email == undefined || password == undefined) {

        response.status(400).end(JSON.stringify({
            status: "error",
            message: "invalid parameters"
        }));

        return;

    }

    if (firstName.length <= 1 || lastName.length <= 1) {

        response.status(400).end(JSON.stringify({
            status: "error",
            message: "invalid first or last name"
        }));

        return;

    }

    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        
        response.status(400).end(JSON.stringify({
            status: "error",
            message: "invalid email address"
        }));

        return;

    }

    if (password.length < 8) {

        response.status(400).end(JSON.stringify({
            status: "error",
            message: "passwords must be at least 8 characters long"
        }));

        return;

    }
    
    next();
};

module.exports = { validLogin, validSignup };