const { user,usercard,role,userroles,card,system_logs,activity_logs } = require("../models");

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

exports.getrolebyuserid = async (req,res) => {
  await user.findOne({
    where:{
      id:req.params.id
    },
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
      console.log(error)
      activitylog.error("No data exists in DB userid " + req.profile.id)
      logger.log("error", error);
      return res.json({ error: "No data exists" });
    });
  logger.log(
    "info",
    `get request on finall users route http://localhost:${port}/api/findallusers`+"from IP address "+req.ip
  );
  mylogger.info(`Get request on findallusers route` +
  "from IP address " +
  req.ip);
}

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
      return res.json({"msg":"No such user exists"})
    }
    return res.json({"msg":"Data updated successfully"})
  })
  .catch((err)=>{
    return res.json({"msg":"Error updating user info"})
  })
}

exports.createrole = async (req,res) => {
  // var {role} = req.body;
  
      role.create({
      role:req.body.role
      })
      .then((data) => {
      return res.json({"msg":"Role created successfully"})
      })
    .catch((err) => {
    return res.json({"msg":"This role already Exists"})
  })

}

exports.deleterole = async (req,res) => {
  // var {role} = req.body;
  role.destroy({
    where: {
      role:req.body.role
    }
  })
  .then((data) => {
    return res.json({"msg":"Role deleted successfully"})
  })
  .catch((err) => {
    return res.json({"msg":"Error occured while deleting role"})
  })
}

exports.getanyuserinfobyid = async (req,res) => {
  user.findOne({
    where:{
      id:req.params.id
    }
  })
  .then((data)=>{
    if(data==null){
      return res.json({"msg":"No such user exists"})
    }
    return res.json(data)
  })
  .catch((err) => {
    return res.json({"msg":"error retrieiving user info"})
  })
}

exports.removerolefromuser = (req, res) => {
  var { uid, fname, lname, email,roles } = req.body;

  user.findOne({
    where:{
      id:req.body.uid
    }
  })
    .then((user) => {
      
      // console.log(user)
      if(user==0){
        activitylog.error("No such user id " + req.body.uid +" exists while updating account")
        return res.json({"msg":"No such user exists"})
      }
      userroles.destroy({
        where: {
      userid:req.body.uid, 
          rolename:req.body.roles
        }
      }).then((role) => {
        // console.log(role)
        return res.json({"msg":"role revoked from user"})
      }).catch((error) => {return res.json({"msg":"Error updating user role"})})
    })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      activitylog.error("Error occured " + error + " while updating user details of user id "+req.body.uid)
      return res.json({ "msg": "Error updating user role"});
      
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

exports.updateanyuserbyid = (req, res) => {
  var { uid, fname, lname, email,roles } = req.body;

  user.findOne({
    where:{
      id:req.body.uid
    }
  })
    .then((user) => {
      
      // console.log(user)
      if(user==0){
        activitylog.error("No such user id " + req.body.uid +" exists while updating account")
        return res.json({"msg":"No such user exists"})
      }
      role.findOne({
        where: {
          role:roles
        }
      }).then((role) => {
        // console.log(role)
        userroles.create({
        userid:user.id,
        rolename:role.dataValues.role
      }).then(() => {
        activitylog.info("user id "+req.body.uid+" role has been updated to " + req.body.role) 
        return res.json({ msg: "data updated successfully" });
      }).catch((error) => {return res.json({"msg":"This role is already assigned to this user"})})
      }).catch((error) => {return res.json({"msg":"No such role Exists in DB"})})
    })
    .catch((error) => {
      console.log(error)
      logger.log("error", error);
      activitylog.error("Error occured " + error + " while updating user details of user id "+req.body.uid)
      return res.json({ "msg": "Error updating user role"});
      
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

exports.getroles = (req,res) => {
  role.findAll().then((roles) => {
    if(roles!=[]){
      return res.send(roles)
    }
  }).catch((error) => {
      activity_logs.error(error);
  })
}
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
        // console.log(error.errors[0].message);
        // console.log(error)
        if(error.errors[0].message=="users.users_email_unique must be unique"){
          error.errors[0].message="E-mail id already Exists in DB"
        return res.json({ "error": error.errors[0].message});

        }
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
        }).then((data) => {
          role.findOne({
            where: {
              role:"user"
            }
          }).then((role) => {
            // console.log(role)
            userroles.create({
            userid:data.id,
            rolename:role.dataValues.role
          }).then(() => next()).catch() 
          }).catch((error) => {return res.json({"error":"Error creating user having user role"})})
          
        activitylog.info("New user signed up having name"+req.body.fname+" "+req.body.lname);  
        // next();
        }).catch((error) => {
            // console.log(error.errors[0].message);
            // console.log(error)
            if(error.errors[0].message=="users.users_email_unique must be unique"){
              error.errors[0].message="E-mail already Exists in DB"
            return res.json({ "error": error.errors[0].message});
    
            }
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

exports.findallusers = async (req, res) => {
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
      activitylog.info("Admin user id "+req.profile.id+" fetched all users") 
      res.send(users);
    })
    .catch((error) => {
      console.log(error)
      activitylog.error("No data exists in DB userid " + req.profile.id)
      logger.log("error", error);
      return res.json({ error: "No data exists" });
    });
  logger.log(
    "info",
    `get request on finall users route http://localhost:${port}/api/findallusers`+"from IP address "+req.ip
  );
  mylogger.info(`Get request on findallusers route` +
  "from IP address " +
  req.ip);
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
      console.log(error)
      activitylog.error("No data exists in DB userid " + req.profile.id)
      logger.log("error", error);
      return res.json({ error: "No data exists" });
    });
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
      // console.log(usersroles)

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
            // console.log(err)
            logger.log("error", err);
      activitylog.info("user with email "+req.body.email+" signed in") 
            return res.json({"err":"Password does not match"})
          }
      })

    }).catch((error) => {return res.json({"err":"Some error occured during signin"})})
    
  })
  .catch((error) => {
    logger.log("error", error);
    activitylog.error("Error occured during signin email " + req.body.email)
    // console.log(error)
    return res.json({ "err": "Some Error occured during sigin" });
  });
  mylogger.info(`Post request on Signin route` +
  "from IP address " +
  req.ip);
}

