import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela para armazenar criativos gerados
 */
export const creatives = mysqlTable("creatives", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nicho: text("nicho").notNull(),
  publico: text("publico").notNull(),
  objetivo: varchar("objetivo", { length: 50 }).notNull(),
  consciencia: varchar("consciencia", { length: 50 }).notNull(),
  tom: varchar("tom", { length: 50 }).notNull(),
  headline: text("headline").notNull(),
  textoAnuncio: text("textoAnuncio").notNull(),
  cta: text("cta").notNull(),
  anguloEmocional: text("anguloEmocional").notNull(),
  ideiaCreativo: text("ideiaCreativo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Creative = typeof creatives.$inferSelect;
export type InsertCreative = typeof creatives.$inferInsert;

/**
 * Tabela para armazenar produtos analisados no modo automatico
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  productName: text("productName").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceType: varchar("sourceType", { length: 50 }).notNull(),
  targetAudience: text("targetAudience").notNull(),
  mainPain: text("mainPain").notNull(),
  mainBenefit: text("mainBenefit").notNull(),
  centralPromise: text("centralPromise").notNull(),
  communicationTone: varchar("communicationTone", { length: 50 }).notNull(),
  headline: text("headline").notNull(),
  textoAnuncio: text("textoAnuncio").notNull(),
  cta: text("cta").notNull(),
  anguloEmocional: text("anguloEmocional").notNull(),
  ideiaCreativo: text("ideiaCreativo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
