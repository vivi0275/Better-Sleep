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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 px-6 pb-6 pt-3 z-50">
      <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200"
            activeClassName="bg-primary/10 text-primary"
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
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
