//Adapted from the following StackOverflow.com post...
//https://stackoverflow.com/questions/32678325/how-to-import-bulk-data-from-csv-to-dynamodb

const REGION = process.argv[2] || "us-east-1";
const FILE   = process.argv[3] || "./NAICS_Codes.txt";
const TABLE  = process.argv[4] || "naics";

const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ region: REGION });

rs = fs.createReadStream(FILE);
parser = parse({
    columns: true,
    delimiter: '\t'
}, function(err, data) {
    //console.log(data); return;
    var split_arrays = [];
    var batchSize = 1;    //NOTE!!! Support to be 25, but I was randomly missing rows using values other than 1. :/

    //for(var rowIndex = 0; rowIndex < data.length; rowIndex++) {
    while (data.length > 0) {
        let currBatch = data.splice(0, batchSize)
        let item_data = []

        for (var i = 0; i < currBatch.length; i++) {
          const row = currBatch[i];
          //console.log(JSON.stringify(row));
          let this_item = {
            "PutRequest" : {
              "Item": {
                "SeqNum": {
                  "N": row.SeqNum.toString().trim()
                },
                "NAICSCode": {
                  "S": row.NAICSCode.toString().trim()
                },
                "Title": {
                  "S": row.Title.toString().trim()
                },
                "CodeAndTitle": {
                  "S": row.CodeAndTitle.toString().trim()
                },
                "NAICSYear": {
                  "S": row.NAICSYear.toString().trim()
                },
                "CurrLevelAndNextPrefixAndCode": {
                  "S": row.CurrLevelAndNextPrefixAndCode.toString().trim()
                }
              }
            }
          };
          //console.log(JSON.stringify(this_item));
          item_data.push(this_item)
        }
        split_arrays.push(item_data);
    }
    data_imported = false;
    chunk_no = 1;
    async.each(split_arrays, (item_data, callback) => {
      let params = { RequestItems: {} }
      params.RequestItems[TABLE] = item_data
      console.log(JSON.stringify(params));
      ddb.batchWriteItem(params, function(err, res, cap) {
          if (err === null) {
              console.log('Success chunk #' + chunk_no);
              data_imported = true;
          } else {
              console.log(err);
              console.log('Fail chunk #' + chunk_no);
              data_imported = false;
          }
          chunk_no++;
          callback();
      });

  }, () => {
      // run after loops with a 5s wait period
      //(not all data appears to import and data towards the end is missing most often)
      setTimeout(function(){
        console.log('all data imported....');
    }, 5000);

  });

});
rs.pipe(parser);