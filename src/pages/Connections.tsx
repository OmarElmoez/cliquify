
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockFacebookAccounts = [
  {
    id: 'fb-123',
    name: 'test-ad-account',
    isActive: true,
    connectedBy: '1 person',
    connectedDate: 'April 26, 2025',
    autoTracking: true
  }
];

const mockGoogleAccounts = [
  {
    id: 'g-456',
    name: 'متجر مفهوم الذكرى (1839-975-643)',
    isActive: true,
    connectedBy: '1 person',
    connectedDate: 'April 26, 2025',
    autoTracking: true
  }
];

// Platform Icons
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#1877F2"/>
    <path d="M16.5 12H13.5V9C13.5 8.4 13.95 9 14.55 9H15V6H13.5C11.7 6 10.5 7.2 10.5 9V12H9V15H10.5V22.5H13.5V15H15.75L16.5 12Z" fill="white"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
    <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
    <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0A66C2"/>
    <path d="M7 10H4V20H7V10Z" fill="white"/>
    <path d="M5.5 8.5C6.6 8.5 7.5 7.6 7.5 6.5C7.5 5.4 6.6 4.5 5.5 4.5C4.4 4.5 3.5 5.4 3.5 6.5C3.5 7.6 4.4 8.5 5.5 8.5Z" fill="white"/>
    <path d="M13.5 14.25C13.5 12.75 14.25 11.5 16 11.5C17.75 11.5 18.5 12.75 18.5 14.25V20H21V13.75C21 10.5 19.25 9 17 9C14.75 9 13.5 10.5 13.5 10.5V10H11V20H13.5V14.25Z" fill="white"/>
  </svg>
);

const ConnectAccountModal = () => {
  const handleFacebookConnect = () => {
    const metaOauthUrl = 'https://digihaven.otomatika.tech/meta/oauth/install';
    const popupWindow = window.open(
      metaOauthUrl, 
      'Meta OAuth', 
      'width=600,height=700,resizable=yes,scrollbars=yes,top=100,left=100'
    );
  };

  const handleGoogleConnect = () => {
    const googleOauthUrl = 'https://digihaven.otomatika.tech/google/oauth/install';
    const popupWindow = window.open(
      googleOauthUrl,
      'Google OAuth',
      'width=600,height=700,resizable=yes,scrollbars=yes,top=100,left=100'
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90">
          Connect account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to Ad Platform</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <button 
            onClick={handleFacebookConnect}
            className="flex flex-col items-center p-4 border rounded-md hover:bg-brand-grey-20 transition-colors"
          >
            <FacebookIcon />
            <span className="mt-2 text-sm">Facebook</span>
          </button>
          <button 
            onClick={handleGoogleConnect}
            className="flex flex-col items-center p-4 border rounded-md hover:bg-brand-grey-20 transition-colors"
          >
            <GoogleIcon />
            <span className="mt-2 text-sm">Google</span>
          </button>
          <button className="flex flex-col items-center p-4 border rounded-md hover:bg-brand-grey-20 transition-colors">
            <LinkedInIcon />
            <span className="mt-2 text-sm">LinkedIn</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AccountsTable = ({ accounts, platform }) => {
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="flex items-center p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          {platform === 'facebook' && <FacebookIcon />}
          {platform === 'google' && <GoogleIcon />}
          <h3 className="font-medium">
            {platform === 'facebook' ? 'Facebook' : 'Google Ads'}
          </h3>
        </div>
        <div className="ml-auto">
          <Button variant="link" className="text-brand-blue">
            Edit tracking template
          </Button>
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">AD ACCOUNT</th>
            <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">CONNECTED BY</th>
            <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">CONNECTED DATE</th>
            <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">
              {platform === 'facebook' ? 'LIMIT DATA USE' : ''} 
            </th>
            <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">AUTO TRACKING</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id} className="border-b">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{account.name}</span>
                  <Badge variant="outline" className={`${account.isActive ? 'bg-brand-lightGreen text-brand-green' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </td>
              <td className="py-4 px-4">{account.connectedBy}</td>
              <td className="py-4 px-4">{account.connectedDate}</td>
              <td className="py-4 px-4">
                {platform === 'facebook' && (
                  <Switch checked={false} />
                )}
              </td>
              <td className="py-4 px-4">
                <Switch checked={account.autoTracking} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Connections = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ads</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Ad accounts</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ad accounts"
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <ConnectAccountModal />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Connected by:</span>
          <Button variant="outline" className="text-gray-700">
            Tarek Walid
          </Button>
        </div>
      </div>
      
      <AccountsTable accounts={mockFacebookAccounts} platform="facebook" />
      <div className="mt-8">
        <AccountsTable accounts={mockGoogleAccounts} platform="google" />
      </div>
    </div>
  );
};

export default Connections;
