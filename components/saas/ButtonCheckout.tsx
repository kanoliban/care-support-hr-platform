"use client";

import { useState } from "react";

import * as Button from "@/components/ui/button";
import apiClient from "@/lib/saas/api-client";
import config from "@/lib/saas/saas-config";

interface ButtonCheckoutProps {
  priceId: string;
  mode?: "payment" | "subscription";
}

const Spinner = () => (
  <span className="inline-flex size-4 animate-spin rounded-full border-[2px] border-primary-base/40 border-t-transparent" />
);

const ButtonCheckout = ({ priceId, mode = "payment" }: ButtonCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const { url } = await apiClient.post<{ url: string }>(
        "/stripe/create-checkout",
        {
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode,
        },
      );

      window.location.href = url;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="medium"
      className="w-full justify-center gap-2"
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : null}
      {isLoading ? "Redirecting…" : `Get ${config.appName}`}
    </Button.Root>
  );
};

export default ButtonCheckout;
