module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: {
          args:true,
          msg:"firstname should not be empty"
        },
        notIn: {
          args:[["root", "admin"]],
          msg:"firstname should not be root/admin"
        },
        len: {
          args: [4, 16],
          msg: "length should be between 4 to 16", //custom messages
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: {
          args:true,
          msg:"lastname should not be empty"
        },
        notIn: {
          args:[["root", "admin"]],
          msg:"lastname should not be root/admin"
        },
        len: {
          args: [4, 16],
          msg: "length should be between 4 to 16", //custom messages
        },
      },
    },
    password:{
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: {
          args:true,
          msg:"password should not be empty"
        },
        len: {
          args: [4, 16],
          msg: "length should be between 4 to 16", //custom messages
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: {
        args:true,
        msg:"E-mail is required"
          }
        },
      unique:{
        args:true,
        msg:"E-mail already Exists"
      }
    },
    role:{
      type:DataTypes.INTEGER,
      defaultValue:0
    }
  });

  User.associate = models => {
      User.hasMany(models.card,{
          onDelete:'cascade'
      })
  }

  return User;
};
