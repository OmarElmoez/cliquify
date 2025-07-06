import { Loader2 } from "lucide-react";

const Loading = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
};

export default Loading;