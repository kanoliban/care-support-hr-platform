import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/saas/next-auth';
import connectMongo from '@/lib/saas/mongoose';
import { createCheckout } from '@/lib/saas/stripe';
import User from '@/models/saas/User';

interface CheckoutRequestBody {
  priceId?: string;
  mode?: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
  couponId?: string | null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutRequestBody;

  const { priceId, mode = 'payment', successUrl, cancelUrl, couponId } = body;

  if (!priceId) {
    return NextResponse.json(
      { error: 'priceId is required' },
      { status: 400 },
    );
  }

  if (!successUrl || !cancelUrl) {
    return NextResponse.json(
      { error: 'successUrl and cancelUrl are required' },
      { status: 400 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 },
    );
  }

  try {
    const session = await auth();

    await connectMongo();

    let user: any = null;
    if (session?.user?.id) {
      user = await User.findById(session.user.id);
    }

    const checkoutUrl = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      couponId: couponId ?? undefined,
      clientReferenceId: user?._id?.toString(),
      user: user
        ? {
            customerId: user.customerId,
            email: user.email,
          }
        : undefined,
    });

    if (!checkoutUrl) {
      throw new Error('Unable to create checkout session');
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('[stripe/create-checkout]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
