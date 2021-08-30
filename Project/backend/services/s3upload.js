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
const multer = require('multer');
const multerS3 = require('multer-s3');


// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.REGION //E.g us-east-1
 });

 //creating s3 bucket
 const s3 = new AWS.S3();
 /* In case you want to validate your file type */
 const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      activitylog.info("user with id "+req.profile.id+" uploaded image to s3") 
     cb(null, true);
    } else {
      activitylog.error("Wrong file type error user with id "+req.profile.id) 
     cb(new Error('Wrong file type, only upload JPEG and/or PNG !'), 
     false);
    }
   };

   const filename = (fn,ln) => {
    return fn+ln;
   }

   exports.sets3params = (req,res,next) => {
    req.BUCKET_NAME=process.env.BUCKET_NAME;
    req.S3EXPIRES=Number(String(process.env.URL_EXPIRE)) || 1000
    next()
   }

   exports.upload =  multer({
      fileFilter: fileFilter,
      storage: multerS3({
       acl: 'private',
       s3,
       bucket: process.env.BUCKET_NAME,
       key: function(req, file, cb) {
         /*I'm using Date.now() to make sure my file has a unique name*/
         d=Date.now();
         fname=req.profile.firstname;
         lname=req.profile.lastname;
         x=filename(fname,lname)
         // console.log( x)
         // console.log( file.originalname)
         // console.log( file.mimetype)
         req.file = (x || d)+".jpeg";
         // console.log( req.file)
         cb(null, (x || d)+".jpeg");
        }
       })
      })
 
  exports.getpresignedurl = async (req,res) => {
      try{
        const url=await s3.getSignedUrlPromise('getObject',{
          Bucket:req.BUCKET_NAME,
          Key:req.file,
          Expires:req.S3EXPIRES,
        });
        req.signedurl=url;
        // console.log(req);
        // return res.json({"url":url})
        activitylog.info("url sent to user id "+req.profile.id) 
        res.send({ image: url });
      }
      catch(err){
        // console.log(err)
        logger.log("error", err);
        activitylog.info("Error occured during presignedurl of user id "+req.profile.id) 
      }
      mylogger.info(`Request on getpresignedurl route` +
      "from IP address " +
      req.ip);
      }