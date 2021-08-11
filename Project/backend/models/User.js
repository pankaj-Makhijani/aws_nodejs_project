var bcrypt = require('bcrypt');
const saltRounds = 10;

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
          msg: "First Name length should be between 4 to 16", //custom messages
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
          msg: "Last Name Length should be between 4 to 16", //custom messages
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
        // len: {
        //   args: [4, 25],
        //   msg: "length should be between 4 to 16", //custom messages
        // },
      },
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
      
      unique:{
        args:true,
        msg:"E-mail already Exists"
      },
      validate: {
        notEmpty: {
        args:true,
        msg:"E-mail is required"
          }
        }
    },
    role:{
      type:DataTypes.INTEGER,
      defaultValue:0
    }
  });

  User.associate = models => {
      User.belongsToMany(models.card, { through: 'UserCard' });
  }

  //Generating a Hash
  User.generatehash = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null)
  }

  //Checking if password is valid or not
  User.prototype.validpassword = (password) =>{
    return bcrypt.compareSync(password,this.local.password)
  }

  return User;
};
