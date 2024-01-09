import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(import.meta.env.DB_URL || "");
export const db = drizzle(queryClient);
