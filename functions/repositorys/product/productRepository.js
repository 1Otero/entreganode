const { default: mongoose } = require("mongoose");
const Product= require("./../../model/Product")
const productI= require("./../../model/productI")
module.exports= class productRepository {
    static async getAllProductsR(){
       const allProducts= await Product.find()
       .catch(err => {
        console.log("err get all Products")
        console.log(err)
        return [];
       });
       return allProducts;
    }
    static async getProductR(idProduct= mongoose.Types.ObjectId){
       const product= await Product.findById({_id: idProduct})
       .catch(err => {
        console.log("err get Product")
        console.log(err)
        return null;
       })
       return product
    }
    static async createProductR(product=Product){
      const newProduct= new Product(product)
      const meproduct=  await newProduct.save()
      .catch(err => {
        console.log("err create Product")
        console.log(err)
        return null;
      })
      return meproduct;
    }
    static async modifyProductR(product=productI){
        const updatedProductAmount= await Product.updateOne({_id: product._id}, product)
        .catch(err => {
          return null
        })
        return updatedProductAmount;
      }
    static async modifyAmountR(product=productI){
      const updatedProductAmount= await Product.updateOne({_id: product._id}, {cantidad: product.cantidad})
      .catch(err => {
        return null
      })
      return updatedProductAmount;
    }
}