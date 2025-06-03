import { Campaign, CampaignsResponse } from '@/services/campaignService';

export const dummyCampaigns: Campaign[] = [
  {
    id: "238476592387450",
    name: "Summer Sale 2024",
    status: "ACTIVE",
    buying_type: "AUCTION",
    created_time: "2024-03-15T10:30:00Z",
    objective: "LINK_CLICKS"
  },
  {
    id: "238476592387451",
    name: "Brand Awareness Campaign",
    status: "PAUSED",
    buying_type: "RESERVED",
    created_time: "2024-03-14T15:45:00Z",
    objective: "BRAND_AWARENESS"
  },
  {
    id: "238476592387452",
    name: "Product Launch Q2",
    status: "ACTIVE",
    buying_type: "AUCTION",
    created_time: "2024-03-13T09:15:00Z",
    objective: "CONVERSIONS"
  },
  {
    id: "238476592387453",
    name: "Holiday Special",
    status: "ACTIVE",
    buying_type: "RESERVED",
    created_time: "2024-03-12T14:20:00Z",
    objective: "REACH"
  },
  {
    id: "238476592387454",
    name: "Customer Retention",
    status: "PAUSED",
    buying_type: "AUCTION",
    created_time: "2024-03-11T11:00:00Z",
    objective: "LEAD_GENERATION"
  },
  {
    id: "238476592387455",
    name: "Mobile App Install",
    status: "ACTIVE",
    buying_type: "AUCTION",
    created_time: "2024-03-10T08:45:00Z",
    objective: "APP_INSTALLS"
  },
  {
    id: "238476592387456",
    name: "Video Views Campaign",
    status: "ACTIVE",
    buying_type: "RESERVED",
    created_time: "2024-03-09T16:30:00Z",
    objective: "VIDEO_VIEWS"
  },
  {
    id: "238476592387457",
    name: "Store Traffic Boost",
    status: "PAUSED",
    buying_type: "AUCTION",
    created_time: "2024-03-08T13:15:00Z",
    objective: "STORE_TRAFFIC"
  },
  {
    id: "238476592387458",
    name: "Catalog Sales",
    status: "ACTIVE",
    buying_type: "RESERVED",
    created_time: "2024-03-07T11:20:00Z",
    objective: "CATALOG_SALES"
  },
  {
    id: "238476592387459",
    name: "Event Promotion",
    status: "ACTIVE",
    buying_type: "AUCTION",
    created_time: "2024-03-06T09:45:00Z",
    objective: "EVENT_RESPONSES"
  },
  {
    id: "238476592387460",
    name: "Message Campaign",
    status: "PAUSED",
    buying_type: "RESERVED",
    created_time: "2024-03-05T14:30:00Z",
    objective: "MESSAGES"
  },
  {
    id: "238476592387461",
    name: "Local Awareness",
    status: "ACTIVE",
    buying_type: "AUCTION",
    created_time: "2024-03-04T10:15:00Z",
    objective: "LOCAL_AWARENESS"
  }
];

export const dummyCampaignsResponse: CampaignsResponse = {
  count: dummyCampaigns.length,
  next: null,
  previous: null,
  results: dummyCampaigns
}; 