//middleware
exports.finduserbyid = (req, res, next,id) => {
  var usersroles=[];

  user.findOne({
    where:{
      id:req.params.id
    }
  }).catch((err) => { 
    console.log(err); 
    logger.log("error", error);
    return res.json(err) 
    })
  .then(async (user) => {
    // console.log(user)
    await userroles.findAll({
      attributes: ['rolename'],
      where:{
        userid:user.dataValues.id
      }
    }).then((data) => {
      data.forEach(d => {
        usersroles.push(d.dataValues.rolename)
      });
    }).catch((error) => {return res.json({"err":"Some error occured during signin"})})
    req.profile = user;
    req.profile.dataValues.rolename=usersroles;

    // console.log(req.profile.dataValues)
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

exports.isAdmin = async (req, res, next) => {
  var usersroles;
  usersroles=req.profile.dataValues.rolename
  console.log(usersroles)

  if((usersroles).includes('admin')){
    mylogger.info(`Request on isAdmin route` +
    "from IP address " +
    req.ip);
    next();
  }
  else if(!(usersroles).includes('admin')){
    logger.log("error", "You are not ADMIN, Access denied");
    return res.json({
      "msg": "You are not ADMIN, Access denied"
    });
  }
};

exports.isHr = async (req, res, next) => {
  var usersroles;
  usersroles=req.profile.dataValues.rolename
  console.log(usersroles)

  if((usersroles).includes('hr')){
    mylogger.info(`Request on isHr route` +
    "from IP address " +
    req.ip);
    next();
  }
  else if(!(usersroles).includes('hr')){
    logger.log("error", "You are not Hr, Access denied");
    return res.json({
      "msg": "You are not Hr, Access denied"
    });
  }
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
      return res.json({'msg':'Error retrieving activity logs'}).status(200)
      }
      return res.json(result).status(200)
    })
}