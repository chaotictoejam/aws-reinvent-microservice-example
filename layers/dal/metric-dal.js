'use strict';

const crypto = require('crypto')
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = "Metric";
const tableDefinition = {
    AttributeDefinitions: [
        {
            AttributeName: "MetricId",
            AttributeType: "S"
        }],
    KeySchema: [
        {
            AttributeName: "MetricId",
            KeyType: "HASH"
        }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: tableName
};

// Add Metric to DynamoDB 
module.exports.addMetric = (event, message) => {
    const item = {
        "MetricId": crypto.randomUUID(),
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