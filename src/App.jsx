import { useEffect, useState } from 'react'
import esewaLogo from './assets/esewa.svg'
import './App.css'
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from "uuid";

function App() {

  const [formData, setformData] = useState({
    name: "",
    message: "",
    amount: 10,
    tax_amount: "0",
    total_amount: 10,
    transaction_uuid: uuidv4(),
    product_code: "EPAYTEST",
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: "https://developer.esewa.com.np/success",
    failure_url: "https://developer.esewa.com.np/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=",
    secret: "8gBm/:&EnhH.1/q"
  })

  // Generate a signature 
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setformData({ ...formData, signature: hashedSignature });
  }, [formData.amount]);


  return (
    <>
      <div>
          <img src={esewaLogo} className="logo react" alt="React logo" />
      </div>
      <h2>Esewa Integration</h2>
      <div>
        <form className='container' action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
        <p className='labels'>Your Name:</p>
        <input 
        className='field'
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={(e) => setformData({ ...formData, name: e.target.value})}
          required/>
          <p className='labels'>Amount to pay:</p>
          <input className='field'
            type="text" 
            id="amount" 
            name="amount" 
            value={formData.amount}
            onChange={(e) => setformData({ ...formData, amount: e.target.value , total_amount: e.target.value})}
          required/>
          <p className='labels'>Your message:</p>
          <input className='field'
            type="text" 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={(e) => setformData({ ...formData, message: e.target.value })}
          required/>
          <input type="hidden" id="tax_amount" name="tax_amount" value = {formData.tax_amount} required/>
          <input type="hidden" id="total_amount" name="total_amount" value={formData.total_amount} required/>
          <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={formData.transaction_uuid} required/>
          <input type="hidden" id="product_code" name="product_code" value ={formData.product_code} required/>
          <input type="hidden" id="product_service_charge" name="product_service_charge" value={formData.product_service_charge} required/>
          <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value={formData.product_delivery_charge} required/>
          <input type="hidden" id="success_url" name="success_url" value={formData.failure_url} required/>
          <input type="hidden" id="failure_url" name="failure_url" value={formData.success_url} required/>
          <input type="hidden" id="signed_field_names" name="signed_field_names" value={formData.signed_field_names} required/>
          <input type="hidden" id="signature" name="signature" value={formData.signature} required/>
          <input value="Submit" type="submit"/>
        </form>
      </div>
    </>
  )
}

export default App
