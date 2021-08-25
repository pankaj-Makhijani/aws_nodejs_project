const { user,usercard,card } = require("../models");

const logger = require("../config/logger");
const mylogger=require("../config/logger2")
const activitylog=require("../config/logger3")
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

 exports.getcardbyid = (req,res) => {
  user.findOne({
    where: {
      id: req.params.id,
    },
    include:{
				model:card,
				as:'cards',
				}
  })
    .catch((error) => {
      // console.log(error)
      activitylog.error("Error occured during getcardbyid on user id"+req.params.id)
    })
    .then((user) => {
      activitylog.info("user id "+user.id+" made request on getcardbyid route") 
      return res.json(user);
    });
 }

exports.defaultroute = (req, res) => {
  res.json("OK");
  logger.log(
    "info",
    `Get request on http://localhost:${port}/api/` +
    "from IP address " +
    req.ip
  );

  //Store logs in mysql(Under Development)
  mylogger.info(`Get request on Default Route` +
  "from IP address " +
  req.ip);
};

//Start controllers for swagger API
exports.getuserbyid = (req, res) => {
  // console.log(req.params.id)
  user.findOne({
    where: {
      id: req.params.id,
    },
  })
    .catch((error) => {
      // console.log(error)
      logger.log("error", error);
      activitylog.error("Error occured during getuserbyid on user id"+req.params.id)

      return res.json({ error: "Data does not exist" });
    })
    .then((user) => {
      activitylog.info("user id "+user.id+" made request on getuserbyid route") 
      res.json(user);
    });
  logger.log(
    "info",
    `Get request on get user by id route http://localhost:${port}/api/findonebyid/:id` +
    "from IP address " +
    req.ip
  );
  mylogger.info(`Get request on getuserbyid Route` +
  "from IP address " +
  req.ip);
};

exports.deleteuserbyidunauth = (req, res) => {
  user.destroy({
    where: {
      id: req.params.id,
    },
  })
    .catch((error) => {
      // console.log(error)
      activitylog.error("Error occured during deleting account on user id "+req.params.id)
      logger.log("error", error);
      return res.json({ error: "delete action unsuccessful" });
    })
    .then((user) => {
      activitylog.info("user id "+req.params.id+" deleted their acount") 
      res.json({ msg: "data deleted successfully" });
    });
  logger.log(
    "info",
    `delete request on delete user by id route http://localhost:${port}/api/deleteuser/:id` +
      `from IP address ` +
      req.ip
  );
  mylogger.info(`delete request on deleteuserbyidunauth route` +
  "from IP address " +
  req.ip);
};

