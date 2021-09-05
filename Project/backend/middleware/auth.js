const { user,userroles } = require("../models");

const activitylog=require("../config/logger3")
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config("./.env");
var expressJwt = require("express-jwt");

//middleware
exports.finduserbyid = (req, res, next,id) => {
    var usersroles=[];
  
    user.findOne({
      where:{
        id:req.params.id
      }
    }).catch((err) => { 
      return res.json(err) 
      })
    .then(async (user) => {
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
      next();
    })
  };

  //custom middlewares
exports.isAuthenticated = (err,req, res, next) => {
    if(err.name === 'UnauthorizedError') {
      return res.status(err.status).json({message:err.message});;
    }
    let checker = req.profile && req.auth && req.profile.id == req.auth.id;
    if (!checker) {
       return res.json(err) 
      return res.status(403).json({
        error: "ACCESS DENIED"
      });
    }
    next();
  };
  
  exports.isAdmin = async (req, res, next) => {
    var usersroles;
    usersroles=req.profile.dataValues.rolename
    if((usersroles).includes('admin')){
      next();
    }
    else if(!(usersroles).includes('admin')){
      return res.json({
        "msg": "You are not ADMIN, Access denied"
      });
    }
  };
  
  exports.isHr = async (req, res, next) => {
    var usersroles;
    usersroles=req.profile.dataValues.rolename
    if((usersroles).includes('hr')){
      next();
    }
    else if(!(usersroles).includes('hr')){
      return res.json({
        "msg": "You are not Hr, Access denied"
      });
    }
  };

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
  })