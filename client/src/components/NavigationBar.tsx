import { useNavigate, useLocation } from "react-router-dom";
import { Home, Hand, TreePine } from "lucide-react";
import { useState } from "react";
import TapModal from "./TapModal";

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTapModal, setShowTapModal] = useState(false);

  const navItems = [
    { 
      path: "/", 
      icon: Home, 
      label: "Home",
      color: "text-green-600",
      action: () => navigate("/")
    },
    { 
      path: "/tap", 
      icon: Hand, 
      label: "Tap",
      color: "text-blue-600",
      action: () => setShowTapModal(true)
    },
    { 
      path: "/forest", 
      icon: TreePine, 
      label: "Forest",
      color: "text-emerald-600",
      action: () => navigate("/forest")
    }
  ];

  const handleCategorySelect = (category: string) => {
    console.log("Selected category:", category);
    // Here you can add logic to handle the category selection
    // For example, open a whisper creation modal or navigate to a specific page
    setShowTapModal(false);
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm border-t border-green-100 px-4 py-2">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, color, action }) => {
            const isActive = location.pathname === path;
            
            return (
              <button
                key={path}
                onClick={action}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                  isActive 
                    ? `${color} scale-110` 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-100 shadow-lg shadow-blue-200/50' 
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}>
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-600'} />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tap Modal */}
      <TapModal
        isOpen={showTapModal}
        onClose={() => setShowTapModal(false)}
        onSelectCategory={handleCategorySelect}
      />
    </>
  );
}