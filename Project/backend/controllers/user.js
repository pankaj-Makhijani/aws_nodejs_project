const { user,usercard,role,userroles,card,system_logs,activity_logs } = require("../models");

// const logger = require("../config/logger");
// const mylogger=require("../config/logger2")
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

var mysql = require('mysql2');
 
// create a connection variable with the required details
var con = mysql.createConnection({
  host: process.env.DB_HOST, // ip address of server running mysql
  user: process.env.DB_USER, // user name to your mysql database
  password: process.env.DB_PASSWORD, // corresponding password
  database: process.env.DB_NAME // use the specified database
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
    .then((user) => {
      activitylog.info("user id "+user.id+" made request on getcardbyid route") 
      return res.json(user);
    })
    .catch((error) => {
      activitylog.error("Error occured during getcardbyid on user id "+req.params.id)
      return res.json({"msg":"Some error occured"})
    })
 }

exports.defaultroute = (req, res) => {
  res.json("OK");
};

//Start controllers for swagger API
exports.getuserbyid = (req, res) => {
  user.findOne({
    where: {
      id: req.params.id,
    },
  })
  .then((user) => {
    activitylog.info("user id "+user.id+" made request on getuserbyid route") 
    res.json(user);
  })
    .catch((error) => {
      activitylog.error("Error occured during getuserbyid on user id "+req.params.id)
      return res.json({ error: "Data does not exist" });
    })
};

exports.deleteuserbyidunauth = (req, res) => {
  user.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((user) => {
    activitylog.info("user id "+req.params.id+" deleted their acount") 
    res.json({ msg: "data deleted successfully" });
  })
    .catch((error) => {
      activitylog.error("Error occured during deleting account on user id "+req.params.id)
      return res.json({ error: "delete action unsuccessful" });
    })
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
      activitylog.error("Error occured during deleting account on user id "+req.body.id)
      return res.json({ err: "delete action unsuccessful" }).status(404);
    })
};

exports.updateuserbyidunauth = (req, res) => {
  user.update(
    {
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
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
      activitylog.info("user id "+req.body.uid+" updated their account details") 
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      activitylog.error("Error occured " + error.errors[0].message + " while updating user details of user id "+req.body.uid)
      return res.json({ "error": error.errors[0].message});
    });
};



exports.updateanyuser = async (req,res) => {
  var { uid, fname, lname, email } = req.body;
 
  user.update(
    {
      firstname: fname,
      lastname: lname,
      email: email,
    },
    {
      where: { id:uid },
    }
  ).then((data) => {
    if(data==0){
      activitylog.info("No such user exists on updateanyuser having id "+uid) 
      return res.json({"msg":"No such user exists"})
    }
    activitylog.info("Data updated successfully on updateanyuser having id "+uid) 
    return res.json({"msg":"Data updated successfully"})
  })
  .catch((err)=>{
    activitylog.info("Error occured while updating user info on updateanyuser") 
    return res.json({"msg":"Error updating user info"})
  })
}


//End of controllers for swagger API

exports.getanyuserinfobyid = async (req,res) => {
  user.findOne({
    where:{
      id:req.params.id
    }
  })
  .then((data)=>{
    if(data==null){
      activitylog.info("No such user exists on get anyserinfobyid having userid "+req.params.id) 
      return res.json({"msg":"No such user exists"})
    }
    activitylog.info("data fetched on getanyuserinfobyid having user id "+req.params.id) 
    return res.json(data)
  })
  .catch((err) => {
    activitylog.error("error retrieiving user info") 
    return res.json({"msg":"error retrieiving user info"})
  })
}

exports.updateuserbyid = (req, res) => {
  var { uid, fname, lname, email } = req.body;
  user.update(
    {
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
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
      activitylog.info("user id "+req.profile.id+" updated their acount") 
      return res.json({ msg: "data updated successfully" });
    })
    .catch((error) => {
      activitylog.error("Error occured " + error.errors[0].message + " while updating user details of user id "+req.body.uid)
      return res.json({ "msg": error.errors[0].message});
    });
};


