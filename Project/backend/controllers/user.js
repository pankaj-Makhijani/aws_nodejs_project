const { User } = require("../models");
const logger = require("../config/logger");
const logger2=require("../config/logger2")
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


exports.defaultroute = (req, res) => {
  res.json("OK");
  logger.log(
    "info",
    `Get request on http://localhost:${port}/api/` +
    "from IP address " +
    req.ip
  );

  //Store logs in mysql(Under Development)
  var msg = 'test message';
  logger2.info('first log', {message: msg});
};

//Start controllers for swagger API
exports.getuserbyid = (req, res) => {
  // console.log(req.params.id)
  User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ error: "Data does not exist" });
    })
    .then((User) => {
      res.json(User);
    });
  logger.log(
    "info",
    `Get request on get user by id route http://localhost:${port}/api/findonebyid/:id` +
    "from IP address " +
    req.ip
  );
};

exports.deleteuserbyidunauth = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ error: "delete action unsuccessful" });
    })
    .then((User) => {
      res.json({ msg: "data deleted successfully" });
    });
  logger.log(
    "info",
    `delete request on delete user by id route http://localhost:${port}/api/deleteuser/:id` +
      `from IP address ` +
      req.ip
  );
};

exports.deleteuserbyid = (req, res) => {
  console.log(req.body)
  User.destroy({
    where: {
      id: req.profile.id,
    },
  })
  .then((User) => {
    return res.json({ msg: "data deleted successfully" }).status(200);
  })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      // console.log(req.body)
      return res.json({ err: "delete action unsuccessful" }).status(404);
    })
    
  logger.log(
    "info",
    `delete request on delete user by id route http://localhost:${port}/api/deleteuser/:id` +
      `from IP address ` +
      req.ip
  );
};

exports.updateuserbyidunauth = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  // var records = [[fname,lname,email,uid]];
  // if(records[0][0]!=null)
  // {
  // console.log(req.headers);
  User.update(
    {
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      // role:req.body.role
    },
    {
      where: { id: req.body.uid },
    }
  )
    .then((User) => {
      if(User==0){
        return res.json({"error":"No such user exists"})
      }
      // console.log(User);
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ "error": error.errors[0].message});
      
    });
  // }
  logger.log(
    "info",
    `Post request on update user by id route http://localhost:${port}/api/updateuserbyid`+
    "from IP address "+
    req.ip
  );
};

//End of controllers for swagger API

exports.updateuserbyid = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  // var records = [[fname,lname,email,uid]];
  // if(records[0][0]!=null)
  // {
  // console.log(req.headers);
  User.update(
    {
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      // role:req.body.role
    },
    {
      where: { id: req.profile.id },
    }
  )
    .then((User) => {
      if(User==0){
        return res.json({"msg":"No such user exists"})
      }
      // console.log(User);
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ "msg": error.errors[0].message});
      
    });
  // }
  logger.log(
    "info",
    `Post request on update user by id route http://localhost:${port}/api/updateuserbyid`+
    "from IP address "+
    req.ip
  );
};

exports.findallusersbyfname = (req, res) => {
  // console.log(req.params.id)
  User.findAll({
    where: {
      firstname: req.params.fname,
    },
  })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ error: "Data does not exist" });
    })
    .then((User) => {
      res.json(User);
    });
  logger.log(
    "info",
    `Get request on find all users by fname route http://localhost:${port}/api/findallbyfname/:fname`+
    "from IP address "+
    req.ip
  );
};

var bcrypt = require('bcrypt');
const saltRounds = 10;

// exports.testsignup = (req,res) => {
//   var { fname, lname, email, file,pass } = req.body;
//   bcrypt.hash(pass, saltRounds, function (err,   hash) {
//   User.create({
//     firstname: fname,
//     lastname: lname,
//     email: email,
//     password:hash
//   }).then((User) => {
//       return res.json({"msg":"User Created Successfully"})

//     }).catch((error) => {
//       // console.log(error.errors[0].message);
//       return res.json({ "msg": error.errors[0].message});
//     })
//   })
// }

