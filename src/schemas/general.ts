import { z } from "zod";

export const uuidSchema = z.string()
  .refine((val) => {
    const invalidChars = /[^0-9a-fA-F-]/.test(val);
    if (invalidChars) return false;
    
    const withDashes = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const withoutDashes = /^[0-9a-f]{32}$/i.test(val);
    
    return withDashes || withoutDashes;
  }, {
    message: 'uuidInvalid'
  });

export type UUIDSchema = z.infer<typeof uuidSchema>;