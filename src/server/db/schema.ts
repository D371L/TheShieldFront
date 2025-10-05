import {
  char,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  code: char('code', { length: 2 }).primaryKey(),
  nameHe: varchar('name_he', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
});

export const statuses = pgTable(
  'statuses',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 64 }).notNull(),
    label: varchar('label', { length: 128 }).notNull(),
    description: varchar('description', { length: 255 }),
    color: varchar('color', { length: 32 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusesSlugUnique: uniqueIndex('statuses_slug_unique').on(table.slug),
  })
);

export const businessTypes = pgTable(
  'business_types',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 64 }).notNull(),
    label: varchar('label', { length: 128 }).notNull(),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    businessTypesSlugUnique: uniqueIndex('business_types_slug_unique').on(table.slug),
  })
);

export const people = pgTable(
  'people',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    statusId: integer('status_id')
      .references(() => statuses.id, { onDelete: 'restrict' })
      .notNull(),
    countryCode: char('country_code', { length: 2 })
      .references(() => countries.code, { onDelete: 'restrict' })
      .notNull(),
    firstName: varchar('first_name', { length: 160 }).notNull(),
    lastName: varchar('last_name', { length: 160 }).notNull(),
    slug: varchar('slug', { length: 160 }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    notes: text('notes'),
  },
  (table) => {
    return {
      peopleSlugUnique: uniqueIndex('people_slug_unique').on(table.slug),
      peopleStatusIdx: index('people_status_idx').on(table.statusId),
      peopleCountryIdx: index('people_country_idx').on(table.countryCode),
      peopleUpdatedIdx: index('people_updated_idx').on(table.updatedAt),
      peopleNameIdx: index('people_name_idx').on(table.firstName, table.lastName),
    };
  }
);

export const businesses = pgTable(
  'businesses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    statusId: integer('status_id')
      .references(() => statuses.id, { onDelete: 'restrict' })
      .notNull(),
    countryCode: char('country_code', { length: 2 })
      .references(() => countries.code, { onDelete: 'restrict' })
      .notNull(),
    businessTypeId: integer('business_type_id')
      .references(() => businessTypes.id, { onDelete: 'restrict' })
      .notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 200 }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    notes: text('notes'),
  },
  (table) => {
    return {
      businessesSlugUnique: uniqueIndex('businesses_slug_unique').on(table.slug),
      businessesStatusIdx: index('businesses_status_idx').on(table.statusId),
      businessesCountryIdx: index('businesses_country_idx').on(table.countryCode),
      businessesTypeIdx: index('businesses_type_idx').on(table.businessTypeId),
      businessesUpdatedIdx: index('businesses_updated_idx').on(table.updatedAt),
      businessesNameIdx: index('businesses_name_idx').on(table.name),
    };
  }
);

export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
