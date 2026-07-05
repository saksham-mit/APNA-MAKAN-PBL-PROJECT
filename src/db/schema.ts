import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).notNull().default("buyer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  propertyType: varchar("property_type", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  area: integer("area").notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  parking: integer("parking").notNull().default(0),
  furnished: varchar("furnished", { length: 20 }).notNull().default("Unfurnished"),
  amenities: text("amenities").notNull().default(""),
  builderName: varchar("builder_name", { length: 100 }).notNull().default(""),
  imageUrls: text("image_urls").notNull().default("[]"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  message: text("message").notNull(),
  propertyId: integer("property_id").references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wishlist table for buyers to save favorite properties
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  propertyId: integer("property_id")
    .references(() => properties.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table for buyer-seller communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id)
    .notNull(),
  propertyId: integer("property_id")
    .references(() => properties.id)
    .notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(), // message, wishlist, enquiry
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  relatedId: integer("related_id"), // property or message id
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
