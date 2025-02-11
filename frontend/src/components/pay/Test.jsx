import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

const Test = () => {
    const [preferenceId, setPreferenceId] = useState('');

    initMercadoPago( 'APP_USR-7fbe4f47-ef71-4e71-b4b1-5f50a3709378', {locale: 'es-UY'});
    const createPreference = async () => {
        try {
            const body = {
                title: 'Test',
                price: 100,
                quantity: 1
            };
            console.log('Body enviado:',body);
            const response = await axios.post(
                'http://localhost:8080/payment/create-order',
                body,
                {
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
            );
            console.log("Respuesta del backend:", response.data);
            const { id } = response.data;
            console.log(id, 'extrajo el id');
            return id;
        } catch (error) {
            console.log(error);
        }
    }
    const handleBuy = async () => {
        const id = await createPreference();
        if(id){
            setPreferenceId(id);
        }
    };

  return (
    <div>
      <h3 >Test</h3>
      <p>Quantity: 1</p>
      <p>Price: $100</p>
      <button onClick={handleBuy}>Comprar</button>
         {preferenceId && <Wallet initialization={{preferenceId: preferenceId}} />}
    </div>
    
  )
}

export default Test