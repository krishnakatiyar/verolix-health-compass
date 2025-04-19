
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Clock, Activity } from 'lucide-react';

const Fitness = () => {
  const { fitnessActivities, addFitnessActivity, fitnessTip, refreshTips } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  // Calculate calories based on activity properties
  const calculateCalories = (duration: number, intensity: 'Low' | 'Medium' | 'High'): number => {
    const intensityMultiplier = {
      'Low': 5,
      'Medium': 8,
      'High': 12
    };
    
    return Math.round(duration * intensityMultiplier[intensity]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const durationMinutes = parseInt(duration);
    if (isNaN(durationMinutes) || durationMinutes <= 0) return;
    
    const calories = calculateCalories(durationMinutes, intensity);
    
    addFitnessActivity({
      name: activityName,
      duration: durationMinutes,
      intensity,
      caloriesBurned: calories,
      date: new Date()
    });
    
    // Reset form
    setActivityName('');
    setDuration('');
    setIntensity('Medium');
    setShowForm(false);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Fitness Coach</h2>
        <p className="text-muted-foreground">Track your activities and get personalized advice</p>
      </div>
      
      <Card className="p-5 border border-verolix-purple border-opacity-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">AI Fitness Tip</h3>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={refreshTips}
            className="h-8 w-8 rounded-full"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-verolix-light-gray rounded-md">
          <p className="text-sm">{fitnessTip}</p>
        </div>
      </Card>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-verolix-purple hover:bg-verolix-dark-purple"
        >
          {showForm ? 'Cancel' : 'Add Activity'}
        </Button>
      </div>
      
      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="activity-name">Activity Name</Label>
              <Input 
                id="activity-name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="e.g. Running, Yoga, Weight Training"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="intensity">Intensity</Label>
              <Select 
                value={intensity}
                onValueChange={(val) => setIntensity(val as 'Low' | 'Medium' | 'High')}
              >
                <SelectTrigger id="intensity">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-verolix-purple hover:bg-verolix-dark-purple"
              >
                Save Activity
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="space-y-3">
        {fitnessActivities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{activity.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{activity.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>{activity.intensity}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-lg">{activity.caloriesBurned}</span>
                <p className="text-xs text-gray-500">calories</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Fitness;
