require('dotenv').config();

const axios = require('axios');
const { Sequelize } = require('sequelize');
const chatModel = require('../models/chatModel');

const listener = async (request, response) => {

    if (request.method === 'GET') {

        if (request.query['hub.challenge']) {

            response.status(200).end(request.query['hub.challenge']);

            return;
        }
    }

    if (request.method === 'POST') {

        /* For testing */
        console.log("[+] POST /message");
        /***************/

        if (request.body != null) {

            let entry = request.body.entry[0];

            if (entry) {

                let requestID = entry.id;

                let changes = entry.changes[0];

                if (changes.field === 'messages') {

                    /* For testing */
                    console.log("Recieved new message");
                    /***************/

                    let metaData = changes.value.metadata;
                    let actualData;

                    if(changes.value.messages.length > 0){
                        actualData = changes.value.messages[0];
                    }

                    if (actualData && actualData.type === 'text') {

                        let messageText = actualData.text.body;
                        let whatsappNumber = actualData.from;

                        /* For testing */

                        console.log(`Recieved from: ${whatsappNumber}, text: ${messageText}`);
                        transmitter(whatsappNumber, "Received");

                        /***************/

                        let newMessage = {
                            clientWhatsAppID: 'demoX123',
                            customerNumber: Number(whatsappNumber),
                            customerMessage: {
                                message: messageText,
                                time: `${Date.now().toString()}`,
                            },
                        };

                        chatModel.create(newMessage);
                    }
                }
            }

            response.status(200).end();
            return;
        }
    }

    response.status(400).end(JSON.stringify({
        status: "error",
        message: "the requested resource not found"
    }));
}

const transmitter = async (toPhone, text) => {

    if (toPhone.length > 10 && text.trim().length > 0) {

        /* For testing */
        console.log("Transmitting new message");
        /***************/

        const version = `${process.env.VERSION}`;
        const phoneID = `${process.env.PHONE_ID}`;
        const accessToken = `${process.env.ACCESS_TOKEN}`;

        const URL = `https://graph.facebook.com/${version}/${phoneID}/messages`;

        const request = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `${toPhone}`,
                "type": "text",
                "text": {
                    "body": `${text}`,
                    "preview_url": false,
                },
            }),
        };

        let sent;

        await axios(URL, request)
            .then((response) => {
                let thisID = response.data.contacts[0].wa_id;
                if (toPhone === thisID) {

                    sent = true;

                    let newMessage = {
                        clientWhatsAppID: 'demoX123',
                        customerNumber: Number(toPhone),
                        clientReply: {
                            message: text,
                            time: `${Date.now().toString()}`
                        },
                    };

                    chatModel.create(newMessage);

                    /* For testing */
                    console.log(`Sent to: ${toPhone}, text: ${text}`);
                    /***************/
                }
            })
            .catch((e) => {
                sent = false;
                console.log("Error in sending message");
                console.log(e.message);
            });

        return sent;

    } else if (toPhone.length <= 10) {

        return {
            status: "error",
            message: "phone number is not valid"
        };

    } else if (text.trim().length == 0) {

        return {
            status: "error",
            message: "null text not allowed"
        };
    }
}

const findNumbers = async (request, response) => {

    let chats = await chatModel.findAll({
        attributes: [Sequelize.fn('DISTINCT', Sequelize.col('customerNumber')) ,'customerNumber'],
    });

    let nums = [];

    if(chats.length > 0){
        
        for(let chat of chats){
            nums.push(chat.dataValues.customerNumber);
        }

    }

    response.status(200).end(JSON.stringify({
        customerChats: nums,
    }));
}

const findChat = async (request, response) => {

    const { customerNumber } = request.params;

    if(!customerNumber){

        response.status(400).end(JSON.stringify({
            status: 'error',
            message: 'bad request',
        }));

        return;
    }

    const resp = await chatModel.findAll({ where: { customerNumber: customerNumber }});

    let chats;

    if(resp.length > 0){
        chats = resp.map((element) => {
            let chat = {
                messageID: element.dataValues.chatID,
                customerMessage: (element.dataValues.customerMessage) ? element.dataValues.customerMessage.message : null,
                clientReply: (element.dataValues.clientReply) ? element.dataValues.clientReply.message : null,
                timing: (element.dataValues.customerMessage) ? element.dataValues.customerMessage.time : element.dataValues.clientReply.time, 
            }

            return chat;
        });
    }

    response.status(200).end(JSON.stringify({
        conversation: chats,
    }));
}

module.exports = { transmitter, listener, findNumbers, findChat };