import { z } from "zod";

export const audienceSchema = z.object({
  account_id: z.string(),
  customaudience_data: z.object({
    name: z.string().min(1, 'please provide name').max(100, 'name should be less than 100 characters'),
    rule: z.object({
      inclusions: z.object({
        operator: z.string().min(1, 'you should set an operator'),
        rules: z.array(
          z.object({
            event_sources: z.array(
              z.object({
                id: z.string().min(1, 'choose one source'),
                type: z.literal("pixel"),
              })
            ),
            retention_seconds: z.union([z.number(), z.string()]),
            filter: z.object({
              operator: z.string().optional(),
              filters: z.array(
                z.object({
                  field: z.string().optional(),
                  operator: z.string().optional(),
                  value: z.array(z.string()).optional(),
                })
              ),
            }),
          })
        ),
      }),
      exclusions: z.object({
        operator: z.string().optional(),
        rules: z.array(
          z.object({
            event_sources: z.array(
              z.object({
                id: z.string().min(1, 'choose one source'),
                type: z.literal("pixel"),
              })
            ),
            retention_seconds: z.union([z.number(), z.string()]),
            filter: z.object({
              operator: z.string().optional(),
              filters: z.array(
                z.object({
                  field: z.string().optional(),
                  operator: z.string().optional(),
                  value: z.array(z.string()).optional(),
                })
              ),
            }),
          })
        ),
      })
    })
  }),
})

export type AudienceData = z.infer<typeof audienceSchema>;