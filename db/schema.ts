import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, text, boolean, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(), // Unique identifier for each session
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }), // The ID of the user (foreign key)
    token: text("token").notNull(), // The unique session token
    expiresAt: timestamp("expiresAt").notNull(), // The time when the session expires
    ipAddress: varchar("ipAddress", { length: 45 }), // The IP address of the device (IPv4/IPv6)
    userAgent: text("userAgent"), // The user agent information of the device
    createdAt: timestamp("createdAt").defaultNow().notNull(), // Timestamp of when the session was created
    updatedAt: timestamp("updatedAt").defaultNow().notNull(), // Timestamp of when the session was updated
});

export const account = pgTable("account", {
    id: text("id").primaryKey(), // Unique identifier for each account
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }), // The ID of the user (foreign key)
    accountId: text("accountId").notNull(), // The ID of the account as provided by the SSO or userId
    providerId: text("providerId").notNull(), // The ID of the provider
    accessToken: text("accessToken"), // The access token of the account (optional)
    refreshToken: text("refreshToken"), // The refresh token of the account (optional)
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"), // The time when the access token expires (optional)
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"), // The time when the refresh token expires (optional)
    scope: text("scope"), // The scope of the account (optional)
    idToken: text("idToken"), // The ID token returned from the provider (optional)
    password: text("password"), // The password of the account (optional)
    createdAt: timestamp("createdAt").defaultNow().notNull(), // Timestamp of when the account was created
    updatedAt: timestamp("updatedAt").defaultNow().notNull(), // Timestamp of when the account was updated
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(), // Unique identifier for each verification
    identifier: text("identifier").notNull(), // The identifier for the verification request
    value: text("value").notNull(), // The value to be verified
    expiresAt: timestamp("expiresAt").notNull(), // The time when the verification request expires
    createdAt: timestamp("createdAt").defaultNow().notNull(), // Timestamp of when the verification request was created
    updatedAt: timestamp("updatedAt").defaultNow().notNull(), // Timestamp of when the verification request was updated
});
