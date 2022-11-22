'use strict';

const tokenManager = require('./token-manager.js');
const dal = require('../dal/log-dal.js');

//Log a message
module.exports.log = function (event, eventSource, message) {
    console.log(JSON.stringify(message));

    //Extract and Add user id to the log message
    const userId = tokenManager.getUserId(event);
    message.userId = userId;

    message.source = eventSource;
    message.dateCreated = (new Date()).toUTCString();

    dal.addLog(event, message)
};