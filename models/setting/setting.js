settingSchema=new mongoose.Schema({
    key:{
        type:String
    },
    value:{
        type:String
    }
})
const SettingModel=mongoose.model("setting",settingSchema)
module.exports=SettingModel