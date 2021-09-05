const { user,role,userroles,activity_logs } = require("../models");
const activitylog=require("../config/logger3")
require("dotenv").config("./.env");

//Create New Role
exports.createrole = async (req,res) => {
    role.create({
     role:req.body.role
     })
     .then((data) => {
   activitylog.info("Role created successfully "+req.body.role) 
     return res.json({"msg":"Role created successfully"})
     })
   .catch((err) => {
   activitylog.error("Role "+req.body.role+" already exists") 
   return res.json({"msg":"This role already Exists"})
 })

}

//Delete existing role
exports.deleterole = async (req,res) => {
 // var {role} = req.body;
 role.destroy({
   where: {
     role:req.body.role
   }
 })
 .then((data) => {
   activitylog.info("Role deleted successfully "+req.body.role) 
   return res.json({"msg":"Role deleted successfully"})
 })
 .catch((err) => {
   activitylog.error("Role deletion failed "+req.body.role) 
   return res.json({"msg":"Error occured while deleting role"})
 })
}

//Remove role from user
exports.removerolefromuser = (req, res) => {
 var { uid, fname, lname, email,roles } = req.body;

 user.findOne({
   where:{
     id:req.body.uid
   }
 })
   .then((user) => {
     if(user==0){
       activitylog.error("No such user exists having id "+req.body.uid+" while revokerolefromuser")
       return res.json({"msg":"No such user exists"})
     }
     userroles.destroy({
       where: {
         userid:req.body.uid, 
         rolename:req.body.roles
       }
     }).then((role) => {
       return res.json({"msg":"role revoked from user"})
     }).catch((error) => {return res.json({"msg":"Error updating user role"})})
   })
   .catch((error) => {
     activitylog.error("Error occured " + error + " while revoking role from user id "+req.body.uid)
     return res.json({ "msg": "Error updating user role"});
   });
};

//Assign role to user
exports.updateanyuserbyid = (req, res) => {
 var { uid, fname, lname, email,roles } = req.body;

 user.findOne({
   where:{
     id:req.body.uid
   }
 })
   .then((user) => {
     if(user==0){
       activitylog.error("No such user id " + req.body.uid +" exists while updating account")
       return res.json({"msg":"No such user exists"})
     }
     role.findOne({
       where: {
         role:roles
       }
     }).then((role) => {
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
     activitylog.error("Error occured " + error + " while updating user details of user id "+req.body.uid)
     return res.json({ "msg": "Error updating user role"});
   });
};

//Get all roles
exports.getroles = (req,res) => {
 role.findAll().then((roles) => {
   if(roles!=[]){
     activitylog.info("Roles were fetched") 
     return res.send(roles)
   }
   return res.json({"msg":"No roles exists in DB"})
 }).catch((error) => {
     return res.json({"msg":"Error occured while fetching roles"})
     activity_logs.error(error);
 })
}

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
        activitylog.error("No data exists in DB userid " + req.profile.id)
        return res.json({ error: "No data exists" });
      });
  }