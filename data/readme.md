#NAICS Codes
This data folder contains a variety of data files for NAICS codes in different formats (XLSX, CSV, TXT/TSV, and JSON). The data currently ONLY HAS 2017 codes.

##Importing Data to DynamoDB
If you want to host this data yourself, use the following command inside this data folder:
`node dynamodb-bulkwriteitem.js [region] [filename] [tablename]`

###Parameters
region: Default => us-east-1 (OPTIONAL)\
filename: Default => ./NAICS_Codes.txt (OPTIONAL)\
tablename: Default => naics (OPTIONAL)\

###Examples
`node dynamodb-bulkwriteitem.js`
`node dynamodb-bulkwriteitem.js us-west-2`
`node dynamodb-bulkwriteitem.js us-west-2 ./NAICS_Codes_2012.txt`
`node dynamodb-bulkwriteitem.js us-west-2 ./NAICS_Codes_2012.txt naics`

###NOTE:
As of 1/21/2019, I have noticed issues with using the import script not importing all data on the first try and have not found the source of the issue.  Running several imports using varying batch sizes seems to get around the issue.  Since I now have my data imported and it won't be changing, finding the root cause is a low priority.