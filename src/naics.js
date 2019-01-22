const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const util = require('./util');

const TABLE_NAME = process.env.TABLE_NAME;
const TABLE_PARTKEY = process.env.TABLE_PARTKEY;
const TABLE_SORTKEY = process.env.TABLE_SORTKEY;
const TABLE_LSINAME = process.env.TABLE_LSINAME;
const TABLE_LSIPROP = process.env.TABLE_LSIPROP;

function get(evt, ctx, cb) {
  console.log(ctx.functionName + ' called with EVENT: ' + JSON.stringify(evt));
  performParamYearValidation(evt.pathParameters.year, cb);
  performParamCodeValidation(true, evt.pathParameters.code, cb);
  const year = evt.pathParameters.year;
  const code = evt.pathParameters.code;
  const params = util.getDynamoParams(TABLE_NAME, TABLE_PARTKEY, year, TABLE_LSIPROP, "=", code, TABLE_LSINAME, true);
  query(params, cb);
}

function list(evt, ctx, cb) {
  console.log(ctx.functionName + ' called with EVENT: ' + JSON.stringify(evt));
  performParamYearValidation(evt.pathParameters.year, cb);
  performParamCodeValidation(false, evt.pathParameters.code, cb);
  const year = evt.pathParameters.year;
  const code = evt.pathParameters.code;
  const sortVal = code && code.length >= 2 && code.length <= 6 ?
                  code.length + "|" + code :
                  "1|";
  const params = util.getDynamoParams(TABLE_NAME, TABLE_PARTKEY, year, TABLE_SORTKEY, "begins_with", sortVal, null, true);
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
    if(!code || code.length < 2 || code.length > 6) {
      cb(null, util.getHttpResponse(400, "Parameter 'code' must be a valid numeric code with 2-6 digits."));
    }
  } else {
    //code NOT REQUIRED...
    if(code && (code.length < 2 || code.length > 6)) {
      cb(null, util.getHttpResponse(400, "Parameter 'code' must be a valid numeric code with 2-6 digits, or omitted to list root industries."));
    }
  }
}

function query(params, cb) {
  dynamo.query(params, (err, data) => {
    if (err) {
      cb(null, util.getHttpResponse(500, err));
    } else {
      console.log(JSON.stringify(data));
      if(data.Items) {
        if(data.Items.length === 0) {
          cb(null, util.getHttpResponse(404, null));
        } else if(data.Items.length === 1) {
          cb(null, util.getHttpResponse(200, data.Items[0]));
        } else {
          cb(null, util.getHttpResponse(200, data.Items));
        }
      } else {
        cb(null, util.getHttpResponse(500, "NO DATA RETURNED"));
      }
    }
  });
}

module.exports = {
  get,
  list
};

