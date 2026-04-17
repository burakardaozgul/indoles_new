import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  real,
  index,
  uniqueIndex,
  inet,
  primaryKey,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------
export const userRole = pgEnum("user_role", ["user", "consultant", "admin"]);
export const localeEnum = pgEnum("locale", ["tr", "en"]);
export const pillarEnum = pgEnum("pillar", ["growth", "transform", "build"]);
export const budgetEnum = pgEnum("budget", ["small", "medium", "large"]);
export const timelineEnum = pgEnum("timeline", [
  "urgent",
  "normal",
  "flexible",
]);
export const briefStatus = pgEnum("brief_status", [
  "pending",
  "triaged",
  "in_discussion",
  "converted",
  "declined",
  "archived",
]);
export const bookingStatus = pgEnum("booking_status", [
  "confirmed",
  "rescheduled",
  "cancelled",
  "completed",
  "no_show",
]);
export const paymentProvider = pgEnum("payment_provider", [
  "stripe",
  "iyzico",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
  "disputed",
]);
export const reminderChannel = pgEnum("reminder_channel", ["email", "sms"]);
export const reminderStatus = pgEnum("reminder_status", [
  "scheduled",
  "sent",
  "failed",
  "cancelled",
]);
export const personaEnum = pgEnum("persona", [
  "industrial",
  "commerce",
  "unknown",
]);
export const messageRole = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);

// ---------- Tables ----------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    role: userRole("role").notNull().default("user"),
    locale: localeEnum("locale").notNull().default("tr"),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    clerkIdx: uniqueIndex("users_clerk_id_idx").on(t.clerkId),
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    roleIdx: index("users_role_idx").on(t.role),
  })
);

export const consultants = pgTable(
  "consultants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    sanityProfileRef: text("sanity_profile_ref"),
    calEventTypeSlug: text("cal_event_type_slug").notNull(),
    pillarFocus: pillarEnum("pillar_focus").array().notNull(),
    expertiseTags: text("expertise_tags").array().notNull().default([]),
    active: boolean("active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (t) => ({
    slugIdx: uniqueIndex("consultants_slug_idx").on(t.slug),
    activeOrderIdx: index("consultants_active_order_idx").on(
      t.active,
      t.displayOrder
    ),
  })
);

export const packages = pgTable(
  "packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sanityRef: text("sanity_ref").notNull(),
    slug: text("slug").notNull(),
    pillar: pillarEnum("pillar").notNull(),
    pricing: jsonb("pricing").notNull(), // { TRY: number, EUR: number, USD: number }
    active: boolean("active").notNull().default(true),
    stripePriceId: text("stripe_price_id"),
    iyzicoProductRef: text("iyzico_product_ref"),
  },
  (t) => ({
    slugIdx: uniqueIndex("packages_slug_idx").on(t.slug),
    sanityIdx: uniqueIndex("packages_sanity_ref_idx").on(t.sanityRef),
    pillarActiveIdx: index("packages_pillar_active_idx").on(
      t.pillar,
      t.active
    ),
  })
);

export const briefs = pgTable(
  "briefs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    companyName: text("company_name").notNull(),
    sector: text("sector").notNull(),
    problemDescription: text("problem_description").notNull(),
    budget: budgetEnum("budget").notNull(),
    timeline: timelineEnum("timeline").notNull(),
    preferredPillar: pillarEnum("preferred_pillar"),
    status: briefStatus("status").notNull().default("pending"),
    suggestedSlots: jsonb("suggested_slots"),
    assignedConsultantId: uuid("assigned_consultant_id").references(
      () => consultants.id,
      { onDelete: "set null" }
    ),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("briefs_user_idx").on(t.userId, t.createdAt),
    statusIdx: index("briefs_status_idx").on(t.status, t.createdAt),
  })
);

