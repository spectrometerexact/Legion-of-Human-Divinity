const stripe = require('stripe');

exports.handler = async (event) => {
  // Get the origin from the request
  const origin = event.headers.origin || event.headers.Origin;
  
  // YOUR CUSTOM DOMAINS - ADD YOURS HERE
  const allowedOrigins = [
    'https://legionofhumandivintiy.com',
    'https://www.legionofhumandivintiy.com',
    'https://glittering-parfait-2b07d4.netlify.app',
    'http://localhost:3000',
    'http://localhost:4242'
  ];
  
  // Check if origin is allowed
  const corsHeaders = allowedOrigins.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin }
    : { 'Access-Control-Allow-Origin': 'https://glittering-parfait-2b07d4.netlify.app' };
  
  // Handle preflight OPTIONS request (browser sends this first)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize Stripe with your secret key
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    
    // Parse the request body
    const { items, shippingCost, customerEmail } = JSON.parse(event.body);
    
    // Build line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          metadata: {
            product_id: item.id.toString()
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    // Add shipping if cost > 0
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }
    
    // Create Stripe session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://legionofhumandivintiy.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://legionofhumandivintiy.com/shop.html`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        order_source: 'hopefulhands_shop'
      }
    });
    
    // Return the session URL
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ url: session.url })
    };
    
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
