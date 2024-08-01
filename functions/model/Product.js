const { Schema, model, default: mongoose }= require("mongoose")
const product= new Schema({
    name: {type: String},
    description: {type: String},
    cantidad: {type: Number},
    precio: {type: Number}
})

module.exports= model("ProductStore", product)