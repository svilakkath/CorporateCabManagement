import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' as any, // Adjust if necessary
});

export async function POST(request: Request) {
  try {
    const { payment_method_id, payment_intent_id, customer_id } =
      await request.json();

    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({
          error:
            'Missing required fields: payment_method_id, payment_intent_id, or customer_id',
        }),
        { status: 400 },
      );
    }

    await stripe.paymentMethods
      .attach(payment_method_id, { customer: customer_id })
      .catch((error: any) => {
        console.error('Error attaching payment method:', error);
        throw new Error('Failed to attach the payment method.');
      });

    const paymentIntent = await stripe.paymentIntents
      .confirm(payment_intent_id, {
        payment_method: payment_method_id,
      })
      .catch((error: any) => {
        console.error('Error confirming PaymentIntent:', error);
        throw new Error('Failed to confirm the PaymentIntent.');
      });

    if (paymentIntent.status === 'succeeded') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment successful',
          client_secret: paymentIntent.client_secret,
        }),
        { status: 200 },
      );
    } else {
      console.error(`PaymentIntent status: ${paymentIntent.status}`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Payment failed. Status: ${paymentIntent.status}`,
        }),
        { status: 402 },
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in /pay route:', error.message);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          details: error.message,
        }),
        { status: 500 },
      );
    }
    console.error('Unknown error in /pay route:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: 'Unexpected error',
      }),
      { status: 500 },
    );
  }
}