exports.signup = async (req, res) => {
  var { fname, lname, email, file,pass } = req.body;
  const fileName = req.body.file;
  bcrypt.hash(pass, saltRounds, async (err,   hash) => {
    await User.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password:hash
    }).then((User) => {
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

 /* s3 start*/
  // function uploadToS3(bucketName, keyPrefix, filePath) {
  //      // ex: /path/to/my-picture.png becomes my-picture.png
  //      var fileName = path.basename(filePath);
  //      var fileStream = fs.createReadStream(filePath);

  //      // If you want to save to "my-bucket/{prefix}/{filename}"
  //      //                    ex: "my-bucket/my-pictures-folder/my-picture.png"
  //      var keyName = path.join(keyPrefix, fileName);

  //      // We wrap this in a promise so that we can handle a fileStream error
  //      // since it can happen *before* s3 actually reads the first 'data' event
  //      return new Promise(function(resolve, reject) {
  //          fileStream.once('error', reject);
  //          s3.upload(
  //              {
  //                  //User can upload objects but cannot view them (storing objects privately in bucket)
  //                  // Bucket: bucketName,
  //                  // Key: keyName,
  //                  // Body: fileStream,
  //                  // ContentType:'image/jpeg',
  //                  // ACL:'private'

  //                  //If we want user to upload the object and want to provide the public link to view the image (storing objects privately in bucket)
  //                  Bucket:'baburaoapte',
  //                  Key: keyName,
  //                  Body: fileStream,
  //                  ContentType:'image/jpeg',
  //                  ACL:'public-read'
  //              }
  //          ).promise().then(resolve, reject);
  //      });
  //  }

  //  await uploadToS3(process.env.BUCKET_NAME, req.body.fname, req.body.file).then(function (result) {
  //      console.log("Uploaded to s3:", result);
  //      console.log("Download Your Uploaded Item Here "+ result.Location);
  //       req.profile.Location=result.Location;
  //       console.log(req.body.file)
  //    }).catch(function (err) {
  //     logger.log('error','Upload to s3 failed ',err.toString());
  //    });

 /* s3 end*/

 /* mail start*/

  var mailOptions = {
    from: process.env.MAIL_SENDER,
    to: process.env.MAIL_RECEIVER,
    subject: "New User Registered",
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
        return res.json({"msg":"User Created Successfully"})

      }).catch((error) => {
        // console.log(error.errors[0].message);
        console.log(error)
        logger.log('error',error)
        return res.json({ "msg": error.errors[0].message});
      })
    })
  logger.log("info",`Post request on createuser route http://localhost:${port}/api/`);
};

exports.findallusers = (req, res) => {
  if(req.profile.role!==0){
    User.findAll()
    .catch((error) => {
      logger.log("error", error);
      return res.json({ error: "No data exists" });
    })
    .then((Users) => {
      res.json(Users);
    });
  }
  logger.log(
    "info",
    `get request on finall users route http://localhost:${port}/api/findallusers`+"from IP address "+req.ip
  );
};

// exports.getuserbyid = (req,res,next,id) => {
//   // 
// }

exports.signin = (req,res) => {
  User.findOne({
    where:{
      email:req.body.email,
    }
  })
  .catch((error) => {
    logger.log("error", error);
    console.log(error)
    return res.json({ "msg": "No such E-mail Exists" });
  })
  .then((user) => {

    bcrypt.compare(req.body.pass,user.password,(err,data) => {
      if(data==true)
        {
          //create token
          const token = jwt.sign({ id: User.id }, process.env.SECRET,{expiresIn:'2h'});
          //put token in cookie
          let d=new Date();
          res.cookie("token", token, { expire: d.setTime(d.getTime() + (2*60*60*1000)),httpOnly: false});
      
          //send response to front end
          const { id, firstname,lastname, email,role } = user;
          return res.json({ token, user: { id, firstname, lastname, email,role } });
        }

        else{
          console.log(err)
          logger.log("error", err);
          return res.json({"msg":"Password does not match"})
        }
    })
  });
}

exports.putpresignedurl = async (req,res) => {
  try{
    const url=await s3.getSignedUrlPromise('putObject',{
      Bucket:process.env.BUCKET_NAME,
      Key:'s3presigned.jpeg',
      Expires:100,
    });
    req.signedurl=url;
    return res.json({"url":url})
  }
  catch(err){
    console.log(err)
  }
}

exports.getpresignedurl = async (req,res) => {
  try{
    const url=await s3.getSignedUrlPromise('getObject',{
      Bucket:process.env.BUCKET_NAME,
      Key:req.file,
      Expires:100,
    });
    req.signedurl=url;
    // console.log(req);
    // return res.json({"url":url})
    res.send({ image: url });
  }
  catch(err){
    console.log(err)
    logger.log("error", err);
  }
  }

//middleware
exports.finduserbyid = (req, res, next,id) => {
  // User.findOne({
  //   where:{
  //     id:req.params.id
  //   }
  // },(err, user) => {
  //   if (err || !user) {
  //     return res.status(400).json({
  //       error: "No user was found in DB"
  //     });
  //   }
  //   req.profile = user;
  //   console.log(req.profile)
  //   next();
  // })
  User.findOne({
    where:{
      id:id
    }
  }).catch((err) => { 
    return res.json(err) 
    console.log(err); 
    logger.log("error", error);
    })
  .then((user) => {
    req.profile = user;
    // console.log(req)
    next();
  })
};

exports.getUser = (req, res) => {
  req.profile.password = undefined;
  console.log(req)
  return res.json(req.profile);
};

//custom middlewares
exports.isAuthenticated = (err,req, res, next) => {
  if(err.name === 'UnauthorizedError') {

    logger.error(err);
    return res.status(err.status).json({message:err.message});;
  }
  let checker = req.profile && req.auth && req.profile.id == req.auth.id;
  // console.log(req.profile.id)
  // console.log(req.auth.id)
  if (!checker) {
     return res.json(err) 
    //  logger.log("error", "Access Denied");
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  // console.log(req.profile)
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    logger.log("error", "You are not ADMIN, Access denied");
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User signout successfully"
  });
  logger.log(
    "info",
    `get request on signout route http://localhost:${port}/api/signout`+"from IP address "+req.ip
  );
};

// //protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: "auth"
})