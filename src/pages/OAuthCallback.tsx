import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '@/components/shared/Loader';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresIn = searchParams.get('expires_in');
        const error = searchParams.get('error');

        if (error) {
          setError(`Authentication failed: ${error}`);
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (!accessToken) {
          setError('No access token received');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        // Store tokens
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        if (expiresIn) {
          localStorage.setItem('expires_in', expiresIn);
        }

        console.log('Successfully authenticated with Google');
        
        // Redirect to dashboard
        navigate('/connections', { replace: true });
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Authentication Error</div>
          <div className="text-red-500">{error}</div>
          <div className="text-gray-600 mt-4">Redirecting to sign-in page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback; 