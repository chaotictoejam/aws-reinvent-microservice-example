# AWS re:Invent Microservice Example
This is the example microservice shown for my AWS Re:Invent Dev Chat. This is an example microservice that shows you how to structure your service using Lambda Layers. The code is structured as follows:
* /serverless.yml
    * yml file so you can deploy your microservice, be sure to update your environment variables
* /service/patient-service.js
    * This contains the handlers for the CRUD endpoints (GetPatient, UpdatePatient, CreatePatient, and DeletePatient)
* /layers/dal
    * log-dal.js - This is the data access layer file for accessing the DynamoDB Log table
    * metric-dal.js - This is the data access layer file for accessing the DynamoDB Metric table
    * patient-dal.js - This is the data access layer file for accessing the PostGres Patient DB
* /layers/managers
    * log-manager.js - Instead of directly accessing the DALs, functions should call the log manager to log events
    * metric-manager.js - Instead of directly accessing the DALs, functions should call the metric manager to record metric events
    * token-manager.js - this decodes the JWT token passed and retrieves the userId claim in the token
* /mocks
    * These are example mocks so you can test the code locally using serverless framework

