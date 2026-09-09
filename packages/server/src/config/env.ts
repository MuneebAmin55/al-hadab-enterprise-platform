import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  JWT_SECRET: z.string().default("alhadab_sovereign_enterprise_secret_key_2026_98383"),
  JWT_REFRESH_SECRET: z.string().default("alhadab_refresh_secure_random_key_2026_8383"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
});

export const ENV = EnvSchema.parse(process.env);
