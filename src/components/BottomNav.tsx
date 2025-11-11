import { Home, Clock, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/alarms", icon: Clock, label: "Alarms" },
    { path: "/analytics", icon: BarChart3, label: "Sleep" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card backdrop-blur-2xl border-t border-white/10 px-6 pb-6 pt-3 z-50">
      <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-2xl transition-all duration-300"
            activeClassName="bg-gradient-to-br from-primary/15 to-accent/15 scale-105"
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive 
                    ? 'text-primary drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' 
                    : 'text-muted-foreground'
                }`} />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
