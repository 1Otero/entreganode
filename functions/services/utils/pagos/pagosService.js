const { request, response}= require("express")
const { retornarTokenYUrlAcceptacion, testPagoR, tokenizarTarjetaR, sendMePagoR, getTransationR }= require("./../../../repositorys/utils/pagos/pagosRepository")
const { modifyAmountR, getProductR }= require("./../../../repositorys/product/productRepository")
const nada= require("./../../../utils/utils")
const uuid= require("uuid")
const cryptoJs= require("crypto-js")

async function refff(infoCarritoBody, listUpdate){
    let productVerify= Object.create({})
    for(p of infoCarritoBody){
        //const p= prd.product
        const productId= p?._id==null?0:p?._id
        const product = await getProductR(productId)
        const cantidadProduct= product?.cantidad==null?0:product?.cantidad
        const cantidadRequiere= p?.cantidad==null?0:p?.cantidad
        if(product && cantidadProduct < 1 | cantidadRequiere > cantidadProduct ){
            listUpdate.listErrorUpdate.push({product, message: `La cantidad requerida es: ${cantidadRequiere} y cuenta con: ${cantidadProduct}`})
            listUpdate.status= 2;
            productVerify= {}
            continue
            //return res.json({success: `La cantidad requerida es: ${cantidadRequiere} y cuenta con: ${cantidadProduct}`, status: 201})
        }
        productVerify[productId]= product
    }
    return productVerify  
}
module.exports= {
    sendPagoS: (req= request, res= response) => {
       let {name}= req.body 
       const sendedPago= testPagoR("relol")
       return res.json({success: "pago realizado"})
    },
    retornarTokenAceptacion: async (req=request, res=response) => {
       const body= await retornarTokenYUrlAcceptacion("relol&refff")
       if(body.data){
           let { accepted_payment_methods, presigned_acceptance }= body.data
           const acceptanceToken= presigned_acceptance.acceptance_token
           const permaLink= presigned_acceptance.permalink
           return res.json({success: {acceptanceToken, permaLink, accepted_payment_methods }, status: 200})
       }
       return res.json({success: "fallo aceptacion con token cliente", status: 404})
    },
    tokenizarTarjetaS: async (req=request, res=response) => {
        //const { number, cvc, exp_month, exp_year, card_holder }= req.body
        const { number, cvc, expiry, name }= req.body
        let exp_month= "00";
        let exp_year= "00";
        if(expiry.length == 6){
         exp_month= expiry.substring(0, 2)
         exp_year= expiry.substring(4, 6)
        }else{
         exp_month= expiry.substring(0, 2)
         exp_year= expiry.substring(2, 4)
        }
        const body= await tokenizarTarjetaR({
          number,
          cvc,
          exp_month,
          exp_year,
          card_holder: name
        })
        if(body){
            if(body.status == 'CREATED' && body.data){
                const bodyInfo= body.data
                const {id, card_holder}= body.data
                return res.json({success: {id, card_holder}, status: 200})
            }
            return res.json({success: "algo salio mal tokenizando, verifique la tarjeta", status: 203})
        }
        return res.json({success: "no se logro tokenizar correctamente", status: 404})
    },
    sendMePagoS: async (req=request, res=response) => {
      let { acceptance_token, customer_email, reference, amount_in_cents, currency, signature, payment_method,
      customer_data, infoCarrito }= req.body
      const listUpdate= {listErrorUpdate: [], updatedProducer: [], status: 0}
      //if(!infoCarrito && !infoCarrito.listProduct){
      if(!infoCarrito){
        return res.json({success: "debe enviar informacion de la compra", status: 202})
      }
      let infoCarritoBody = infoCarrito.listProduct
      const productVerify= await refff(infoCarritoBody, listUpdate)
      //const listUpdate= {listErrorUpdate: [{product: null, message: ""}], updatedProducer: [], status: 0}  
      
      if(Object.keys(productVerify).length != infoCarritoBody.length){
        return res.json({success: "la cantidad de productos no es suficiente, existen productos con cantidades insuficientes ", listUpdate, status: 403})
      }
      
      reference= uuid.v4()
      signature= reference + amount_in_cents + currency + nada.NADAINTEGRY.slice(0, -1)
      signature= cryptoJs.SHA256(signature).toString()
      const bodyInfo= await sendMePagoR({
      acceptance_token,
      customer_email,
      reference,
      amount_in_cents,
      currency,
      signature,
      payment_method,
      customer_data })
      if(!bodyInfo) return res.json({success: "fallo realiar el pago", status: 201})
      const body= await bodyInfo.json()
      if(body.data){
        //Una vez que se realice el pago se debe enviar un correo con la informacion del pago, pero se debe validar si enviar aqui o despues con otro metodo
        infoCarritoBody.forEach(async p => {
            const productId= p._id==null?0:p._id
            //const product = await getProductR(productId)
            const product= productVerify[productId]

            product.cantidad= product.cantidad - p.cantidad
            const updated= await modifyAmountR(product)
            if(updated){
               listUpdate.status= 1;
               listUpdate.updatedProducer.push(product)
               return
            }
            listUpdate.status= 2;
            listUpdate.listErrorUpdate.push(product)
            return
        })   

        //Aqui se deb enviar el correo, solo despues de que se modificaron los productos

        //Esta ignorando {"meta": {}}
        return res.json({success: body.data, updatedProduct: listUpdate, status: 200})
      }
      return res.json({success: "fallo realiar el pago", status: 201})
    },
    getTransationS: async (req=request, res=response) => {
      const { id }= req.params
      const transation= await getTransationR(id)
      if(transation){
        return res.json({success: transation, status: 200})
      }
      return res.json({success: null, status: 404})
    }
}