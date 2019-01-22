# naics-api
A NodeJS-based REST API to perform readonly LIST+GET queries on NAICS codes. Currently using only 2017 NAICS code data from census.gov.

##Project Structure
**/data:** Contains my augmented census.gov data files, a data import script, and instructions, etc.\
**/src:** Contains the main source code for the API.\

##More Info
This project is built with the following tools...\
* [Serverless Framework](https://Serverless.com): For easier infrastructure-as-code, code deployment, and other dev-experience improvements. \
* [AWS API Gateway, Lambda, and DynamoDb](https://aws.amazon.com): All defined and provisioned via the /src/serverless.yml file.\
