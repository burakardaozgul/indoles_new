CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."brief_status" AS ENUM('pending', 'triaged', 'in_discussion', 'converted', 'declined', 'archived');--> statement-breakpoint
CREATE TYPE "public"."budget" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('tr', 'en');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant', 'system', 'tool');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'iyzico');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."persona" AS ENUM('industrial', 'commerce', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."pillar" AS ENUM('growth', 'transform', 'build');--> statement-breakpoint
CREATE TYPE "public"."popup_persona" AS ENUM('donusum-teknoloji', 'buyume-pazarlar');--> statement-breakpoint
CREATE TYPE "public"."reminder_channel" AS ENUM('email', 'sms');--> statement-breakpoint
CREATE TYPE "public"."reminder_status" AS ENUM('scheduled', 'sent', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."timeline" AS ENUM('urgent', 'normal', 'flexible');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'consultant', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid,
	"diff" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"fire_at" timestamp with time zone NOT NULL,
	"channel" "reminder_channel" NOT NULL,
	"status" "reminder_status" DEFAULT 'scheduled' NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"consultant_id" uuid NOT NULL,
	"package_id" uuid,
	"brief_id" uuid,
	"cal_uid" text NOT NULL,
	"cal_event_type_slug" text NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" "booking_status" NOT NULL,
	"locale" "locale" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brief_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brief_id" uuid NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "briefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" text NOT NULL,
	"sector" text NOT NULL,
	"problem_description" text NOT NULL,
	"budget" "budget" NOT NULL,
	"timeline" timeline NOT NULL,
	"preferred_pillar" "pillar",
	"status" "brief_status" DEFAULT 'pending' NOT NULL,
	"suggested_slots" jsonb,
	"assigned_consultant_id" uuid,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consultants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"sanity_profile_ref" text,
	"cal_event_type_slug" text NOT NULL,
	"pillar_focus" "pillar"[] NOT NULL,
	"expertise_tags" text[] DEFAULT '{}' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" text NOT NULL,
	"persona" "persona" DEFAULT 'unknown' NOT NULL,
	"locale" "locale" DEFAULT 'tr' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sanity_ref" text NOT NULL,
	"slug" text NOT NULL,
	"pillar" "pillar" NOT NULL,
	"pricing" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"stripe_price_id" text,
	"iyzico_product_ref" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"package_id" uuid,
	"booking_id" uuid,
	"provider" "payment_provider" NOT NULL,
	"provider_id" text NOT NULL,
	"currency" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"succeeded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "persona_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" text NOT NULL,
	"signal" text NOT NULL,
	"weight" real DEFAULT 1 NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "popup_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" uuid,
	"persona" "popup_persona" NOT NULL,
	"problems" text[] NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"email" text,
	"company" text,
	"title" text,
	"submission_type" text NOT NULL,
	"kvkk_consent_at" timestamp with time zone,
	"locale" "locale" NOT NULL,
	"cal_com_booking_id" text,
	"email_sent_at" timestamp with time zone,
	"user_agent" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tool_invocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"tool_name" text NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"error" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"locale" "locale" DEFAULT 'tr' NOT NULL,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_reminders" ADD CONSTRAINT "booking_reminders_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_consultant_id_consultants_id_fk" FOREIGN KEY ("consultant_id") REFERENCES "public"."consultants"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_brief_id_briefs_id_fk" FOREIGN KEY ("brief_id") REFERENCES "public"."briefs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "brief_attachments" ADD CONSTRAINT "brief_attachments_brief_id_briefs_id_fk" FOREIGN KEY ("brief_id") REFERENCES "public"."briefs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "briefs" ADD CONSTRAINT "briefs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "briefs" ADD CONSTRAINT "briefs_assigned_consultant_id_consultants_id_fk" FOREIGN KEY ("assigned_consultant_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "consultants" ADD CONSTRAINT "consultants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "persona_signals" ADD CONSTRAINT "persona_signals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "popup_submissions" ADD CONSTRAINT "popup_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tool_invocations" ADD CONSTRAINT "tool_invocations_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tool_invocations" ADD CONSTRAINT "tool_invocations_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_actor_idx" ON "audit_events" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_resource_idx" ON "audit_events" USING btree ("resource_type","resource_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_cal_uid_idx" ON "bookings" USING btree ("cal_uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_user_idx" ON "bookings" USING btree ("user_id","start_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_consultant_idx" ON "bookings" USING btree ("consultant_id","start_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings" USING btree ("status","start_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "briefs_user_idx" ON "briefs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "briefs_status_idx" ON "briefs" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "consultants_slug_idx" ON "consultants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "consultants_active_order_idx" ON "consultants" USING btree ("active","display_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversations_session_idx" ON "conversations" USING btree ("session_id","started_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_conversation_idx" ON "messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "packages_slug_idx" ON "packages" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "packages_sanity_ref_idx" ON "packages" USING btree ("sanity_ref");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packages_pillar_active_idx" ON "packages" USING btree ("pillar","active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payments_provider_id_idx" ON "payments" USING btree ("provider","provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_user_idx" ON "payments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "persona_signals_session_idx" ON "persona_signals" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "persona_signals_user_idx" ON "persona_signals" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_email" ON "popup_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_persona" ON "popup_submissions" USING btree ("persona");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_created" ON "popup_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tool_invocations_tool_idx" ON "tool_invocations" USING btree ("tool_name","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" USING btree ("role");