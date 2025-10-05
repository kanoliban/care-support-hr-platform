/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";

import * as Button from "@/components/ui/button";
import apiClient from "@/lib/saas/api-client";

const Spinner = () => (
  <span className="inline-flex size-4 animate-spin rounded-full border-[2px] border-primary-base/40 border-t-transparent" />
);

const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleBilling = async () => {
    setIsLoading(true);

    try {
      const { url } = await apiClient.post<{ url: string }>(
        "/stripe/create-portal",
        {
          returnUrl: window.location.href,
        },
      );

      window.location.href = url;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (status === "unauthenticated") return null;

  const initials =
    session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "?";

  return (
    <Popover className="relative z-10">
      {({ open }) => (
        <>
          <Popover.Button>
            <div
              className="flex items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-label-sm text-text-strong-950 transition hover:bg-bg-weak-50"
            >
              <>
                {session?.user?.image ? (
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
                {session?.user?.name || "Account"}
                {isLoading ? (
                  <Spinner />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`size-5 transition duration-200 opacity-50 ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </>
            </div>
          </Popover.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-[16rem] transform">
              <div className="overflow-hidden rounded-xl bg-bg-white-0 shadow-regular-md ring-1 ring-stroke-soft-200">
                <div className="px-2 py-1">
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-sm text-text-strong-950 transition hover:bg-bg-weak-50"
                    onClick={handleBilling}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Billing
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-sm text-text-strong-950 transition hover:bg-error-alpha-10 hover:text-error-base"
                    onClick={handleSignOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ButtonAccount;
