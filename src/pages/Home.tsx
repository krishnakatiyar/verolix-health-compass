import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Footprints, 
  Flame, 
  Moon, 
  Droplets,
  GlassWater 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const { healthStats, behaviorTip, refreshTips, updateHealthStats } = useApp();
  const [waterAmount, setWaterAmount] = useState(250); // Default to 250ml
  const { toast } = useToast();

  const handleWaterIntake = () => {
    const newWaterIntake = healthStats.waterIntake + waterAmount;
    updateHealthStats({ waterIntake: newWaterIntake });
    toast({
      title: "Water intake updated",
      description: `Added ${waterAmount}ml of water. Total: ${newWaterIntake}ml`,
    });
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Verolix</h2>
        <p className="text-muted-foreground">Your personal health companion</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Steps Card */}
        <Card className="p-4 bg-verolix-blue bg-opacity-30">
          <div className="flex flex-col items-center justify-center text-center">
            <Footprints className="h-8 w-8 text-verolix-dark-purple mb-2" />
            <span className="text-sm font-medium">Steps</span>
            <span className="text-2xl font-bold">{healthStats.steps.toLocaleString()}</span>
            <Progress className="h-2 mt-2" value={(healthStats.steps / 10000) * 100} />
            <span className="text-xs text-gray-500 mt-1">Goal: 10,000</span>
          </div>
        </Card>
        
        {/* Calories Card */}
        <Card className="p-4 bg-verolix-green bg-opacity-30">
          <div className="flex flex-col items-center justify-center text-center">
            <Flame className="h-8 w-8 text-verolix-dark-purple mb-2" />
            <span className="text-sm font-medium">Calories</span>
            <span className="text-2xl font-bold">{healthStats.caloriesBurned}</span>
            <Progress className="h-2 mt-2" value={(healthStats.caloriesBurned / 500) * 100} />
            <span className="text-xs text-gray-500 mt-1">Goal: 500</span>
          </div>
        </Card>
        
        {/* Sleep Card */}
        <Card className="p-4 bg-verolix-blue bg-opacity-30">
          <div className="flex flex-col items-center justify-center text-center">
            <Moon className="h-8 w-8 text-verolix-dark-purple mb-2" />
            <span className="text-sm font-medium">Sleep</span>
            <span className="text-2xl font-bold">{healthStats.sleepHours} hrs</span>
            <Progress className="h-2 mt-2" value={(healthStats.sleepHours / 8) * 100} />
            <span className="text-xs text-gray-500 mt-1">Goal: 8 hrs</span>
          </div>
        </Card>
        
        {/* Water Card */}
        <Card className="p-4 bg-verolix-green bg-opacity-30 relative">
          <div className="flex flex-col items-center justify-center text-center">
            <Droplets className="h-8 w-8 text-verolix-dark-purple mb-2" />
            <span className="text-sm font-medium">Water</span>
            <span className="text-2xl font-bold">{(healthStats.waterIntake / 1000).toFixed(1)}L</span>
            <Progress className="h-2 mt-2" value={(healthStats.waterIntake / 2500) * 100} />
            <span className="text-xs text-gray-500 mt-1">Goal: 2.5L</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 gap-2"
              >
                <GlassWater className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Track Water Intake</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ml)</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[waterAmount]}
                      onValueChange={(value) => setWaterAmount(value[0])}
                      min={50}
                      max={1000}
                      step={50}
                      className="flex-grow"
                    />
                    <span className="text-sm font-medium w-16">{waterAmount}ml</span>
                  </div>
                </div>
                <Button onClick={handleWaterIntake} className="w-full">
                  Add Water Intake
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      <Card className="p-5 border border-verolix-purple border-opacity-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">AI Behavior Coach</h3>
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
          <p className="text-sm">{behaviorTip}</p>
        </div>
      </Card>

      <Card className="p-5 border-t-4 border-verolix-purple">
        <h3 className="text-lg font-medium mb-2">Daily Goals</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Log your meals</span>
            <span className="text-xs bg-verolix-blue px-2 py-1 rounded">In progress</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Complete 10,000 steps</span>
            <span className="text-xs bg-verolix-green px-2 py-1 rounded">
              {healthStats.steps >= 10000 ? 'Completed' : `${Math.floor(healthStats.steps/100)}% Complete`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Track sleep quality</span>
            <span className="text-xs bg-verolix-green px-2 py-1 rounded">Completed</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
