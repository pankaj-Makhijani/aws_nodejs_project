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
        notEmpty: true,
        notIn: [["root", "admin"]],
        len: [2, 16],
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: true,
        notIn: [["root", "admin"]],
        len: {
          args: [2, 16],
          msg: "length should be between 2 to 16", //custom messages
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        notEmpty: true,
        // is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i,
        // is: ["/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/",'i'],
        // isEmail: true,
      },
    },
  });

  User.associate = models => {
      User.hasMany(models.card,{
          onDelete:'cascade'
      })
  }

  return User;
};
