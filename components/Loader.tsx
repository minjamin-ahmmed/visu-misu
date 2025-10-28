import React from "react";
import { Zap } from "lucide-react";

const Loader: React.FC = () => (
  <div className="w-full max-w-2xl absolute top-0 left-1/2 -translate-x-1/2">
    <div className="h-2 bg-teal-900/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div className="h-full bg-gradient-to-r from-teal-400 to-teal-300 animate-pulse-horizontal"></div>
    </div>
    <div className="mt-3 text-center">
      <div className="flex items-center justify-center space-x-2 text-teal-400">
        <Zap className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">Generating your visuals...</span>
      </div>
    </div>
    <style>{`
      @keyframes pulse-horizontal {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-pulse-horizontal {
        animation: pulse-horizontal 2s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default Loader;
