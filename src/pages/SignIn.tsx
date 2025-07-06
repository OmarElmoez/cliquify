import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token) {
      navigate('/connections', {replace: true})
    }
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Cliquify</h1>
          <p className="text-gray-600">Sign in to continue to your dashboard</p>
        </div>
        
        <div className="space-y-4 flex justify-center">
          <GoogleSignInButton />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 