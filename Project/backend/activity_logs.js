module.exports =(sequelize,DataTypes) => {
    const activity_logs = sequelize.define('activity_logs',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        message:{
            type:DataTypes.TEXT,
        },
        level: {
            type:DataTypes.NUMBER,
        },
        date: {
            type:DataTypes.DATE,
        }
    },
    {
        timestamps: false
})
    return activity_logs;
}