exports.deleteuserbyid = (req, res) => {
  console.log(req.body)
  user.destroy({
    where: {
      id: req.body.id,
    },
  })
  .then((user) => {
    activitylog.info("user id "+req.body.id+" deleted their account") 
    return res.json({ msg: "data deleted successfully" }).status(200);
  })
    .catch((error) => {
      // console.log(error)
      activitylog.error("Error occured during deleting account on user id "+req.body.id)
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
  mylogger.info(`delete request on deleteuserbyid route` +
  "from IP address " +
  req.ip);
};

exports.updateuserbyidunauth = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  // var records = [[fname,lname,email,uid]];
  // if(records[0][0]!=null)
  // {
  // console.log(req.headers);
  user.update(
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
    .then((user) => {
      if(user==0){
        activitylog.error("No such user id " + req.body.uid +" exists while updating account")
        return res.json({"error":"No such user exists"})
      }
      // console.log(user);
      activitylog.info("user id "+req.body.uid+" updated their account details") 
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      // console.log(error)
      activitylog.error("Error occured " + error.errors[0].message + " while updating user details of user id "+req.body.uid)
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
  mylogger.info(`Post request on updateuserbyidunauth route` +
  "from IP address " +
  req.ip);
};


exports.updateanyuserbyid = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  // var records = [[fname,lname,email,uid]];
  // if(records[0][0]!=null)
  // {
  // console.log(req.headers);
  user.update(
    {
      role:req.body.role
    },
    {
      where: { id: req.body.uid },
    }
  )
    .then((user) => {
      if(user==0){
        activitylog.error("No such user id " + req.body.uid +" exists while updating account")
        return res.json({"msg":"No such user exists"})
      }
      // console.log(user);
      activitylog.info("user id "+req.body.uid+" role has been updated to " + req.body.role) 
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      // console.log(error)
      logger.log("error", error);
      activitylog.error("Error occured " + error.errors[0].message + " while updating user details of user id "+req.body.uid)
      return res.json({ "msg": error.errors[0].message});
      
    });
  // }
  logger.log(
    "info",
    `Post request on update user by id route http://localhost:${port}/api/updateuserbyid`+
    "from IP address "+
    req.ip
  );
  mylogger.info(`Post request on updateanyuserbyid route` +
  "from IP address " +
  req.ip);
};
//End of controllers for swagger API

exports.updateuserbyid = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  // var records = [[fname,lname,email,uid]];
  // if(records[0][0]!=null)
  // {
  // console.log(req.headers);
  user.update(
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
    .then((user) => {
      if(user==0){
        activitylog.error("No such user id " + req.profile.id +" exists while updating account")
        return res.json({"msg":"No such user exists"})
      }
      // console.log(user);
      activitylog.info("user id "+req.profile.id+" updated their acount") 
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      // console.log(error)
      activitylog.error("Error occured " + error.errors[0].message + " while updating user details of user id "+req.body.uid)
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
  mylogger.info(`Post request on updateuserbyid route` +
  "from IP address " +
  req.ip);
};

exports.findallusersbyfname = (req, res) => {
  // console.log(req.params.id)
  user.findAll({
    where: {
      firstname: req.params.fname,
    },
  })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      return res.json({ error: "Data does not exist" });
    })
    .then((user) => {
      res.json(user);
    });
  logger.log(
    "info",
    `Get request on find all users by fname route http://localhost:${port}/api/findallbyfname/:fname`+
    "from IP address "+
    req.ip
  );
  mylogger.info(`Get request on findallusersbyfname route` +
  "from IP address " +
  req.ip);
};

var bcrypt = require('bcrypt');
const saltRounds = 10;

// exports.testsignup = (req,res) => {
//   var { fname, lname, email, file,pass } = req.body;
//   bcrypt.hash(pass, saltRounds, function (err,   hash) {
//   user.create({
//     firstname: fname,
//     lastname: lname,
//     email: email,
//     password:hash
//   }).then((user) => {
//       return res.json({"msg":"user Created Successfully"})

//     }).catch((error) => {
//       // console.log(error.errors[0].message);
//       return res.json({ "msg": error.errors[0].message});
//     })
//   })
// }

exports.advancedsignup = async (req, res) => {
  var { fname, lname, email, file,pass,role } = req.body;
  const fileName = req.body.file;
  bcrypt.hash(pass, saltRounds, async (err,   hash) => {
    await user.create({
      firstname: fname,
      lastname: lname,
      email: email,
      role:role,
      password:hash
    }).then((user) => {
      activitylog.info("Admin created new user "+req.body.fname+" having role "+req.body.role) 
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
      // console.log(err)
          logger.log("error", err);
       activitylog.error("sqs service error while signup of user "+email)

        } else {
          logger.log(
            "info",
            "Data moved to Queue Successfully"+
            data.MessageId
          );
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
      logger.log("error", error);
      // console.log(error);
      activitylog.error("Error occured while noifying admin on signup user "+email)
    } else {
      // console.log("Email sent: " + info.response);
      logger.log('info',"Email sent: " + info.response)
   activitylog.error("Success while noifying admin on signup user "+email)
    }
  });

 /* mail end*/
        return res.json({"msg":"user Created Successfully"})

      }).catch((error) => {
        // console.log(error.errors[0].message);
        // console.log(error)
        activitylog.error("Error occured " + error.errors[0].message + " while admin creating user of user email "+req.body.email)
        logger.log('error',error)
        return res.json({ "error": error.errors[0].message});
      })
    })
  logger.log("info",`Post request on createuser route http://localhost:${port}/api/`);
  mylogger.info(`Post request on Signup route` +
  "from IP address " +
  req.ip);
};

