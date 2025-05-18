// AppLayout.js
import React, { useState } from 'react';
import SideMenu from './SideMenu';
import Income from '../pages/Dashboard/Home';
import Expense from './Pages/Dashboard/Expense';
import Dashboard from './Pages/Dashboard/Dashboard';

function AppLayout() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderContent = () => {
    switch (activeMenu.toLowerCase()) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <Income />;
      case 'expense':
        return <Expense />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <SideMenu activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
}

export default AppLayout;
