"use strict";

const dal = require('../layers/dal/patient-dal.js');
const logManager = require('../layers/managers/log-manager.js');
const metricManager = require('../layers/managers/metric-manager.js');

module.exports.getPatient = (event, context, callback) => {
  const start = new Date().getTime();  
  logManager.log(event, "PatientService", { "Message": "getPatient() called.", "PatientId": event.pathParameters.patientId });

  dal.getPatient(event, function (response) {
    const end = new Date().getTime();
    metricManager.recordMetricEvent(event, "PatientService", "getPatient", event, end - start);
    callback(null, response);
  });
};

module.exports.updatePatient = (event, context, callback) => {
  const start = new Date().getTime();  
  logManager.log(event, "PatientService", { "Message": "updatePatient() called.", "PatientId": event.pathParameters.patientId });

  dal.updatePatient(event, function (response) {
    const end = new Date().getTime();
    metricManager.recordMetricEvent(event, "PatientService", "updatePatient", event, end - start);
    callback(null, response);
  });
}

module.exports.createPatient = (event, context, callback) => {
  const start = new Date().getTime();  
  logManager.log(event, "PatientService", { "Message": "createPatient() called.", "body": event.body });

  dal.insertPatient(event, function (response) {
    const end = new Date().getTime();
    metricManager.recordMetricEvent(event, "PatientService", "createPatient", event, end - start);
    callback(null, response);
  });
};

module.exports.deletePatient = (event, context, callback) => {
  const start = new Date().getTime();  
  logManager.log(event, "PatientService", { "Message": "deletePatient() called.", "PatientId": event.pathParameters.patientId });

  dal.deletePatient(event, function (response) {
    const end = new Date().getTime();
    metricManager.recordMetricEvent(event, "PatientService", "deletePatient", event, end - start);
    callback(null, response);
  });
};