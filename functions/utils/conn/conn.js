const mongoose= require("mongoose")
const nada= require("./../../utils/utils")
module.exports= async function () {
  const meCnn= await mongoose.connect(nada.NADAURLMONGOOSE)
  const cnn= await meCnn.connection
  cnn.on("error", (err) => {
      console.log("err connection mongoose")
      console.log(err)
      return false;
  })
  console.log("sucessfully connection")
  return true;
 }
