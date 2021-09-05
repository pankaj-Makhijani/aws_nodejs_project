const activitylog=require("../config/logger3")
require("dotenv").config("./.env");

const nodemailer = require("nodemailer");
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

//Authorozing or initializing nodemailer
var transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});


AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  // Set the region
  region: process.env.REGION //E.g us-east-1
 });

exports.sqs = (req,res) => 
{
  var { fname, lname, email, file,pass } = req.body;
    /* sqs start*/

 {
   // Create an SQS service object
   var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
   var params = {
     // Remove DelaySeconds parameter and value for FIFO queues
     DelaySeconds: 10,
     //send user email in queue body
     MessageBody: email,
     // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
     // MessageGroupId: "Group1",  // Required for FIFO queues
     QueueUrl: process.env.QUEUE_URL,
   };
   sqs.sendMessage(params, function (err, data) {
     if (err) {
       activitylog.error("sqs service error while signup of user "+email)
     } else {
       activitylog.info("sqs service success while signup of user "+email)
     }
   });
 }

/* sqs end*/

/* mail start*/

var mailOptions = {
 from: process.env.MAIL_SENDER,
 to: process.env.MAIL_RECEIVER,
 subject: "New user Registered",
 text: `Hello admin, New user named ${fname} ${lname} just registered onto your application. View Database for more information`,
};

transporter.sendMail(mailOptions, function (error, info) {
 if (error) {
  activitylog.error("Error occured while noifying admin on signup user "+email)
 } else {
   activitylog.error("Success while noifying admin on signup user "+email)
 }
});

/* mail end*/
     return res.json({"msg":"user Created Successfully"})
   }