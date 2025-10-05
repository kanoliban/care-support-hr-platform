import { ConfigProps } from "@/types/saas-config";

// DaisyUI v5 no longer exports themes directly, using fallback color
const themes = {
  light: {
    primary: "#3b82f6", // blue-500
  }
};

const config = {
  // REQUIRED
  appName: "CareSupport",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Professional care coordination platform for families, caregivers, and healthcare agencies.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "caresupport.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_family_plan_dev"
            : "price_family_plan_prod",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Family Plan",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for families coordinating care at home",
        // The price you want to display, the one user will be charged on Stripe.
        price: 19,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: null,
        features: [
          { name: "Up to 10 users (family and friends)" },
          { name: "Unlimited caregivers per family" },
          { name: "All coordination features" },
          { name: "Gap detection and smart scheduling" },
          { name: "Priority support" },
          { name: "Free trial included" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_caregiver_os_dev"
            : "price_caregiver_os_prod",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "CareGiver OS",
        description: "Professional care management for caregivers",
        price: 29,
        priceAnchor: null,
        features: [
          { name: "All features of the Family Plan" },
          { name: "Management of unlimited families" },
          { name: "Professional dashboard" },
          { name: "Visit documentation and billing tools" },
          { name: "Priority support" },
          { name: "Free trial included" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_agency_plan_dev"
            : "price_agency_plan_prod",
        name: "Agency Plan",
        description: "Enterprise solution for healthcare agencies",
        price: null, // Custom pricing
        priceAnchor: null,
        features: [
          { name: "All features of the CareGiver OS" },
          { name: "Workforce management" },
          { name: "Custom AI workflows" },
          { name: "Compliance tracking" },
          { name: "Priority analytics" },
          { name: "Dedicated support" },
          { name: "Custom pricing available" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `CareSupport <noreply@caresupport.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `CareSupport Team <team@caresupport.com>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@caresupport.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you use any theme other than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/login",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/",
  },
} as ConfigProps;

export default config;
