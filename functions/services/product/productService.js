const {request, response}= require("express")
const { createProductR, getAllProductsR, getProductR, modifyAmountR, modifyProductR }= require("./../../repositorys/product/productRepository")
module.exports= {
    getAllProductsS: async (req=request, res=response) => {
      const allProducts= await getAllProductsR() 
      if(allProducts){
        return res.json({success: allProducts, status: 200})  
      }
      return res.json({success: null, status: 404})
    },
    getProductS: async (req=request, res=response) => {
      let idProduct= req.params['id']??0
      const product= await getProductR(idProduct)
      if(product){
        return res.json({success: product, status: 200})  
      }
      return res.json({success: null, status: 404})
    },
    createProductS: async (req=request, res=response) => {
        let { name, description, cantidad, precio }= req.body
        cantidad=cantidad??0
        precio= precio??0
        const createdProduct= await createProductR({name, description, cantidad, precio})
        if(createdProduct){
          return res.json({success: createdProduct, status: 200})
        }
        return res.json({success: "error create product", status: 202}) 
    },
    modifyProduct: async (req=request, res=response) => {
        const { _id, name, description, cantidad, precio }= req.body
        //const { _id, cantidad}= req.body
        const product= await getProductR(_id)
        if(!product && product.cantidad<0){
            return res.json({success: "product not found", status: 404})
        }
        product.name= name??product.name
        product.description= description??product.description
        product.cantidad= cantidad??product.cantidad
        product.precio= precio??product.precio 
        const productUpdated= await modifyProductR(product)
        if(productUpdated){
            return res.json({success: productUpdated, status: 200})
        }
        return res.json({success: null, status: 404})
    },
    editAmountByPurchaseS: async (req=request, res=response) => {
        // const { name, description, cantidad, precio }= req.body
        const { _id, cantidad}= req.body
        const product= await getProductR(_id)
        if(!product){
            return res.json({success: "product not found", status: 404})
        }
        const cantidadRef= product.cantidad!=null?product.cantidad:0
        if(!cantidad || cantidad < 0){
            return res.json({success: "la cantidad debe ser 0 o superior", status: 201})
        }
        if(cantidad > cantidadRef){
            return res.json({success: `La cantidad requerida es: ${cantidad} y cuenta con: ${cantidadRef}`, status: 203})
        }
        product.cantidad= product.cantidad-cantidad 
        const productUpdated= await modifyAmountR(product)
        if(productUpdated){
            return res.json({success: productUpdated, status: 200})
        }
        return res.json({success: null, status: 404})  
    }
}