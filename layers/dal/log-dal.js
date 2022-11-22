'use strict';

const crypto = require('crypto')
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = "Log";
const tableDefinition = {
    AttributeDefinitions: [
        {
            AttributeName: "LogId",
            AttributeType: "S"
        }],
    KeySchema: [
        {
            AttributeName: "LogId",
            KeyType: "HASH"
        }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: tableName
};

// Add Logging Event to DynamoDB 
module.exports.addLog = (event, message) => {
    const item = {
        "LogId": crypto.randomUUID(),
        "message": message
    };

    const params = {
        "TableName": tableName,
        "Item": item
    };

    dynamodb.put(params, (err) => {
        if (err) {
            console.log(err.stack);
            throw err
        }
    });
};