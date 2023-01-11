require('dotenv').config();

const swaggerDocs = {

    swagger: "2.0",

    info: {
        title: "WhatsApp Automation Project",
        version: "1.0.0",
    },

    host: `${process.env.HOST}:${process.env.PORT}`,

    basePath: "/",

    paths: {

        "/user": {
            get: {
                tags: ["User"],
                summary: "To fetch all users",
                parameters: [
                    {
                        "in": "body",
                        "schema": {
                            "properties": {
                                "token": {
                                    "type": "string",
                                    required: true,
                                },
                            },
                        },
                    },
                ],
            },
            put: {
                tags: ["User"],
                summary: "To update a user",
                parameters: [
                    {
                        "in": "body",
                        "schema": {
                            "properties": {
                                "firstName": {
                                    "type": "string",
                                    required: true,
                                },
                                "lastName": {
                                    "type": "string",
                                    required: true,
                                },
                                "email": {
                                    "type": "string",
                                    required: true,
                                },
                                "oldPassword": {
                                    "type": "string",
                                    required: true,
                                },
                                "password": {
                                    "type": "string",
                                    required: true,
                                },
                            },
                        },
                    },
                ],
            },
            delete: {
                tags: ["User"],
                summary: "To deactivate a user",
                parameters: [
                    {
                        "in": "body",
                        "schema": {
                            "properties": {
                                "email": {
                                    "type": "string",
                                    required: true,
                                },
                                "password": {
                                    "type": "string",
                                    required: true,
                                },
                            },
                        },
                    },
                ],
            },
        },

        "auth/signin": {
            post: {
                tags: ['Authentication'],
                summary: "To signin",
                parameters: [
                    {
                        "in": "body",
                        "schema": {
                            "properties": {
                                "email": {
                                    "type": "string",
                                    required: true,
                                },
                                "password": {
                                    "type": "string",
                                    required: true,
                                },
                            },
                        },
                    },
                ],
            },
        },

        "auth/signup": {
            post: {
                tags: ['Authentication'],
                summary: "To signup",
                parameters: [
                    {
                        "in": "body",
                        "schema": {
                            "properties": {
                                "firstName": {
                                    "type": "string",
                                    required: true,
                                },
                                "lastName": {
                                    "type": "string",
                                    required: true,
                                },
                                "email": {
                                    "type": "string",
                                    required: true,
                                },
                                "password": {
                                    "type": "string",
                                    required: true,
                                },
                                "role": {
                                    "type": "integer",
                                    required: true,
                                },
                            },
                        },
                    },
                ],
            },
        },
    },

    definitions: {
        User: {
            "properties": {
                "userID": {
                    "type": "integer",
                    "primaryKey": true,
                    "unique": true,
                },
                "firstName": {
                    "type": "string",
                },
                "lastName": {
                    "type": "string",
                },
                "email": {
                    "type": "string",
                    "unique": true,
                },
                "password": {
                    "type": "string",
                },
                "role": {
                    "type": "integer",
                },
                "is_active": {
                    "type": "integer",
                },
            },
        },
    },

    schemes: [`${process.env.PROTOCOL}`],

    consumes: ["application/json"],

    produces: ["application/json"],
};

module.exports = swaggerDocs;