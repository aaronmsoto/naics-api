const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const util = require('./util');

const TABLE_NAME = process.env.TABLE_NAME;
const TABLE_PARTKEY = process.env.TABLE_PARTKEY;
const TABLE_SORTKEY = process.env.TABLE_SORTKEY;

function get(evt, ctx, cb) {
  //query("get", evt, cb);
  performParamYearValidation(evt.pathParameters.year, cb);
  performParamCodeValidation(true, evt.pathParameters.code, cb);
  const year = evt.pathParameters.year;
  const code = evt.pathParameters.code;
  const sortVal = code.length + "-" + code;
  const params = util.getDynamoParams(TABLE_NAME, TABLE_PARTKEY, year, TABLE_SORTKEY, "=", sortVal, true);
  query(params, cb);
}

function list(evt, ctx, cb) {
  //query("list", evt, cb);
  performParamYearValidation(evt.pathParameters.year, cb);
  performParamCodeValidation(false, evt.pathParameters.code, cb);
  const year = evt.pathParameters.year;
  const code = evt.pathParameters.code;
  const sortVal = code && code.length >= 2 && code.length <= 6 ?
                  code.length + "-" + code :
                  "2-";
  const params = util.getDynamoParams(TABLE_NAME, TABLE_PARTKEY, year, TABLE_SORTKEY, "begins_with", sortVal, true);
  query(params, cb);
}

function performParamYearValidation(year, cb) {
  if(year != "2017") {
    cb(null, util.getHttpResponse(400, "Parameter 'year' is required and only '2017' is currently supported."));
  }
}

function performParamCodeValidation(isRequired, code, cb) {
  if(isRequired) {
    //code IS REQUIRED...
    if(!code || code.length < 2 || code.length > 6 || typeof code != Number) {
      cb(null, util.getHttpResponse(400, "Parameter 'code' must be a valid numeric code with 2-6 digits."));
    }
  } else {
    //code NOT REQUIRED...
    if(code && (code.length < 2 || code.length > 6 || typeof code != Number)) {
      cb(null, util.getHttpResponse(400, "Parameter 'code' must be a valid numeric code with 2-6 digits, or omitted to list root industries."));
    }
  }
}

function query(params, cb) {
  dynamo.query(params, (err, data) => {
    if (err) {
      cb(null, util.getHttpResponse(500, err));
    } else {
      const body = data.Item || data.Items || null;
      cb(null, util.getHttpResponse(200, body));
    }
  });
}

module.exports = {
  get,
  list
};

