/**
  * @author aaron.soto
  * @desc Library function to return an http response.
  * @param number $code - the http code to return as part of the response.
  * @param object $body - the body data to return as part of the response.
  * @return object - the http response object.
*/
function getHttpResponse(code, body) {
  code = code || 200;
  body = body || '';
  return {
    isBase64Encoded: false,
    headers: {
      "Access-Control-Allow-Headers" : "*",           // Required for CORS support to work
      "Access-Control-Allow-Origin" : "*",            // Required for CORS support to work
      "Access-Control-Allow-Methods" : "*",           // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true,      // Required for cookies, authorization headers with HTTPS
      "Content-Type": "application/json"
    },
    statusCode: code,
    body: JSON.stringify(body)
  };
}

/**
    * @author aaron.soto
    * @desc Internal function to get a DynamoDb params object.
    * @param string $tblName - the DynamoDb table name to query.
    * @param string $keyName - the DynamoDb partition key name.
    * @param string $keyValue - the DynamoDb partition key value to query.
    * @param string $sortName - the DynamoDb sort key name.
    * @param string $sortOperator - the DynamoDb sort operator to perform (see AWS docs for details).
    * @param string $sortValue - the DynamoDb sort key value to query.
    * @param bool $doLogParams - optional bool=true to log the params result before returning.
    * @return string - the params object result.
*/
function getDynamoParams(tblName, keyName, keyValue, sortName, sortOperator, sortValue, lsiName, doLogParams) {
    let params = {
      TableName: tblName,
      KeyConditionExpression: "#keyName = :keyValue",
      ExpressionAttributeNames: {
        "#keyName": keyName
      },
      ExpressionAttributeValues: {
        ":keyValue": keyValue
      }
    };
    if(lsiName) {
      params.IndexName = lsiName;
    }
    if(sortName && sortOperator && sortValue) {
      if(sortOperator.toLowerCase() === "begins_with") {
        params.KeyConditionExpression += " and begins_with(#sortName, :sortValue)";
      } else {
        params.KeyConditionExpression += " and #sortName " + sortOperator + " :sortValue";
      }
      params.ExpressionAttributeNames["#sortName"] = sortName;
      params.ExpressionAttributeValues[":sortValue"] = sortValue;
    }
    if(doLogParams === true) { console.log("getDynamoParams => " + JSON.stringify(params)); }
    return params;
}

module.exports = {
  getHttpResponse,
  getDynamoParams
};