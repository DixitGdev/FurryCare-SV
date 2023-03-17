adminSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
   
})

const adminModel=mongoose.model("admin_master",adminSchema)
module.exports=adminModel