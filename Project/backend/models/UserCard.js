module.exports =(sequelize,DataTypes) => {
    const usercard = sequelize.define('usercard',{
        cardid:DataTypes.INTEGER,
        userid:DataTypes.INTEGER,
    },{timestamps:false})
    return usercard;
}