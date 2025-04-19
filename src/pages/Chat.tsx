
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';

// Sample AI responses for the chat
const sampleResponses = [
  "Based on your profile, I'd recommend focusing on strength training 3 times per week to help achieve your fitness goals.",
  "To improve your sleep quality, try avoiding screen time at least 1 hour before bed and maintain a consistent sleep schedule.",
  "For your goal of building muscle, aim for 1.6-2.2g of protein per kg of body weight daily.",
  "When experiencing muscle soreness, gentle stretching and adequate hydration can help speed up recovery.",
  "Your current step count is good! Research shows that 7,000-8,000 steps daily provides most health benefits.",
  "To prevent workout plateaus, consider changing your routine every 4-6 weeks by adjusting exercises, sets, or intensity."
];

const Chat = () => {
  const { userProfile } = useApp();
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([
    { text: `Hi ${userProfile.name}! I'm your Verolix health assistant. How can I help you today?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">AI Health Assistant</h2>
        <p className="text-muted-foreground">Ask me anything about health and fitness</p>
      </div>
      
      <Card className="flex-grow p-4 flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto mb-4 space-y-3">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-verolix-purple text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-gray-100 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                } px-4 py-2`}
              >
                <div className="mr-2">
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <span>{message.text}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <span className="inline-block">
                  <span className="dot-typing"></span>
                </span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about exercise, diet, sleep..."
            className="flex-grow"
          />
          <Button 
            type="submit"
            className="bg-verolix-purple hover:bg-verolix-dark-purple"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Chat;
