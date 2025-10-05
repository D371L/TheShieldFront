CREATE UNIQUE INDEX "business_types_slug_unique" ON "business_types" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "statuses_slug_unique" ON "statuses" USING btree ("slug");