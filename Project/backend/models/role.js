
module.exports =(sequelize,DataTypes) => {
    const role = sequelize.define('role',{
        role:{
            type:DataTypes.STRING,
            primaryKey: true,
            allowNull:false,
        }
    },{timestamps:false})

    return role;
}