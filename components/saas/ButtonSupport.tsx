"use client";

import { Crisp } from "crisp-sdk-web";

import * as Button from "@/components/ui/button";
import config from "@/lib/saas/saas-config";

const ButtonSupport = () => {
  const handleClick = () => {
    if (config.crisp?.id) {
      Crisp.chat.show();
      Crisp.chat.open();
    } else if (config.resend?.supportEmail) {
      window.open(
        `mailto:${config.resend.supportEmail}?subject=Need help with ${config.appName}`,
        "_blank",
      );
    }
  };

  const isCrispEnabled = Boolean(config.crisp?.id);

  return (
    <Button.Root
      variant="neutral"
      mode={isCrispEnabled ? "stroke" : "ghost"}
      size="xsmall"
      className="gap-2"
      onClick={handleClick}
      data-tooltip-id="tooltip"
      data-tooltip-content={isCrispEnabled ? "Chat with support" : "Email support"}
      title={isCrispEnabled ? "Chat with support" : "Email support"}
    >
      {isCrispEnabled ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path d="M2 4.5A1.5 1.5 0 013.5 3h13A1.5 1.5 0 0118 4.5v.191l-8 5.333-8-5.333V4.5z" />
          <path d="M18 7.309l-7.445 4.966a1.5 1.5 0 01-1.11.225 1.5 1.5 0 01-1.11-.225L2 7.309V15.5A1.5 1.5 0 003.5 17h13a1.5 1.5 0 001.5-1.5V7.309z" />
        </svg>
      )}
      Support
    </Button.Root>
  );
};

export default ButtonSupport;
