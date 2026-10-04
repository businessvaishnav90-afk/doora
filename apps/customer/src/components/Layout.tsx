import { Outlet, NavLink } from 'react-router-dom';
import { Home, ClipboardList, Tag, User } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav glass-panel">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink 
          to="/bookings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ClipboardList size={24} />
          <span>Bookings</span>
        </NavLink>
        
        <NavLink 
          to="/offers" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Tag size={24} />
          <span>Offers</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
