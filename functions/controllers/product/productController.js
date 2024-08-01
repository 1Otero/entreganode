const { modifyProduct, editAmountByPurchaseS, createProductS, getAllProductsS, getProductS }= require("./../../services/product/productService")
const { Router }= require("express")

const app= Router()
app.get("/allproducts", getAllProductsS)
app.get("/getproduct/:id", getProductS)
app.post("/createproduct", createProductS)
app.put("/editproduct", modifyProduct)
app.put("/editproductsbycartmodifyamount", editAmountByPurchaseS)
// app.post()

module.exports= app