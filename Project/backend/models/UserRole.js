module.exports =(sequelize,DataTypes) => {
    const userroles = sequelize.define('userroles',{
        userid:DataTypes.INTEGER,
        rolename:DataTypes.INTEGER,
    },{timestamps:false})
    return userroles;
}