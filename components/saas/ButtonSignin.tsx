/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import * as Button from "@/components/ui/button";
import { cn } from "@/utils/cn";
import config from "@/lib/saas/saas-config";

interface ButtonSigninProps {
  text?: string;
  extraStyle?: string;
}

const ButtonSignin = ({ text = "Get started", extraStyle }: ButtonSigninProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  const className = cn("gap-2", extraStyle);

  if (status === "authenticated" && session?.user) {
    const initials =
      session.user.name?.charAt(0) || session.user.email?.charAt(0) || "?";

    return (
      <Button.Root
        asChild
        variant="neutral"
        mode="stroke"
        size="small"
        className={className}
      >
        <Link href={config.auth.callbackUrl}>
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "Account"}
              className="size-6 shrink-0 rounded-full"
              referrerPolicy="no-referrer"
              width={24}
              height={24}
            />
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 text-label-sm text-text-strong-950">
              {initials}
            </span>
          )}
          {session.user.name || session.user.email || "Account"}
        </Link>
      </Button.Root>
    );
  }

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="small"
      className={className}
      onClick={handleClick}
    >
      {text}
    </Button.Root>
  );
};

export default ButtonSignin;
