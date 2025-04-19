
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { RefreshCw, UtensilsCrossed } from 'lucide-react';

const Nutrition = () => {
  const { meals, addMeal, dietGoal, nutritionTip, refreshTips, updateDietGoal } = useApp();
  const [showMealForm, setShowMealForm] = useState(false);
  
  // Form state
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState('Breakfast');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  
  // Prepare data for macro pie chart
  const macroData = [
    { name: 'Carbs', value: dietGoal.carbsPercentage, color: '#a3e635' },
    { name: 'Protein', value: dietGoal.proteinPercentage, color: '#9b87f5' },
    { name: 'Fat', value: dietGoal.fatPercentage, color: '#d97706' },
  ];
  
  // Calculate today's total nutrients
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysMeals = meals.filter(meal => {
    const mealDate = new Date(meal.date);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === today.getTime();
  });
  
  const totalNutrients = todaysMeals.reduce((acc, meal) => {
    return {
      calories: acc.calories + meal.calories,
      carbs: acc.carbs + meal.carbs,
      protein: acc.protein + meal.protein,
      fat: acc.fat + meal.fat,
    };
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
  
  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const caloriesNum = parseInt(calories);
    const carbsNum = parseInt(carbs);
    const proteinNum = parseInt(protein);
    const fatNum = parseInt(fat);
    
    if (isNaN(caloriesNum) || isNaN(carbsNum) || isNaN(proteinNum) || isNaN(fatNum)) return;
    
    addMeal({
      name: mealName,
      calories: caloriesNum,
      carbs: carbsNum,
      protein: proteinNum,
      fat: fatNum,
      time: mealTime,
      date: new Date()
    });
    
    // Reset form
    setMealName('');
    setMealTime('Breakfast');
    setCalories('');
    setCarbs('');
    setProtein('');
    setFat('');
    setShowMealForm(false);
  };
  
  // Handler for diet goal change
  const handleDietGoalChange = (type: 'Weight Loss' | 'Muscle Gain' | 'Balanced Health') => {
    const goals = {
      'Weight Loss': {
        type: 'Weight Loss',
        caloriesPerDay: 1800,
        carbsPercentage: 40,
        proteinPercentage: 30,
        fatPercentage: 30,
      },
      'Muscle Gain': {
        type: 'Muscle Gain',
        caloriesPerDay: 2500,
        carbsPercentage: 45,
        proteinPercentage: 35,
        fatPercentage: 20,
      },
      'Balanced Health': {
        type: 'Balanced Health',
        caloriesPerDay: 2200,
        carbsPercentage: 45,
        proteinPercentage: 30,
        fatPercentage: 25,
      },
    };
    
    updateDietGoal(goals[type]);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Nutrition & Diet</h2>
        <p className="text-muted-foreground">Personalized diet plans and meal tracking</p>
      </div>
      
      <Card className="p-5 border border-verolix-purple border-opacity-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">AI Nutrition Tip</h3>
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
          <p className="text-sm">{nutritionTip}</p>
        </div>
      </Card>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Diet Goal</h3>
        <div className="flex gap-2">
          <Button
            variant={dietGoal.type === 'Weight Loss' ? 'default' : 'outline'}
            onClick={() => handleDietGoalChange('Weight Loss')}
            className={dietGoal.type === 'Weight Loss' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}
          >
            Weight Loss
          </Button>
          <Button
            variant={dietGoal.type === 'Muscle Gain' ? 'default' : 'outline'}
            onClick={() => handleDietGoalChange('Muscle Gain')}
            className={dietGoal.type === 'Muscle Gain' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}
          >
            Muscle Gain
          </Button>
          <Button
            variant={dietGoal.type === 'Balanced Health' ? 'default' : 'outline'}
            onClick={() => handleDietGoalChange('Balanced Health')}
            className={dietGoal.type === 'Balanced Health' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}
          >
            Balanced Health
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium text-sm mb-3">Daily Calories</h4>
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-2xl font-bold">{totalNutrients.calories}</span>
              <span className="text-xs text-gray-500">consumed</span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-medium">{dietGoal.caloriesPerDay}</span>
              <span className="text-xs text-gray-500">target</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-medium text-sm mb-2">Macros Distribution</h4>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Today's Meals</h3>
          <Button 
            onClick={() => setShowMealForm(!showMealForm)}
            className="bg-verolix-purple hover:bg-verolix-dark-purple text-sm px-3 py-1 h-8"
          >
            {showMealForm ? 'Cancel' : 'Add Meal'}
          </Button>
        </div>
        
        {showMealForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-4 p-4 bg-gray-50 rounded-md">
            <div>
              <Label htmlFor="meal-name">Meal Name</Label>
              <Input 
                id="meal-name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Oatmeal with Berries"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="meal-time">Meal Time</Label>
              <Select 
                value={mealTime}
                onValueChange={setMealTime}
              >
                <SelectTrigger id="meal-time">
                  <SelectValue placeholder="Select meal time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 350"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input 
                  id="carbs"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="e.g. 45"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input 
                  id="protein"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="e.g. 20"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input 
                  id="fat"
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="e.g. 10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-verolix-purple hover:bg-verolix-dark-purple"
            >
              Save Meal
            </Button>
          </form>
        )}
        
        {todaysMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <UtensilsCrossed className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No meals logged today</p>
            <Button 
              variant="link" 
              className="text-verolix-purple mt-1"
              onClick={() => setShowMealForm(true)}
            >
              Add your first meal
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysMeals.map((meal) => (
              <div key={meal.id} className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{meal.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{meal.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{meal.calories}</span>
                    <span className="text-xs text-gray-500 ml-1">cal</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Carbs: {meal.carbs}g</span>
                  <span>Protein: {meal.protein}g</span>
                  <span>Fat: {meal.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Nutrition;
