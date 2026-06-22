/**
 * config.ts: the only file that access process.env
 */

import { z } from "zod";

const Schema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().int().default(3000),
    DATABASE_URL: z.url(),
  });

export type AppConfig = z.infer<typeof Schema>;

const parsingResult = Schema.safeParse(process.env);
if (!parsingResult.success) {
  const details = parsingResult.error.issues.map((issue: z.core.$ZodIssue) => {
    const fieldName = issue.path.length > 0 ? issue.path.join(".") : "unknown";
    return `${fieldName}: ${issue.message} (received: ${issue.input})`;
  });

  process.stdout.write(
    JSON.stringify({
      level: "fatal",
      error: "INVALID_ENVIRONMENT",
      details,
    }) + "\n"
  );
  process.exit(1);
}

export const config: AppConfig = parsingResult.data;