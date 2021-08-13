
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config("./.env");

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
     cb(null, true);
    } else {
     cb(new Error('Wrong file type, only upload JPEG and/or PNG !'), 
     false);
    }
   };

   const upload = multer({
   fileFilter: fileFilter,
   storage: multerS3({
    acl: 'private',
    s3,
    bucket: process.env.BUCKET_NAME,
    key: function(req, file, cb) {
      /*I'm using Date.now() to make sure my file has a unique name*/
      d=Date.now();
      x=req.profile.firstname+req.profile.lastname;
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