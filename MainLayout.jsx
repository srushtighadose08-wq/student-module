import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';

export const MainLayout = ({ children, activePage, setActivePage, pageTitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    // If screen is mobile/tablet, toggle mobile drawer
    if (window.innerWidth < 1024) {
      setIsMobileDrawerOpen(!isMobileDrawerOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {isMobileDrawerOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isMobileOpen={isMobileDrawerOpen} 
        closeMobileSidebar={closeMobileSidebar} 
      />

      {/* Main Wrapper */}
      <div className={`main-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar 
          pageTitle={pageTitle} 
          toggleSidebar={toggleSidebar} 
          setActivePage={setActivePage} 
        />

        <main className="content-area">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  );
};
