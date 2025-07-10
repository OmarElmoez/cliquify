import { z } from 'zod';

export const campaignDataSchema = z.object({
  account_id: z.string().min(1, "Account ID is required"),
  page_id: z.string().min(1, "Page ID is required"),
  campaign_id: z.string().optional(),
  creative_id: z.string().optional(),
  adset_id: z.string().optional(),
  image_hash: z.string().optional(),
  campaign_data: z.object({
    name: z.string().max(100, "Campaign name must be less than 100 characters").optional(),
    status: z.string().optional(),
    objective: z.string().optional(),
    buying_type: z.string().optional(),
    special_ad_categories: z.array(z.string()).default([]).optional(),
  }),
  adset_data: z.object({
    name: z.string().max(100, "Ad set name must be less than 100 characters").optional(),
    status: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    optimization_goal: z.string().optional(),
    billing_event: z.string().optional(),
    bid_amount: z.string().optional(),
    bid_strategy: z.string().optional(),
    lifetime_budget: z.number().optional(),
    daily_budget: z.number().optional(),
    targeting: z.object({
      age_min: z.number().optional(),
      age_max: z.number().optional(),
      genders: z.array(z.number()).optional(),
      geo_locations: z.object({
        countries: z.array(z.string()).optional(),
      }),
      targeting_automation: z.object({
        advantage_audience: z.number().optional(),
      }).optional(),
    }),
  }),
  creative_data: z.object({
    name: z.string().max(100, "Creative name must be less than 100 characters").optional(),
    object_story_spec: z.object({
      link_data: z.object({
        link: z.string().optional(),
        message: z.string().max(2000, "Message must be less than 2000 characters").optional(),
        description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
        call_to_action: z.object({
          type: z.string().optional(),
          value: z.object({
            link: z.string()
          })
        }),
      }),
    }),
  }),
  ad_data: z.object({
    name: z.string().min(1, "Ad name is required").max(100, "Ad name must be less than 100 characters"),
    status: z.string().min(1, "Status is required"),
  }),
})

export type CampaignData = z.infer<typeof campaignDataSchema>;


