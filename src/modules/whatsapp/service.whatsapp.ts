import axios from "axios";

export const sendWhatsAppMessage = async(to:string, message:string, token:string, business_phone_number_id:string):Promise<void>=>{
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message },
    },
  });
}