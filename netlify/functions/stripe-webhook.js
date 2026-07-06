const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Verify this is a real Stripe webhook
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let stripeEvent;
    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (err) {
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }
    
    // Handle checkout session completed
    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;
        
        // Get the line items (products purchased)
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        
        // Extract shipping details
        const address = session.shipping_details?.address;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || 'Customer';
        
        // Build order summary
        let itemsList = '';
        let totalAmount = 0;
        lineItems.data.forEach(item => {
            itemsList += `${item.quantity}x ${item.description} - $${(item.amount_total / 100).toFixed(2)}\n`;
            totalAmount += item.amount_total / 100;
        });
        
        // Build shipping address string
        const addressString = address 
            ? `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`
            : 'No shipping address provided';
        
        // Send notification (you can choose one or more methods below)
        
        // METHOD 1: Print to Netlify logs (view in Netlify dashboard)
        console.log('🎉 NEW ORDER!');
        console.log('Customer:', customerEmail);
        console.log('Address:', addressString);
        console.log('Items:\n', itemsList);
        console.log('Total:', `$${totalAmount.toFixed(2)}`);
        
        // METHOD 2: Send email via simple HTTP request (no dependencies!)
        await sendOrderEmail(customerEmail, customerName, addressString, itemsList, totalAmount);
        
        // METHOD 3: Send SMS via Twilio (optional - uncomment if you have Twilio)
        // await sendSMSNotification(customerEmail, addressString, itemsList, totalAmount);
        
        // METHOD 4: Save to Google Sheets (optional - uncomment if you have Google Sheets setup)
        // await saveToGoogleSheets(customerEmail, addressString, itemsList, totalAmount);
    }
    
    return { statusCode: 200, body: 'Webhook received successfully' };
};

// METHOD 2: Send email using a simple email service (no dependencies!)
async function sendOrderEmail(customerEmail, customerName, addressString, itemsList, totalAmount) {
    // Use EmailJS (free, no dependencies)
    // Sign up at https://www.emailjs.com/ for a free account
    // Get your service ID, template ID, and public key
    
    const emailjsData = {
        service_id: 'YOUR_EMAILJS_SERVICE_ID',
        template_id: 'YOUR_EMAILJS_TEMPLATE_ID',
        user_id: 'YOUR_EMAILJS_PUBLIC_KEY',
        template_params: {
            customer_email: customerEmail,
            customer_name: customerName,
            shipping_address: addressString,
            items: itemsList,
            total: `$${totalAmount.toFixed(2)}`,
            order_date: new Date().toLocaleString(),
            seller_email: 'YOUR_SELLER_EMAIL@example.com' // You get a copy too
        }
    };
    
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailjsData)
        });
        
        if (response.ok) {
            console.log('Email sent successfully!');
        } else {
            console.error('Email failed:', await response.text());
        }
    } catch (error) {
        console.error('Email error:', error);
    }
}

// METHOD 3: Optional - Send SMS via Twilio
async function sendSMSNotification(customerEmail, addressString, itemsList, totalAmount) {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const yourPhoneNumber = process.env.YOUR_PHONE_NUMBER;
    
    const message = `🎉 NEW ORDER!\n\nCustomer: ${customerEmail}\nAddress: ${addressString}\nItems: ${itemsList}\nTotal: $${totalAmount.toFixed(2)}`;
    
    try {
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                To: yourPhoneNumber,
                From: twilioPhoneNumber,
                Body: message
            })
        });
        console.log('SMS sent successfully!');
    } catch (error) {
        console.error('SMS error:', error);
    }
}
