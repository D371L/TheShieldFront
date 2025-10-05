CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE "business_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"label" varchar(128) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status_id" integer NOT NULL,
	"country_code" char(2) NOT NULL,
	"business_type_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200),
	"metadata" jsonb,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"code" char(2) PRIMARY KEY NOT NULL,
	"name_he" varchar(128) NOT NULL,
	"name_en" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status_id" integer NOT NULL,
	"country_code" char(2) NOT NULL,
	"first_name" varchar(160) NOT NULL,
	"last_name" varchar(160) NOT NULL,
	"slug" varchar(160),
	"metadata" jsonb,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"label" varchar(128) NOT NULL,
	"description" varchar(255),
	"color" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_business_type_id_business_types_id_fk" FOREIGN KEY ("business_type_id") REFERENCES "public"."business_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "businesses_slug_unique" ON "businesses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "businesses_status_idx" ON "businesses" USING btree ("status_id");--> statement-breakpoint
CREATE INDEX "businesses_country_idx" ON "businesses" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "businesses_type_idx" ON "businesses" USING btree ("business_type_id");--> statement-breakpoint
CREATE INDEX "businesses_updated_idx" ON "businesses" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "businesses_name_idx" ON "businesses" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "people_slug_unique" ON "people" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "people_status_idx" ON "people" USING btree ("status_id");--> statement-breakpoint
CREATE INDEX "people_country_idx" ON "people" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "people_updated_idx" ON "people" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "people_name_idx" ON "people" USING btree ("first_name","last_name");
