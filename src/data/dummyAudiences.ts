// Initial data
const initialAudiencesData = [
  {
    id: 'aud-1',
    name: 'Website Visitors - Last 30 Days',
    type: 'Website Visitors',
    source: 'Facebook Pixel',
    size: '0',
    status: 'Active'
  },
  {
    id: 'aud-2',
    name: 'Previous Customers',
    type: 'Custom',
    source: 'Uploaded List',
    size: '250',
    status: 'Active'
  },
  {
    id: 'aud-3',
    name: 'Lookalike - 1000',
    type: 'Lookalike',
    source: 'Facebook Pixel',
    size: '1000',
    status: 'Paused'
  },
  {
    id: 'aud-4',
    name: 'Lookalike - 1000',
    type: 'Lookalike',
    source: 'Instagram',
    size: '1000',
    status: 'Active'
  }
];

// Get data from localStorage or use initial data
const getAudiencesData = () => {
  const storedData = localStorage.getItem('audiencesData');
  return storedData ? JSON.parse(storedData) : initialAudiencesData;
};

// Initialize audiencesData with stored or initial data
let audiencesData = getAudiencesData();

export const addNewAudience = (newAudience: {
  id: string;
  name: string;
  type: string;
  source: string;
  size: string;
  status: string;
}) => {
  audiencesData.push(newAudience);
  // Save to localStorage
  localStorage.setItem('audiencesData', JSON.stringify(audiencesData));
};

export const resetAudiencesData = () => {
  audiencesData = [...initialAudiencesData];
  localStorage.setItem('audiencesData', JSON.stringify(audiencesData));
};

export default audiencesData;