exports.signup = async (req, res,next) => {
  var { fname, lname, email, file,pass } = req.body;
  const fileName = req.body.file;
  bcrypt.hash(pass, saltRounds, async (err,   hash) => {
    await user.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password:hash
    }).then((user) => {
    activitylog.info("New user signed up having name"+req.body.fname+" "+req.body.lname);  
    next();
    }).catch((error) => {
        // console.log(error.errors[0].message);
        // console.log(error)
        activitylog.error("Error occured " + error.errors[0].message + " while creating user details of user email "+req.body.email)
        logger.log('error',error)
        return res.json({ "error": error.errors[0].message});
      })
    })
  logger.log("info",`Post request on createuser route http://localhost:${port}/api/`);
  mylogger.info(`Post request on Signup route` +
  "from IP address " +
  req.ip);
};

exports.findallusers = (req, res) => {
  if(req.profile.role!==0){
    user.findAll()
    .catch((error) => {
      activitylog.error("No data exists in DB userid " + req.profile.id)
      logger.log("error", error);
      return res.json({ error: "No data exists" });
    })
    .then((users) => {
      activitylog.info("user id "+req.profile.id+" fetched all users") 
      res.json(users);
    });
  }
  logger.log(
    "info",
    `get request on finall users route http://localhost:${port}/api/findallusers`+"from IP address "+req.ip
  );
  mylogger.info(`Get request on findallusers route` +
  "from IP address " +
  req.ip);
};

// exports.getuserbyid = (req,res,next,id) => {
//   // 
// }

exports.signin = (req,res) => {
  user.findOne({
    where:{
      email:req.body.email,
    }
  })
  .catch((error) => {
    logger.log("error", error);
    activitylog.error("Error occured during signin email " + req.body.email)
    // console.log(error)
    return res.json({ "err": "Some Error occured during sigin" });
  })
  .then((user) => {
    if(user==null){
      activitylog.info("user with email "+req.body.email+" attempted to signin") 
    return res.json({ "err": "No such E-mail Exists" });
    }
    bcrypt.compare(req.body.pass,user.password,(err,data) => {
      if(data==true)
        {
          activitylog.info("user with email "+req.body.email+" attempted to signin") 
          //create token
          const token = jwt.sign({ id: user.id }, process.env.SECRET,{expiresIn:'2h'});
          //put token in cookie
          let d=new Date();
          res.cookie("token", token, { expire: d.setTime(d.getTime() + (2*60*60*1000)),httpOnly: false});
      
          //send response to front end
          const { id, firstname,lastname, email,role } = user;
          return res.json({ token, user: { id, firstname, lastname, email,role } });
        }

        else{
          // console.log(err)
          logger.log("error", err);
    activitylog.info("user with email "+req.body.email+" signed in") 
          return res.json({"err":"Password does not match"})
        }
    })
  });
  mylogger.info(`Post request on Signin route` +
  "from IP address " +
  req.ip);
}

//middleware
exports.finduserbyid = (req, res, next,id) => {
  user.findOne({
    where:{
      id:req.params.id
    }
  }).catch((err) => { 
    console.log(err); 
    logger.log("error", error);
    return res.json(err) 
    })
  .then((user) => {
    req.profile = user;
    // console.log(req)
    next();
  })
  mylogger.info(`Get Request on finduserbyid route` +
  "from IP address " +
  req.ip);
};

exports.getuser = (req, res) => {
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
  if (!checker) {
     return res.json(err) 
    //  logger.log("error", "Access Denied");
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  // console.log(req.profile)
  mylogger.info(`Request on isAuthenticated route` +
  "from IP address " +
  req.ip);
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    logger.log("error", "You are not ADMIN, Access denied");
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  mylogger.info(`Request on isAdmin route` +
  "from IP address " +
  req.ip);
  next();

};

exports.signout = (req, res) => {
  res.clearCookie("token");
  let id=req.params.id;
  // console.log(id);
  logger.log(
    "info",
    `get request on signout route http://localhost:${port}/api/signout`+"from IP address "+req.ip
  );
  activitylog.info("user id "+id+" signed out " + "from IP address " +
  req.ip) 
  mylogger.info(`Request on Signout route` +
  "from IP address " +
  req.ip);
  return res.json({
    message: "user signout successfully"
  });

};

// //protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: "auth"
})