const getStepFields = (step: string): string[] => {
  switch (step) {
    case 'ad':
      return [
        'account_id',
        'page_id',
        'image_hash',
        'campaign_data.name',
        'campaign_data.status',
        'campaign_data.objective',
        'campaign_data.buying_type',
        'campaign_data.special_ad_categories',
        'post_id',
        'creative_data.name',
        'creative_data.object_story_spec.link_data.link',
        'creative_data.object_story_spec.link_data.message',
        'creative_data.object_story_spec.link_data.description',
        'creative_data.object_story_spec.link_data.call_to_action.type',
        'ad_data.name',
        'ad_data.status',
      ];
    case 'targeting':
      return [
        'adset_id',
        'adset_data.name',
        'adset_data.status',
        'adset_data.start_time',
        'adset_data.end_time',
        'adset_data.optimization_goal',
        'adset_data.billing_event',
        'adset_data.bid_amount',
        'adset_data.bid_strategy',
        'adset_data.targeting.age_min',
        'adset_data.targeting.age_max',
        'adset_data.targeting.genders',
        'adset_data.geo_locations.countries',
      ];
    case 'budget':
      return [
        'adset_data.lifetime_budget',
        'adset_data.daily_budget',
      ];
    default:
      return [];
  }
};

export default getStepFields;