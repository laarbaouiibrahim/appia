import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Server, Mail, Settings, User, BarChart2 } from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  const isActive = (path: string) =>
    location === path || (location === "/" && path === "/deliverability");

  return (
    <aside className="bg-gradient-to-b from-primary-900 to-primary-800 text-grean w-16 md:w-64 flex-shrink-0 flex flex-col shadow-lg">
      <div className="flex items-center justify-center md:justify-start h-20 px-6 border-b border-primary-700/50 bg-primary-950/20">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-grean" />
          <div>
            <span className="hidden md:block text-xl font-bold text-black">
              EmailMarketer
            </span>
            <span className="block md:hidden text-xl font-bold text-black">
              EM
            </span>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              href="/deliverability"
              className={`flex items-center w-full p-3 rounded-lg text-grean ${isActive("/deliverability") ? "bg-primary-700/70 shadow-md" : "hover:bg-primary-700/40"} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 transition-all duration-200`}
            >
              <Server className="h-5 w-5 text-green" />
              <span className="ml-3 hidden md:block font-medium text-black">
                Deliverability
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/campaign"
              className={`flex items-center w-full p-3 rounded-lg text-green ${isActive("/campaign") ? "bg-primary-700/70 shadow-md" : "hover:bg-primary-700/40"} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 transition-all duration-200`}
            >
              <Mail className="h-5 w-5 text-green" />
              <span className="ml-3 hidden md:block font-medium text-black">
                Campaign
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center w-full p-3 rounded-lg text-green ${isActive("/settings") ? "bg-primary-700/70 shadow-md" : "hover:bg-primary-700/40"} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 transition-all duration-200`}
            >
              <Settings className="h-5 w-5 text-green" />
              <span className="ml-3 hidden md:block font-medium text-black">
                Settings
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className={`flex items-center w-full p-3 rounded-lg text-green ${isActive("/account") ? "bg-primary-700/70 shadow-md" : "hover:bg-primary-700/40"} focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 transition-all duration-200`}
            >
              <User className="h-5 w-5 text-green" />
              <span className="ml-3 hidden md:block font-medium text-black">
                Account
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-primary-700/50 bg-primary-950/20 m-2 rounded-lg">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
            <span className="font-semibold text-black">JD</span>
          </div>
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-black">John Doe</p>
            <p className="text-xs text-black">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
