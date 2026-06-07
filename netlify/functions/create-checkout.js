const stripe = require('stripe');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Initialize Stripe with your secret key
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get cart data from the request
    const { items, shippingCost, customerEmail } = JSON.parse(event.body);
    
    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `Quantity: ${item.quantity}`,
          metadata: {
            product_id: item.id.toString()
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    // Add shipping as a line item if cost > 0
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }
    
    // Create Stripe Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://glittering-parfait-2b07d4.netlify.app/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://glittering-parfait-2b07d4.netlify.app/shop.html`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        order_source: 'hopefulhands_shop',
        cart_items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, qty: i.quantity })))
      }
    });
    
    // Return the session URL to the frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: session.url })
    };
    
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
