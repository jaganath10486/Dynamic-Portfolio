import { z } from 'zod';
import { Sector } from '@enums/sector.enum';

export const holdingsQuerySchema = z.object({
  searchText: z.string().trim().max(100).optional(),
  sectors: z.preprocess(
    (val) =>
      typeof val === 'string' && val
        ? val.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    z.array(z.nativeEnum(Sector)),
  ),
});

export type HoldingsQuery = z.infer<typeof holdingsQuerySchema>;
