import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '@/components/shared/Loader';

const MetaCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      // Redirect to connections page on successful OAuth
      navigate('/connections', { replace: true });
    } else {
      // Handle error case - could redirect to error page or back to connections
      console.error('Meta OAuth failed:', searchParams.toString());
      navigate('/connections', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-gray-600">Processing Meta authentication...</p>
      </div>
    </div>
  );
};

export default MetaCallback; 