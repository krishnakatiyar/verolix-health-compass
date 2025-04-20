
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Dumbbell, Apple, MessageSquare, User } from 'lucide-react';
import Profile from '@/pages/Profile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, userProfile } = useApp();
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  
  const handleTabChange = (tab: 'home' | 'fitness' | 'nutrition' | 'chat') => {
    if (tab === 'home' && showProfileSheet) {
      setShowProfileSheet(false);
    }
    setActiveTab(tab);
  };
  
  const handleProfileClick = () => {
    setShowProfileSheet(!showProfileSheet);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* App Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/49363888-4af3-4aa1-801d-e7c51151645e.png" 
            alt="App Logo" 
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-xl font-bold text-verolix-purple">Verolix</h1>
        </div>
        
        <Button variant="ghost" className="rounded-full" onClick={handleProfileClick}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-verolix-purple text-white">
              {userProfile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {showProfileSheet ? <Profile /> : children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around py-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center px-4 ${activeTab === 'home' ? 'text-verolix-purple' : 'text-gray-500'}`}
          onClick={() => handleTabChange('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center px-4 ${activeTab === 'fitness' ? 'text-verolix-purple' : 'text-gray-500'}`}
          onClick={() => handleTabChange('fitness')}
        >
          <Dumbbell className="h-5 w-5" />
          <span className="text-xs mt-1">Fitness</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center px-4 ${activeTab === 'nutrition' ? 'text-verolix-purple' : 'text-gray-500'}`}
          onClick={() => handleTabChange('nutrition')}
        >
          <Apple className="h-5 w-5" />
          <span className="text-xs mt-1">Nutrition</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center px-4 ${activeTab === 'chat' ? 'text-verolix-purple' : 'text-gray-500'}`}
          onClick={() => handleTabChange('chat')}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Chat</span>
        </Button>
      </nav>
    </div>
  );
};

export default AppLayout;
