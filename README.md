Api products y compra, integra con pasarela de pagos.

Conseguir productos:
/product/allproducts

Crear productos:
/product/createproduct
{ 
  "name": "Fresa", 
  "description": "Fresa grande", 
  "cantidad": 12, 
  "precio": 400
}

/product/editproduct
{ 
  "_id": "66ac30fb45e8279d01e3171c",  
  "name": "Manzana", 
  "description": "Manzana roja", 
  "cantidad": 17, 
  "precio": 400
}


Validar tarjeta:
/pago/tokenizartarjeta
{
  "number": "4242424242424242", // Número de la tarjeta
  "cvc": "123", // Código de seguridad de la tarjeta (3 o 4 dígitos según corresponda)
  "expiry": "0828", // Mes de expiración (string de 2 dígitos) // Año expresado current 2 dígitos
  "name": "José Pérez" // Nombre del tarjetahabiente
}


Conseguir terminos y condiciones, token:
pago/retornartokenaceptacion

Realizar pagos:
/pago/sendmepago
{   
    "acceptance_token": "eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjQzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MjI0MTY0ODctMjUxMzciLCJlbWFpbCI6IiIsImV4cCI6MTcyMjQyMDA4N30.v-vIYqBVURClKDwxgtnjQHKzMW4R65pT5lfaXc82GQk",
    "infoCarrito": {
      "listProduct": [{ 
        "_id": "66a9bb0191507f202d904a4f",  
        "cantidad": 1
      },{ 
        "_id": "66a9fcff18147d4a77e81c04",  
        "cantidad": 1
      }]
    },
    "reference": "bbbl01123",
    "amount_in_cents": 150000,
    "currency": "COP",
    "signature": "d746356a88534f0607e91fec7665985e71c2155d372550759bc5fe9fd13ccce3",
    "payment_method": {
    "type": "CARD",
    "installments": 1, // Número de cuotas
    "token": "tok_stagtest_5113_b3456B22Ea761791DdF63e0CEAC860f9" // Token de la tarjeta de crédito
    },
    "customer_email": "trujilloivanzx@gmail.com",
    "customer_data": {
        "legal_id": "20121221",
        "phone_number": "+573145678901",
        "full_name": "Ivan Otero (Van)",
        "legal_id_type": "CC"
    }
}

Traer transaciones por id
/pago/gettransation/15113-1722573831-41087

