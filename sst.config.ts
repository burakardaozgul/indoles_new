/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "indoles-web",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "eu-central-1" },
      },
    };
  },
  async run() {
    // SST Secrets — tüm hassas değerler buradan geçer
    const neonDbUrl = new sst.Secret("NeonDatabaseUrl");
    const clerkPublishableKey = new sst.Secret("ClerkPublishableKey");
    const clerkSecretKey = new sst.Secret("ClerkSecretKey");
    const clerkWebhookSecret = new sst.Secret("ClerkWebhookSecret");
    const sanityProjectId = new sst.Secret("SanityProjectId");
    const sanityDataset = new sst.Secret("SanityDataset");
    const sanityToken = new sst.Secret("SanityApiToken");
    const sanityWebhookSecret = new sst.Secret("SanityWebhookSecret");
    const geminiApiKey = new sst.Secret("GoogleGeminiApiKey");
    const stripeSecretKey = new sst.Secret("StripeSecretKey");
    const stripeWebhookSecret = new sst.Secret("StripeWebhookSecret");
    const iyzicoApiKey = new sst.Secret("IyzicoApiKey");
    const iyzicoSecretKey = new sst.Secret("IyzicoSecretKey");
    const calApiKey = new sst.Secret("CalApiKey");
    const calWebhookSecret = new sst.Secret("CalWebhookSecret");
    const resendApiKey = new sst.Secret("ResendApiKey");
    const inngestEventKey = new sst.Secret("InngestEventKey");
    const inngestSigningKey = new sst.Secret("InngestSigningKey");
    const posthogKey = new sst.Secret("PosthogKey");
    const sentryDsn = new sst.Secret("SentryDsn");
    const axiomToken = new sst.Secret("AxiomToken");

    const site = new sst.aws.Nextjs("IndolesWeb", {
      domain: {
        name:
          $app.stage === "production"
            ? "indoles.com.tr"
            : `${$app.stage}.indoles.com.tr`,
        dns: sst.aws.dns({ zone: "indoles.com.tr" }),
      },
      environment: {
        DATABASE_URL: neonDbUrl.value,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKey.value,
        CLERK_SECRET_KEY: clerkSecretKey.value,
        CLERK_WEBHOOK_SECRET: clerkWebhookSecret.value,
        NEXT_PUBLIC_SANITY_PROJECT_ID: sanityProjectId.value,
        NEXT_PUBLIC_SANITY_DATASET: sanityDataset.value,
        SANITY_API_TOKEN: sanityToken.value,
        SANITY_WEBHOOK_SECRET: sanityWebhookSecret.value,
        GOOGLE_GENERATIVE_AI_API_KEY: geminiApiKey.value,
        STRIPE_SECRET_KEY: stripeSecretKey.value,
        STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
        IYZICO_API_KEY: iyzicoApiKey.value,
        IYZICO_SECRET_KEY: iyzicoSecretKey.value,
        CAL_API_KEY: calApiKey.value,
        CAL_WEBHOOK_SECRET: calWebhookSecret.value,
        RESEND_API_KEY: resendApiKey.value,
        INNGEST_EVENT_KEY: inngestEventKey.value,
        INNGEST_SIGNING_KEY: inngestSigningKey.value,
        NEXT_PUBLIC_POSTHOG_KEY: posthogKey.value,
        NEXT_PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
        NEXT_PUBLIC_SENTRY_DSN: sentryDsn.value,
        AXIOM_TOKEN: axiomToken.value,
        NEXT_PUBLIC_APP_STAGE: $app.stage,
      },
    });

    return { url: site.url };
  },
});
