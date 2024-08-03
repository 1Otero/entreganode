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
        console.log(productId)
        console.log(product)
        console.log(cantidadProduct)
        console.log(cantidadRequiere)
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
        const exp_month= expiry.substring(0, 2)
        const exp_year= expiry.substring(2, 4)
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
      
 ////dsdsdsddsds

    //   let productVerify= {}
    //   infoCarritoBody.forEach(async p => {
    //     const productId= p?._id??0
    //     console.log(productId)
    //     console.log(p)
    //     const product = await getProductR(productId)
    //     const cantidadProduct= product?.cantidad??0
    //     const cantidadRequiere= p?.cantidad??0
    //     console.log("********************")
    //     console.log(cantidadRequiere)
    //     console.log(cantidadProduct)
    //     console.log("********************")
    //     if(product && cantidadProduct < 1 | cantidadRequiere > cantidadProduct ){
    //         listUpdate.listErrorUpdate.push({product, message: `La cantidad requerida es: ${cantidadRequiere} y cuenta con: ${cantidadProduct}`})
    //         listUpdate.status= 2;
    //         console.log("error cantidad o algo :::::")
    //         return
    //         //return res.json({success: `La cantidad requerida es: ${cantidadRequiere} y cuenta con: ${cantidadProduct}`, status: 201})
    //     }
    //     productVerify[productId]= product
    //     console.log(product)
    //     console.log(productVerify)
    //   })

   ///dsds

    //   console.log("length: ")
    //   console.log(productVerify.length)
    //   if(listUpdate.listErrorUpdate > 0 || listUpdate.status == 2 && productVerify.length < 1){
    //      return res.json({success: "la cantidad de productos no es suficiente para satisfacer la compra", status: 201})
    //   }
    console.log("productVerify: ------------------------------------------- ")
      console.log(productVerify)
      if(Object.keys(productVerify).length != infoCarritoBody.length){
        return res.json({success: "la cantidad de productos no es suficiente, existen productos con cantidades insuficientes ", listUpdate, status: 403})
      }
      //Recordar que installments -> es el numero de cuotas para hacer un pago con tarjeta  
      //     const bodyInfo= await sendMePagoR({   
      //     "acceptance_token": "eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjQzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MjIzNzkxMzYtMTA0OTYiLCJlbWFpbCI6IiIsImV4cCI6MTcyMjM4MjczNn0.xrIHmwQxKrpoJZ1aijNZ1i_-s1IjrJnqAuCsU4FUF2c",
      //     "customer_email": "trujilloivanzx@gmail.com",
      //     "reference": "bbbl0112",
      //     "amount_in_cents": 150000,
      //     "currency": "COP",
      //     "signature": "d746356a88534f0607e91fec7665985e71c2155d372550759bc5fe9fd13ccce3",
      //     "payment_method": {
      //     "type": "CARD",
      //     "installments": 2, // Número de cuotas
      //     "token": "tok_stagtest_5113_3528111A156556c4fa1A178Ee15f4baC" // Token de la tarjeta de crédito
      //     },
      //     "customer_data": {
      //         "legal_id": "20121221",
      //         "phone_number": "+573145678901",
      //         "full_name": "Ivan Otero (Van)",
      //         "legal_id_type": "CC"
      //     }   
      //   })
      reference= uuid.v4()
      signature= reference + amount_in_cents + currency + nada.NADAINTEGRY
      signature= cryptoJs.SHA256(signature).toString()
      console.log(customer_email)
      console.log(customer_data)
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
      console.log(body)
      if(body.data){
        //Una vez que se realice el pago se debe enviar un correo con la informacion del pago, pero se debe validar si enviar aqui o despues con otro metodo
        infoCarritoBody.forEach(async p => {
            const productId= p._id==null?0:p._id
            //const product = await getProductR(productId)
            const product= productVerify[productId]
            console.log(p)
            console.log(product)
            console.log(productVerify)

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

        // infoCarritoBody.forEach(async p => {
        //     const productId= p._idProduct?p._idProduct:0
        //     const product = await getProductR(productId)
        //     const cantidadProduct= product.cantidad?product.cantidad:0
        //     const cantidadRequiere= p.cantidad?p.cantidad:0
        //     if(product && cantidadProduct < 1 | cantidadRequiere > cantidadProduct ){
        //         listUpdate.listErrorUpdate.push({product, message: `La cantidad requerida es: ${cantidadRequiere} y cuenta con: ${cantidadProduct}`})
        //         listUpdate.status= 2;
        //         return
        //     }
        //     product.cantidad= product.cantidad - p.cantidad
        //     const updated= await modifyAmountR(product)
        //     if(updated){
        //      console.log(updated)
        //      listUpdate.status= 1;
        //      listUpdate.updatedProducer.push(product)
        //      return
        //     }
        //     listUpdate.status= 2;
        //     listUpdate.listErrorUpdate.push(product)
        //     return
        // })   
        
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