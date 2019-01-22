# naics-api
A NodeJS-based REST API to perform readonly LIST+GET queries on NAICS codes. Currently using only 2017 NAICS code data from census.gov.\
See: [Census.gov NAICS Info](https://www.census.gov/eos/www/naics/)
See: [SICCODE.com NAICS Web Interface](https://siccode.com/en/naicscode/list/directory)

## Project Structure
**/data:** Contains my augmented census.gov data files, a data import script, and instructions, etc.\
**/src:** Contains the main source code for the API.

## More Info
This project is built with the following tools...
* [Serverless Framework](https://Serverless.com): For easier infrastructure-as-code, code deployment, and other dev-experience improvements.
* [AWS API Gateway, Lambda, and DynamoDb](https://aws.amazon.com): All defined and provisioned via the /src/serverless.yml file.

## QA/Test API
**LIST Endpoint:** https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/list/{year}/{code?}\
**year**: REQUIRED. Currently only 2017 is supported so always use that.\
**code**: OPTIONAL. Omit to list root industries or include a prefix to list child industries.

**GET Endpoint:** https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/get/{year}/{code}\
**year**: REQUIRED. Currently only 2017 is supported so always use that.\
**code**: REQUIRED. The code that you want to get.

## Examples...
List all root industries:\
`GET https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/list/2017/`

List children of '23' Construction:\
`GET https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/list/2017/23`

List children of '31-33' Manufacturing:\
`GET https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/list/2017/3a`\
(*note the special '3a' prefix to capture children for 31, 32, and 33)

List children of '339' Miscellaneous Manufacturing:\
`GET https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/list/2017/339`\
(*note back to standard '339' prefix)

Get code '339112' Surgical and Medical Instrument Manufacturing:\
`GET https://itoq6b7hcl.execute-api.us-east-1.amazonaws.com/test/naics/get/2017/339112`

*The prefix to use for child queries can be parsed from the CurrLevelAndNextPrefixAndCode field as explained in the **/data** folder.
