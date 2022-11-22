const { Client } = require('pg');
const crypto = require('crypto')

const logManager = require('../managers/log-manager.js');
const tokenManager = require('../managers/token-manager.js');

const credentials = {
    host: process.env.Patient_DB_HOST,
    database: process.env.Patient_DB_NAME,
    port: 5432,
    user: process.env.Patient_DB_USER,
    password: process.env.Patient_DB_PASSWORD
};

exports.getPatient = (event, callback) => {
    var client = new Client(credentials);
    client.connect(function (err, client) {
        if (err) {
            logManager.log(event, "PatientService", { "Message": "getPatient() failed to connected", "error": err.stack });
            console.log(err.stack);
            callback(createResponse(500, err));
        } else {
            logManager.log(event, "PatientService", { "Message": "getPatient() connected to PostgreSQL database." });
            console.log('Connected to PostgreSQL database');

            const text = "select * from public.Patient where patient_id = $1";
            const values = [event.pathParameters.patientId];
            client.query(text, values, (err, res) => {
                client.end();
                if (err) {
                    logManager.log(event, "PatientService", { "Message": "getPatient() failed to query Patient", "error": err.stack });
                    console.log(err.stack);
                    callback(createResponse(500, err));
                } else {
                    logManager.log(event, "PatientService", { "Message": "getPatient() succeeded.", "result": res.rows[0] });
                    console.log(res.rows[0]);
                    callback(createResponse(200, res.rows[0]));
                }
            });
        }
    });
};

exports.insertPatient = (event, callback) => { 
    var client = new Client(credentials);
    client.connect(function (err, client) {
        if (err) {
            logManager.log(event, "PatientService", { "Message": "insertPatient() failed to connected", "error": err.stack });
            console.log(err.stack);
            callback(createResponse(500, err));
        } else {
            logManager.log(event, "PatientService", { "Message": "insertPatient() connected to PostgreSQL database." });
            console.log('Connected to PostgreSQL database');

            const userId = tokenManager.getUserId(event);

            const text = 'INSERT INTO public.Patient(Patient_id, first_name, last_name, created_by, created_date) VALUES($1, $2, $3, $4, $5) RETURNING *';

            const values = [crypto.randomUUID(), event.body.firstName, event.body.lastName, userId, (new Date()).toUTCString()];
            client.query(text, values, (err, res) => {
                client.end();
                if (err) {
                    logManager.log(event, "PatientService", { "Message": "insertPatient() failed to insert Patient", "error" : err.stack});
                    console.log(err.stack);
                    callback(createResponse(500, err));
                } else {
                    logManager.log(event, "PatientService", { "Message": "insertPatient() succeeded.", "result": res.rows[0]});
                    console.log(res.rows[0]);
                    callback(createResponse(200, res.rows[0]));
                }
            })
        }
    });
};

exports.updatePatient = (event, callback) => {
    var client = new Client(credentials);
    client.connect(function (err, client) {
        if (err) {
            logManager.log(event, "PatientService", { "Message": "updatePatient() failed to connected", "error": err.stack });
            console.log(err.stack);
            callback(createResponse(500, err));
        } else {
            logManager.log(event, "PatientService", { "Message": "updatePatient() connected to PostgreSQL database." });
            console.log('Connected to PostgreSQL database');

            const userId = tokenManager.getUserId(event);

            const text = `UPDATE public.patient 
                            SET first_name = $1,
                            last_name = $2,
                            updated_by = $3,
                            updated_date = $4
                            WHERE patient_id = $5
                            RETURNING *;`;
            const values = [event.body.firstName, event.body.lastName, userId, (new Date()).toUTCString(), event.pathParameters.patientId];

            client.query(text, values, (err, res) => {
                client.end();
                if (err) {
                    logManager.log(event, "PatientService", { "Message": "updatePatient() failed to update Patient", "error": err.stack });
                    console.log(err.stack);
                    callback(createResponse(500, err));
                } else {
                    if (res.rows[0]) {
                        logManager.log(event, "PatientService", { "Message": "updatePatient() succeeded.", "result": res.rows[0] });
                        console.log(res.rows[0]);
                        callback(createResponse(200, res.rows[0]));
                    } else {
                        logManager.log(event, "PatientService", { "Message": "updatePatient() no Patient to update." });
                        callback(createResponse(404, null));
                    }
                }
            })
        }
    });
};

exports.deletePatient = (event, callback) => {
    var client = new Client(credentials);
    client.connect(function (err, client) {
        if (err) {
            logManager.log(event, "PatientService", { "Message": "getPatient() failed to query Patient", "error": err.stack });
            console.log(err.stack);
            callback(createResponse(500, err));
        } else {
            logManager.log(event, "PatientService", { "Message": "deletePatient() connected to PostgreSQL database." });
            console.log('Connected to PostgreSQL database');

            const userId = tokenManager.getUserId(event);
            
            const text = `UPDATE public.Patient 
                            SET deleted_date = $1,
                            deleted_by = $2
                            WHERE Patient_id = $3
                            RETURNING *`;
            const values = [(new Date()).toUTCString(), userId, event.pathParameters.patientId];

            client.query(text, values, (err, res) => {
                client.end();
                if (err) {
                    logManager.log(event, "PatientService", { "Message": "deletePatient() failed to delete Patient", "error": err.stack });
                    console.log(err.stack);
                    callback(createResponse(500, err));
                } else {
                    if (res.rows[0]) {
                        logManager.log(event, "PatientService", { "Message": "deletePatient() succeeded.", "result": res.rows[0] });
                        console.log(res.rows[0]);
                        callback(createResponse(200, res.rows[0]));
                    } else {
                        logManager.log(event, "PatientService", { "Message": "deletePatient() no Patient to delete."});
                        callback(createResponse(404, null));
                    }
                }
            })
        }
    });
};

const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "body": JSON.stringify(body) || ""
    }
};