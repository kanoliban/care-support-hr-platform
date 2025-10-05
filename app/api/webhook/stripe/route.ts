import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

import connectMongo from '@/lib/saas/mongoose';
import config from '@/lib/saas/saas-config';
import { findCheckoutSession } from '@/lib/saas/stripe';
import User from '@/models/saas/User';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: '2023-08-16',
      typescript: true,
    })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 500 },
    );
  }

  await connectMongo();

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature ?? '', webhookSecret);
  } catch (error) {
    console.error('[stripe/webhook] signature verification failed', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const session = await findCheckoutSession(checkoutSession.id);
        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = checkoutSession.client_reference_id;

        if (!priceId) {
          break;
        }

        const plan = config.stripe.plans.find((item) => item.priceId === priceId);
        if (!plan) {
          break;
        }

        let user = null;

        if (userId) {
          user = await User.findById(userId);
        }

        if (!user && checkoutSession.customer_details?.email) {
          user = await User.findOne({ email: checkoutSession.customer_details.email });
        }

        if (!user) {
          user = await User.create({
            email: checkoutSession.customer_details?.email,
            name: checkoutSession.customer_details?.name,
          });
        }

        if (!user) {
          break;
        }

        user.priceId = priceId;
        user.customerId = typeof customerId === 'string' ? customerId : undefined;
        user.hasAccess = true;
        await user.save();

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ customerId });
        if (user) {
          user.hasAccess = false;
          await user.save();
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const priceId = invoice.lines.data[0]?.price?.id;
        const customerId = invoice.customer as string;

        if (!priceId) {
          break;
        }

        const user = await User.findOne({ customerId });
        if (user && user.priceId === priceId) {
          user.hasAccess = true;
          await user.save();
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error('[stripe/webhook] handler error', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
