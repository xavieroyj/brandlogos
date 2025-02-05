import Stripe from 'stripe';

// Initialize Stripe with test secret key
const stripe = new Stripe('sk_test_51Qp3vJGhqD4RmhuafvJIpTrCMLaXdn35DAf5Jq1C3JhcyPSGLHLW4WJBClAkOPaxAVVPbcTseKZ7uC2kOtKZg1VJ00DAFgNGJ0', {
  apiVersion: '2025-01-27.acacia',
});

async function createProducts() {
  try {
    // Create Pro Product
    const proProduct = await stripe.products.create({
      name: 'Pro Plan',
      description: 'Professional plan with 20 daily credits',
    });

    // Create Pro Price
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1000, // $10.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    // Create Enterprise Product
    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise Plan',
      description: 'Enterprise plan with 50 daily credits',
    });

    // Create Enterprise Price
    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 5000, // $50.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log('\nStripe Product and Price IDs:');
    console.log('-----------------------------');
    console.log('Pro Plan:');
    console.log(`Product ID: ${proProduct.id}`);
    console.log(`Price ID: ${proPrice.id}`);
    console.log('\nEnterprise Plan:');
    console.log(`Product ID: ${enterpriseProduct.id}`);
    console.log(`Price ID: ${enterprisePrice.id}`);
    console.log('\nAdd these to your .env file:');
    console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
    console.log(`STRIPE_ENTERPRISE_PRICE_ID=${enterprisePrice.id}`);

    // Create webhook endpoint using environment variable
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhook = await stripe.webhookEndpoints.create({
      url: `${appUrl}/api/webhooks/stripe`,
      enabled_events: [
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
      ],
    });

    console.log('\nWebhook Endpoint:');
    console.log('----------------');
    console.log(`Endpoint ID: ${webhook.id}`);
    console.log(`Webhook Secret: ${webhook.secret}`);
    console.log('\nAdd this to your .env file:');
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);

  } catch (error) {
    console.error('Error setting up Stripe:', error);
  }
}

createProducts();