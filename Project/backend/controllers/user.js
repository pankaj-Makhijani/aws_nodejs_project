const { User } = require("../models");
const logger = require("../config/logger");
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config("./.env");
const path = require("path");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const fs = require("fs");

//Authorozing or initializing nodemailer
var transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});

//Creating S3 bucket object
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "REGION" });

const port = process.env.PORT || 3000;

exports.defaultroute = (req, res) => {
  res.json("OK");
  logger.log(
    "info",
    `Get request on http://localhost:${port}/api/`,
    " IP address ",
    req.ip
  );
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
      logger.log("error", error);
      return res.json({ error: "Data does not exist" });
    })
    .then((User) => {
      res.json(User);
    });
  logger.log(
    "info",
    `Get request on get user by id route http://localhost:${port}/api/findonebyid/:id`,
    " IP address ",
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
      logger.log("error", error);
      return res.json({ error: "delete action unsuccessful" });
    })
    .then((User) => {
      res.json({ msg: "data deleted successfully" });
    });
  logger.log(
    "info",
    `delete request on delete user by id route http://localhost:${port}/api/deleteuser/:id` +
      ` IP address ` +
      req.ip
  );
};

exports.deleteuserbyid = (req, res) => {
  User.destroy({
    where: {
      id: req.profile.id,
    },
  })
    .catch((error) => {
      logger.log("error", error);
      return res.json({ error: "delete action unsuccessful" });
    })
    .then((User) => {
      res.json({ msg: "data deleted successfully" });
    });
  logger.log(
    "info",
    `delete request on delete user by id route http://localhost:${port}/api/deleteuser/:id` +
      ` IP address ` +
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
      logger.log("error", error);
      return res.json({ "error": error.errors[0].message});
      
    });
  // }
  logger.log(
    "info",
    `Post request on update user by id route http://localhost:${port}/api/updateuserbyid`,
    " IP address ",
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
        return res.json({"error":"No such user exists"})
      }
      // console.log(User);
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      logger.log("error", error);
      return res.json({ "error": error.errors[0].message});
      
    });
  // }
  logger.log(
    "info",
    `Post request on update user by id route http://localhost:${port}/api/updateuserbyid`,
    " IP address ",
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
      logger.log("error", error);
      return res.json({ error: "Data does not exist" });
    })
    .then((User) => {
      res.json(User);
    });
  logger.log(
    "info",
    `Get request on find all users by fname route http://localhost:${port}/api/findallbyfname/:fname`,
    " IP address ",
    req.ip
  );
};

exports.signup = async (req, res) => {
  var { fname, lname, email, file,pass } = req.body;
  const fileName = req.body.file;
  var records = [[fname, lname, email,pass]];
  if (records[0][0] != null) {
    await User.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password:pass
    }).then((User) => {
      if(!User){
        return res.json({"msg":"error creating user"})
      }
      logger.log("info", User);
      }).catch((error) => {
        // console.log(error.errors[0].message);
        return res.json({ "error": error.errors[0].message});
      })

 /* sqs start*/

    // {
    //   // Create an SQS service object
    //   var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
    //   var params = {
    //     // Remove DelaySeconds parameter and value for FIFO queues
    //     DelaySeconds: 10,
    //     //send user email in queue body
    //     MessageBody: email,
    //     // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    //     // MessageGroupId: "Group1",  // Required for FIFO queues
    //     QueueUrl: process.env.QUEUE_URL,
    //   };
    //   sqs.sendMessage(params, function (err, data) {
    //     if (err) {
    //       logger.log("error", err);
    //     } else {
    //       logger.log(
    //         "info",
    //         "Data moved to Queue Successfully",
    //         data.MessageId
    //       );
    //     }
    //   });
    // }

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

  //  uploadToS3(process.env.BUCKET_NAME, req.body.fname, req.body.file).then(function (result) {
  //      console.log("Uploaded to s3:", result);
  //      console.log("Download Your Uploaded Item Here "+ result.Location);

  //    }).catch(function (err) {
  //     logger.log('error','Upload to s3 failed ',err.toString());
  //    });

 /* s3 end*/

 /* mail start*/

  // var mailOptions = {
  //   from: process.env.MAIL_SENDER,
  //   to: process.env.MAIL_RECEIVER,
  //   subject: "New User Registered",
  //   text: `Hello admin, New user named ${fname} ${lname} just registered onto your application. View Database for more information`,
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     logger.log("error", error);
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

 /* mail end*/

  }

  logger.log("info",`Post request on createuser route http://localhost:${port}/api/`);
  res.json({ msg: "User created successfully" });
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
    `get request on finall users route http://localhost:${port}/api/findallusers`
  );
};

// exports.getuserbyid = (req,res,next,id) => {
//   // 
// }

exports.signin = (req,res) => {
  User.findOne({
    where:{
      email:req.body.email,
      password:req.body.pass
    }
  })
  .catch((error) => {
    // logger.log("error", error);
    return res.json({ error: "Sign-in error" });
  })
  .then((User) => {
    // res.json(User);
    //create token
    if(!User){
      return res.json({"msg":"E-mail or Password does not match"})
    }
    const token = jwt.sign({ id: User.id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { id, firstname,lastname, email } = User;
    return res.json({ token, user: { id, firstname, lastname, email } });
  });
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
  }).catch((err) => { console.log(err); return res.json(err) })
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
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile.id == req.auth.id;
  // console.log(req.profile.id)
  // console.log(req.auth.id)
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  console.log(req.profile)
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

// //protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: "auth"
});