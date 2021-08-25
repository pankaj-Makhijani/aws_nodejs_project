
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config("./.env");
const activitylog=require("../config/logger3")

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

   const upload = multer({
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
   });

   module.exports = upload;