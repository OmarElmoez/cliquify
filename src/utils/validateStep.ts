import { StepType } from "@/pages/CreateCampaign";
import { CampaignData } from "@/schemas/campaignSchema";

/**
 * Validates the current step of the campaign creation process.
 * @param step - The current step ('ad', 'targeting', or 'budget')
 * @param getFormValues - A function that returns the current form values
 * @returns An object with validation result and optional error message
 */
export function validateStep(
  step: StepType,
  getFormValues: () => CampaignData
): { valid: boolean; error?: string } {
  const values = getFormValues();

  switch (step) {
    case 'ad':
      if (!values.campaign_id && !values.campaign_data.name) {
        return {
          valid: false,
          error: 'Plese select an existing campaign or create a new one'
        }
      }

      // Check for campaign_data fields if creating new campaign
      if (!values.campaign_id && values.campaign_data) {
        const campaign = values.campaign_data;
        if (!campaign.name || campaign.name.trim() === "") {
          return {
            valid: false,
            error: "Campaign name is required."
          }
        }
        // if (!campaign.status || campaign.status.trim() === "") {
        //   return {
        //     valid: false,
        //     error: "Campaign status is required."
        //   }
        // }
        if (!campaign.objective || campaign.objective.trim() === "") {
          return {
            valid: false,
            error: "Campaign objective is required."
          }
        }
        // if (!campaign.buying_type || campaign.buying_type.trim() === "") {
        //   return {
        //     valid: false,
        //     error: "Campaign buying type is required."
        //   }
        // }
        // special_ad_categories is optional, so no need to check
      }
      if (!values.creative_id && !values.creative_data.name) {
        return {
          valid: false,
          error: 'Please select an existing ad or create a new one.',
        };
      }

      // If no creative_id and creative_data exists, check required fields
      if (!values.creative_id && values.creative_data) {
        const creative = values.creative_data;
        // Check creative_data.name
        if (!creative.name || creative.name.trim() === "") {
          return {
            valid: false,
            error: "Creative name is required.",
          };
        }

        // if (!values.image_hash) {
        //   return {
        //     valid: false,
        //     error: "you should provide an image"
        //   }
        // }

        const linkData = creative.object_story_spec.link_data;
        // Check link
        if (!linkData.link || linkData.link.trim() === "") {
          return {
            valid: false,
            error: "Creative link is required.",
          };
        }
        // Check message
        // if (!linkData.message || linkData.message.trim() === "") {
        //   return {
        //     valid: false,
        //     error: "Creative message is required.",
        //   };
        // }
        // Check description
        // if (!linkData.description || linkData.description.trim() === "") {
        //   return {
        //     valid: false,
        //     error: "Creative description is required.",
        //   };
        // }
        // Check call_to_action.type
        if (!linkData.call_to_action) {
          return {
            valid: false,
            error: "Creative call to action is required.",
          };
        }
      }
      return { valid: true }

    case 'targeting':
      // required => name, Optimization Goal, Billing Event, Bid Strategy, Location

      if (!values.adset_id && !values.adset_data.name) {
        return {
          valid: false,
          error: 'Plese select an existing ad set or create a new one'
        }
      }

      if (!values.adset_id && values.adset_data) {
        const adset = values.adset_data;

        if (!adset.name || adset.name.trim() === "") {
          return {
            valid: false,
            error: "Ad set name is required."
          }
        }

        if (!adset.optimization_goal) {
          return {
            valid: false,
            error: "Optimization goal is required.",
          };
        }

        if (!adset.billing_event) {
          return {
            valid: false,
            error: "Biling event is required.",
          };
        }

        if (!adset.bid_strategy) {
          return {
            valid: false,
            error: "Bid strategy is required.",
          };
        }

        if (adset.targeting.geo_locations.countries.length === 0) {
          return {
            valid: false,
            error: "Location is required.",
          };
        }

        if (adset.targeting.genders.length === 0) {
          return {
            valid: false,
            error: "Genders is required.",
          };
        }
      }
      return {valid: true}

    case 'budget':
      if (!values.adset_data.lifetime_budget && !values.adset_data.daily_budget) {
        return {
          valid: false,
          error: 'You should set a budget'
        }
      }

      if (values.adset_data.lifetime_budget && !values.adset_data.end_time) {
        return {
          valid: false,
          error: 'You should set an end date&time with lifetime budget'
        }
      }
      return {valid: true}
  }
}
