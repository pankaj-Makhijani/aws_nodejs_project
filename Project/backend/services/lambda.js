// import json
// import boto3

// def lambda_handler(event, context):
//     # TODO implement
//     print(event)
//     ses = boto3.client('ses')

//     response = ses.verify_email_identity(
//     EmailAddress = event['Records'][0]['body']
//     )
//     return {
//         'statusCode': 200,
//         'body': json.dumps('Mail sent')
//     }