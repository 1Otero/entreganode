const nada= require("./../../../utils/utils")
// module.exports= {
//  sendPagoR: () => {

//  }    
// }
module.exports= class pagosRepository {
    static async retornarTokenYUrlAcceptacion(name=String){
      const meInstutions= await fetch(`https://api-sandbox.co.uat.wompi.dev/v1/merchants/${nada.NADA.split(0, -1)}`)
      .catch(err => {
        console.log("error fetch get financial institutions")
        return null
      })
      if(!meInstutions){
        return null
      }
      const body= await meInstutions.json()
      return body;
    }
    static testPagoR(name=String){
      console.log("relol")
      console.log(name)
      return name;
    }
    static async tokenizarTarjetaR(infoTargeta){
      const tarjetaBody= await fetch("https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards", {
        method: 'POST',
        body: JSON.stringify(infoTargeta),
        headers: {
          "Authorization": `Bearer ${nada.NADA.slice(0, -1)}`,
          "Content-Type": "application/json"
        }
      })
      .catch(err => {
        console.log("error tokenizando tarjeta")
        console.log(err)
        return null
      })
      if(!tarjetaBody){
        return null 
      }
      const body= await tarjetaBody.json()
      return body;
    }
    static async sendMePagoR(infoPago){
      const body= await fetch("https://api-sandbox.co.uat.wompi.dev/v1/transactions", {
        method: 'POST',
        body: JSON.stringify(infoPago),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${nada.NADA.slice(0, -1)}`
        }
      })
      .catch(err => {
        console.log("error tokenizando tarjeta")
        console.log(err)
        return null
      }) 
      return body
    }
    static async getTransationR(id){
      console.log(id)
      const transation= await fetch(`https://api-sandbox.co.uat.wompi.dev/v1/transactions/${id}`)
      .catch(err => {
        console.log("error get transation: ")
        console.log(err)
        return null
      })
      if(!transation) return null
      const transationBody= await transation.json()
      return transationBody
    }
}