console.log('Loading function');
var AWS = require("aws-sdk");

//tried to notify the registered user using below code but it wasn't working so integrated that part in backend itself
// const nodemailer = require('nodemailer');
//Authorozing or initializing nodemailer
// var transporter = nodemailer.createTransport({
//   service: "outlook",
//   auth: {
//     user: "senderemailid420@outlook.com",
//     pass: "Password@123"
//   }
// });

exports.handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const { messageId, body } of event.Records) {
        console.log('SQS message %s: %j', messageId, body);
    
    //         var mailOptions = {
// 		from: "sheelakijawani420@outlook.com",
// 		to: body,
// 		subject: 'AWS Community',
// 		text: `Hello Welcome to AWS community. Message sent from lambda function`
// 	  };
	  
// 	  transporter.sendMail(mailOptions, function(error, info){
// 		if (error) {
// 		  console.log(error);
// 		} else {
// 		  console.log('Email sent: ' + info.response);
// 		}
// 	  });
 
 //notifying admin whenever lambda function is triggered or say new user is registered
    var sns = new AWS.SNS();
            
    var params = 
    {
        Message: `New user ${body} registered for Aws Summit 2021 Program, kindly check database for more details`, 
        Subject: "Test SNS From Lambda",
        TopicArn: "paste_your_sns_topic_arn_here"
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); 
        else console.log(data);
    });
    }
    return `Successfully processed ${event.Records.length} messages.`;
};
