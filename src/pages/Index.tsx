
import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import Home from './Home';
import Fitness from './Fitness';
import Nutrition from './Nutrition';
import Chat from './Chat';
import Profile from './Profile';

const AppContent = () => {
  const { activeTab, showProfileSheet } = useApp();
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'fitness':
        return <Fitness />;
      case 'nutrition':
        return <Nutrition />;
      case 'chat':
        return <Chat />;
      default:
        return <Home />;
    }
  };
  
  // If profile is being shown, display profile instead of tab content
  if (showProfileSheet) {
    return <Profile />;
  }
  
  return renderContent();
};

const Index = () => {
  return (
    <AppProvider>
      <AppLayout>
        <AppContent />
      </AppLayout>
    </AppProvider>
  );
};

export default Index;
