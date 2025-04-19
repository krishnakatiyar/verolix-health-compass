
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Chat = () => {
  const { userProfile } = useApp();
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([
    { text: `Hi ${userProfile.name}! I'm your Verolix health assistant. How can I help you today?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call Supabase Edge Function for chat
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: userMessage,
          userProfile: {
            name: userProfile.name,
            age: userProfile.age,
            gender: userProfile.gender,
            healthConditions: userProfile.healthConditions,
            fitnessGoal: userProfile.fitnessGoal
          }
        },
      });
      
      if (error) {
        console.error("Error from Edge Function:", error);
        throw new Error(error.message);
      }
      
      console.log("Response from Edge Function:", data);
      
      if (data?.response) {
        setMessages(prev => [...prev, { text: data.response, sender: 'ai' }]);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response format from AI');
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                className={`flex max-w-[80%] items-start gap-2 ${
                  message.sender === 'user' 
                    ? 'bg-verolix-purple text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-gray-100 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                } px-4 py-2`}
              >
                {message.sender === 'user' ? (
                  <User className="h-5 w-5 mt-1" />
                ) : (
                  <Bot className="h-5 w-5 mt-1" />
                )}
                <span className="whitespace-pre-wrap">{message.text}</span>
              </div>
            </div>
          ))}
          
          {isLoading && (
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
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="bg-verolix-purple hover:bg-verolix-dark-purple"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Chat;
