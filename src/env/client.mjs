// @ts-check
import { clientEnv, clientSchema } from "./schema.mjs";

const parsedClientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
    /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
    errors
) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if (value && "_errors" in value) {
                // eslint-disable-next-line no-underscore-dangle
                return `${name}: ${value._errors.join(", ")}\n`;
            }
            return null;
        })
        .filter(Boolean);

if (!parsedClientEnv.success) {
    // eslint-disable-next-line no-console
    console.error("❌ Invalid environment variables:\n", ...formatErrors(parsedClientEnv.error.format()));
    if (!process.env.SKIP_ENV_VALIDATION) {
        throw new Error("Invalid environment variables");
    }
} else {
    Object.keys(parsedClientEnv.data).forEach((key) => {
        if (!key.startsWith("NEXT_PUBLIC_")) {
            // eslint-disable-next-line no-console
            console.warn(`❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`);
            throw new Error("Invalid public environment variable name");
        }
    });
}

export const env = parsedClientEnv.success ? parsedClientEnv.data : /** @type {any} */ ({});