var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.advancedsignup = async (req, res,next) => {
  var { fname, lname, email, file,pass,roles } = req.body;
  const fileName = req.body.file;
  console.log(roles)
  bcrypt.hash(pass, saltRounds, async (err,   hash) => {
    await user.create({
      firstname: fname,
      lastname: lname,
      email: email,
      // role:role,
      password:hash
    }).then((user) => {
      role.findOne({
        where: {
          role:roles
        }
      }).then((role) => {
        // console.log(role)
        userroles.create({
        userid:user.id,
        rolename:role.dataValues.role
      }).then(() => next()).catch() 
      }).catch((error) => {return res.json({"error":"Error creating user having user role"})})
      activitylog.info("Admin created new user "+req.body.fname+" having role "+req.body.role) 
      // next();
      }).catch((error) => {
        if(error.errors[0].message=="users.users_email_unique must be unique"){
          error.errors[0].message="E-mail id already Exists in DB"
        return res.json({ "error": error.errors[0].message});
        }
        activitylog.error("Error occured " + error.errors[0].message + " while admin creating user of user email "+req.body.email)
        logger.log('error',error)
        return res.json({ "error": error.errors[0].message});
      })
    })
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
        }).then((data) => {
          role.findOne({
            where: {
              role:"user"
            }
          }).then((role) => {
            userroles.create({
            userid:data.id,
            rolename:role.dataValues.role
          }).then(() => next()).catch() 
          }).catch((error) => {return res.json({"error":"Error creating user having user role"})})
          
        activitylog.info("New user signed up having name"+req.body.fname+" "+req.body.lname);  
        // next();
        }).catch((error) => {
            if(error.errors[0].message=="users.users_email_unique must be unique"){
              error.errors[0].message="E-mail already Exists in DB"
            return res.json({ "error": error.errors[0].message});
    
            }
            activitylog.error("Error occured " + error.errors[0].message + " while creating user details of user email "+req.body.email)
            return res.json({ "error": error.errors[0].message});
          })
        })
};

exports.findallusers = async (req, res) => {
  await user.findAll({
		include:[
			{
				model:role,
        as:'roles',
				attributes:["role"],
        through:{
					attributes:[],
				}
			}
		]
	})
    .then((users) => {
      activitylog.info("Admin user id "+req.profile.id+" fetched all users") 
      res.send(users);
    })
    .catch((error) => {
      activitylog.error("No data exists in DB userid " + req.profile.id)
      return res.json({ error: "No data exists" });
    });
};

exports.findallusersbyhr = async (req, res) => {
  // var {userroles}=require('../models/UserRole') 
  await user.findAll({
		include:[
			{
				model:role,
        as:'roles',
				attributes:["role"],
        through:{
					attributes:[],
				}
			}
		]
	})
    .then((users) => {
      activitylog.info("Hr having user id "+req.profile.id+" fetched all users") 
      res.send(users);
    })
    .catch((error) => {
      activitylog.error("No data exists in DB userid " + req.profile.id)
      return res.json({ error: "No data exists" });
    });
};

exports.signin = (req,res) => {
  var usersroles=[];
  user.findOne({
    where:{
      email:req.body.email,
    }
  })
  .then((user) => {
    // console.log(user)
    if(user==null){
      activitylog.info("user with email "+req.body.email+" attempted to signin") 
    return res.json({ "err": "No such E-mail Exists" });
    }
    userroles.findAll({
      attributes: ['rolename'],
      where:{
        userid:user.dataValues.id
      }
    }).then((data) => {
      data.forEach(d => {
        usersroles.push(d.dataValues.rolename)
      });
      user.rolename=usersroles;
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
            const { id, firstname,lastname, email,role,rolename } = user;
            return res.json({ token, user: { id, firstname, lastname, email,role,rolename } });
          }
  
          else{
      activitylog.info("user with email "+req.body.email+" signed in") 
            return res.json({"err":"Password does not match"})
          }
      })
    }).catch((error) => {return res.json({"err":"Some error occured during signin"})})
  })
  .catch((error) => {
    activitylog.error("Error occured during signin email " + req.body.email)
    return res.json({ "err": "Some Error occured during sigin" });
  });
}



exports.getuser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};



exports.signout = (req, res) => {
  res.clearCookie("token");
  let id=req.params.id;
  activitylog.info("user id "+id+" signed out " + "from IP address " +
  req.ip) 

  return res.json({
    message: "user signout successfully"
  });

};


exports.getsystemlogs = (req,res) => {
  con.query("SELECT * from system_logs",function(error,result,fields)
		{	
      if(error){
      return res.json({'msg':'Error retrieving system logs'}).status(200)
      }
      return res.json(result).status(200)
    })
}

exports.getactivitylogs = (req,res) => {
  con.query("SELECT * from activity_logs",function(error,result,fields)
		{	
      if(error){
      activitylog.info("Error retrieving activity logs") 
      return res.json({'msg':'Error retrieving activity logs'}).status(200)
      }
      activitylog.info("activity logs were fetched") 
      return res.json(result).status(200)
    })
}