export const briefAttachments = pgTable("brief_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id")
    .notNull()
    .references(() => briefs.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    consultantId: uuid("consultant_id")
      .notNull()
      .references(() => consultants.id, { onDelete: "restrict" }),
    packageId: uuid("package_id").references(() => packages.id, {
      onDelete: "set null",
    }),
    briefId: uuid("brief_id").references(() => briefs.id, {
      onDelete: "set null",
    }),
    calUid: text("cal_uid").notNull(),
    calEventTypeSlug: text("cal_event_type_slug").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    status: bookingStatus("status").notNull(),
    locale: localeEnum("locale").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    calUidIdx: uniqueIndex("bookings_cal_uid_idx").on(t.calUid),
    userIdx: index("bookings_user_idx").on(t.userId, t.startAt),
    consultantIdx: index("bookings_consultant_idx").on(
      t.consultantId,
      t.startAt
    ),
    statusIdx: index("bookings_status_idx").on(t.status, t.startAt),
  })
);

export const bookingReminders = pgTable("booking_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  fireAt: timestamp("fire_at", { withTimezone: true }).notNull(),
  channel: reminderChannel("channel").notNull(),
  status: reminderStatus("status").notNull().default("scheduled"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    packageId: uuid("package_id").references(() => packages.id, {
      onDelete: "set null",
    }),
    bookingId: uuid("booking_id").references(() => bookings.id, {
      onDelete: "set null",
    }),
    provider: paymentProvider("provider").notNull(),
    providerId: text("provider_id").notNull(),
    currency: text("currency").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: paymentStatus("status").notNull().default("pending"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    succeededAt: timestamp("succeeded_at", { withTimezone: true }),
  },
  (t) => ({
    providerIdIdx: uniqueIndex("payments_provider_id_idx").on(
      t.provider,
      t.providerId
    ),
    userIdx: index("payments_user_idx").on(t.userId, t.createdAt),
    statusIdx: index("payments_status_idx").on(t.status, t.createdAt),
  })
);

export const personaSignals = pgTable(
  "persona_signals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id").notNull(),
    signal: text("signal").notNull(),
    weight: real("weight").notNull().default(1.0),
    sourceUrl: text("source_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sessionIdx: index("persona_signals_session_idx").on(
      t.sessionId,
      t.createdAt
    ),
    userIdx: index("persona_signals_user_idx").on(t.userId, t.createdAt),
  })
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id").notNull(),
    persona: personaEnum("persona").notNull().default("unknown"),
    locale: localeEnum("locale").notNull().default("tr"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolved: boolean("resolved").notNull().default(false),
  },
  (t) => ({
    sessionIdx: index("conversations_session_idx").on(
      t.sessionId,
      t.startedAt
    ),
  })
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    conversationIdx: index("messages_conversation_idx").on(
      t.conversationId,
      t.createdAt
    ),
  })
);

export const toolInvocations = pgTable(
  "tool_invocations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    toolName: text("tool_name").notNull(),
    input: jsonb("input").notNull(),
    output: jsonb("output"),
    error: text("error"),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    toolIdx: index("tool_invocations_tool_idx").on(t.toolName, t.createdAt),
  })
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: uuid("resource_id"),
    diff: jsonb("diff").notNull().default({}),
    ip: inet("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    actorIdx: index("audit_events_actor_idx").on(t.actorUserId, t.createdAt),
    resourceIdx: index("audit_events_resource_idx").on(
      t.resourceType,
      t.resourceId,
      t.createdAt
    ),
  })
);

export const popupSubmissions = pgTable("popup_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  sessionId: text("session_id").notNull(),
  userId: uuid("user_id"),
  persona: text("persona").notNull(),
  problems: text("problems").array().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  email: text("email"),
  company: text("company"),
  title: text("title"),
  submissionType: text("submission_type").notNull(),
  kvkkConsentAt: timestamp("kvkk_consent_at", { withTimezone: true }),
  locale: text("locale").notNull(),
  calComBookingId: text("cal_com_booking_id"),
  emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
});

export type PopupSubmission = typeof popupSubmissions.$inferSelect;
export type NewPopupSubmission = typeof popupSubmissions.$inferInsert;
