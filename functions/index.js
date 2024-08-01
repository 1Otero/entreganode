const express = require("express")
const app= express()
const product= require("./controllers/product/productController")
const pagos= require("./controllers/utils/pagos/pagostController")

const { PORT }= require("./utils/utils")
app.set("port", PORT || 8080)

if(require("./utils/conn/conn")()){
    console.log("connection mongoose")
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/product", product)
app.use("/pago", pagos)

app.listen(app.get("port"), () => {
    console.log(`Listen in ${PORT}`)
})