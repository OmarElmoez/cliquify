import { signInWithMeta } from "@/services/authService";

const MetaSignInButton = () => {
  return (
    <button
      onClick={signInWithMeta}
      className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold flex items-center gap-2 shadow"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1877F3"/>
        <path d="M29.5 24H25V36H20V24H17V20H20V17.5C20 14.46 21.79 12 25.5 12H29V16H27C25.9 16 25 16.9 25 18V20H29L28.5 24Z" fill="white"/>
      </svg>
      Sign in with Meta
    </button>
  );
};

export default MetaSignInButton; 