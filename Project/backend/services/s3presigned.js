const { user } = require("../models");
const logger = require("../config/logger");
const mylogger=require("../config/logger2")
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config("../.env");
const path = require("path");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const fs = require("fs");
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
const activitylog=require("../config/logger3")

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

exports.getpresignedurl = async (req,res) => {
    try{
      const url=await s3.getSignedUrlPromise('getObject',{
        Bucket:process.env.BUCKET_NAME,
        Key:req.file,
        Expires:Number(String(process.env.URL_EXPIRE)),
      });
      req.signedurl=url;
      // console.log(req);
      // return res.json({"url":url})
      activitylog.info("url sent to user id"+req.profile.id) 
      res.send({ image: url });
    }
    catch(err){
      console.log(err)
      logger.log("error", err);
    }
    mylogger.info(`Request on getpresignedurl route` +
    "from IP address " +
    req.ip);
    }