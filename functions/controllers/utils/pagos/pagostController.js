const { Router }= require("express")
const { sendPagoS, retornarTokenAceptacion, tokenizarTarjetaS, sendMePagoS, getTransationS }= require("./../../../services/utils/pagos/pagosService")
const router= Router()

router.post("/sendpago", sendPagoS)
router.get("/retornartokenaceptacion", retornarTokenAceptacion)
router.post("/tokenizartarjeta", tokenizarTarjetaS)
router.post("/sendmepago", sendMePagoS)
router.get("/gettransation/:id", getTransationS)

module.exports= router