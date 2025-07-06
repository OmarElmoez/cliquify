import { signInWithGoogle } from "@/services/authService";

const GoogleSignInButton = () => {
  return (
    <button
      onClick={signInWithGoogle}
      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.07-10.34 7.07-17.676z" fill="#4285F4"/>
          <path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.5v6.22C6.46 43.78 14.7 48 24.48 48z" fill="#34A853"/>
          <path d="M11.02 28.52c-.48-1.44-.76-2.98-.76-4.52s.28-3.08.76-4.52v-6.22H2.5A23.97 23.97 0 000 24c0 3.98.96 7.76 2.5 11.22l8.52-6.7z" fill="#FBBC05"/>
          <path d="M24.48 9.54c3.54 0 6.68 1.22 9.16 3.62l6.86-6.86C36.4 2.14 30.96 0 24.48 0 14.7 0 6.46 4.22 2.5 10.78l8.52 6.22c1.9-5.68 7.2-9.9 13.46-9.9z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton; 