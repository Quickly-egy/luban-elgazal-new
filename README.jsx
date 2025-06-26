curl --request POST \
  --url https://api.tabby.ai/api/v2/checkout \
  --header 'Authorization: Bearer sk_30c68d48-541c-41bf-9376-7eee5fc8a5bb' \
  --header 'Content-Type: application/json' \
  --data '{
  "payment": {
    "attachment": {
      "content_type": "application/vnd.tabby.v1+json",
      "body": {
        "insurance_details": {
          "client": {
            "first_name": "Abdelrahman",
            "last_name": "Elsayed"
          }
        }
      }
    },
    "amount": "10",
    "currency": "SAR",
    "buyer": {
      "phone": "01288266400",
      "email": "body90861@gmail.com",
      "name": "aaaa"
    },
    "shipping_address": {
      "city": "nasr city",
      "address": "31 hosny ahmed khalaf",
      "zip": "11311"
    },
    "order": {
      "reference_id": "3443434343",
      "items": [
        {
          "discount_amount": "0.00",
          "title": "222",
          "quantity": 0,
          "unit_price": "12",
          "category": "222"
        }
      ]
    },
    "buyer_history": {
      "registered_since": "2025-06-26T21:45:00Z",
      "loyalty_level": 7
    },
    "description": "ققق"
  },
  "merchant_urls": {
    "success": "https://www.youtube.com/watch?v=uvn6rLfdTh8&list=RDuvn6rLfdTh8&start_radio=1",
    "cancel": "https://meet.google.com/landing",
    "failure": "https://meet.google.com/landing"
  }
}'