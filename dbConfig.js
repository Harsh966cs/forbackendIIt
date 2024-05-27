const mongoose = require('mongoose')
require('dotenv').config()


const conection =  async()=>{

    try {
        await mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("Mongoose connected sucffully ")
        })
    } catch (error) {
        console.error(error);
    }
}

module.exports = conection;