const mongoose = require("mongoose")

require("dotenv").config({path: 'variables.env'})


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log("DB Connection success")
    } catch(error){
        console.log(error)
        process.exit(1) // detener la app en caso de que haya un error
    }
}

module.exports = connectDB