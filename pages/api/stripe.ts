import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: 'cart',
            billing_address_collection: 'auto',
            shipping_options: [
                { shipping_rate: 'shr_1MRrH6LKPOhhPUtzs1HUV0Ps' },
            ],

            line_items: req.body.map((item: any) => {
                const img = item.image[0].asset.ref
                const newImage = img.replace('image-', 'https://cdn.sanity.io/images/40z69mzh/production/').replace('-webp','.webp')

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            images: [newImage],
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enable: true,
                        minimum: 1,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
          }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}