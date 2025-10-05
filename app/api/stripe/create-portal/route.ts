import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/saas/next-auth';
import connectMongo from '@/lib/saas/mongoose';
import { createCustomerPortal } from '@/lib/saas/stripe';
import User from '@/models/saas/User';

interface PortalRequestBody {
  returnUrl?: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 },
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Not signed in' },
      { status: 401 },
    );
  }

  const { returnUrl } = (await req.json()) as PortalRequestBody;

  if (!returnUrl) {
    return NextResponse.json(
      { error: 'returnUrl is required' },
      { status: 400 },
    );
  }

  try {
    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user?.customerId) {
      return NextResponse.json(
        { error: 'Billing profile not found. Make a purchase first.' },
        { status: 400 },
      );
    }

    const portalUrl = await createCustomerPortal({
      customerId: user.customerId,
      returnUrl,
    });

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error('[stripe/create-portal]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
