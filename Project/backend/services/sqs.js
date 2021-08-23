const { user } = require("../models");
const logger = require("../config/logger");
const mylogger=require("../config/logger2")
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config("./.env");
const path = require("path");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const fs = require("fs");
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

//creating s3 bucket
const s3 = new AWS.S3();

const port = process.env.PORT || 3000;
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
   console.log(err)
       logger.log("error", err);
     } else {
       logger.log(
         "info",
         "Data moved to Queue Successfully"+
         data.MessageId
       );
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
   logger.log("error", error);
   console.log(error);
 } else {
   console.log("Email sent: " + info.response);
   logger.log('info',"Email sent: " + info.response)

 }
});

/* mail end*/
     return res.json({"msg":"user Created Successfully"})

   }