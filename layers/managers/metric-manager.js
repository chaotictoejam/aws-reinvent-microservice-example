'use strict'

const tokenManager = require('./token-manager.js');
const dal = require('../dal/metric-dal.js');

module.exports.recordMetricEvent = function (event, eventSource, eventAction, currentDuration) {
    //Extract and Add user id to the message
    const userId = tokenManager.getUserId(event);

    const metricEvent = {
        source: eventSource,
        type: "ApplicationService",
        action: eventAction,
        duration: currentDuration,
        dateCreated: (new Date()).toUTCString(),
        userId: userId
    };

    dal.addMetric(event, metricEvent)
}