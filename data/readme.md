# NAICS Codes
This data folder contains a variety of data files for NAICS codes in different formats (XLSX, CSV, TXT/TSV, and JSON). The data currently ONLY HAS 2017 codes.

## About the NAICS_Codes.xlsx File
The fact that some top-level code groups have ranges like 31-33, 44-45, and 47-48 posed issues with efficient querying, so I supplemented the source data in a way that can supply a prefix override of sorts allowing me to query a prefix of "3a" to represent that "31-33" case. I then use the source and augmented fields to concatenate a SortKey named CurrLevelAndNextPrefixAndCode (format: "5|921190|921190" or "1|3a|31-33") to info details considering the record's level, child prefix, and current code. It got a bit cryptic, but this allows for very efficient DynamoDb HashKey + SortKey querying.

## DynamoDB Structure
NAICSYear (HashKey)\
CurrLevelAndNextPrefixAndCode (SortKey)\
SeqNum\
NAICSCode (Local Secondary Index)\
Title\
CodeAndTitle (eg: "238220: Plumbing, Heating, and Air-Conditioning Contractors")

## Importing Data to DynamoDB
If you want to host this data yourself, use the following command inside this data folder:
`node dynamodb-bulkwriteitem.js [region] [filename] [tablename]`

### Parameters
region: Default => us-east-1 (OPTIONAL)\
filename: Default => ./NAICS_Codes.txt (OPTIONAL)\
tablename: Default => naics (OPTIONAL)

### Examples
`node dynamodb-bulkwriteitem.js`\
`node dynamodb-bulkwriteitem.js us-west-2`\
`node dynamodb-bulkwriteitem.js us-west-2 ./NAICS_Codes_2012.txt`\
`node dynamodb-bulkwriteitem.js us-west-2 ./NAICS_Codes_2012.txt naics`

### NOTE:
As of 1/21/2019, I have noticed issues with using the import script not importing all data on the first try and have not found the source of the issue.  Running several imports using varying batch sizes seems to get around the issue.  Since I now have my data imported and it won't be changing, finding the root cause is a low priority.