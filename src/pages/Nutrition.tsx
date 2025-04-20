import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Clock, Apple } from 'lucide-react';
const Nutrition = () => {
  const {
    meals,
    addMeal,
    dietGoal,
    updateDietGoal,
    nutritionTip,
    refreshTips
  } = useApp();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [mealTime, setMealTime] = useState('Breakfast');
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
    setCalories('');
    setCarbs('');
    setProtein('');
    setFat('');
    setMealTime('Breakfast');
    setShowForm(false);
  };

  // Diet goal selection
  const handleDietGoalChange = (goalType: 'Weight Loss' | 'Muscle Gain' | 'Balanced Health') => {
    let newGoal: typeof dietGoal = {
      ...dietGoal,
      type: goalType
    };

    // Adjust macros based on goal type
    switch (goalType) {
      case 'Weight Loss':
        newGoal = {
          type: 'Weight Loss',
          caloriesPerDay: 1800,
          carbsPercentage: 30,
          proteinPercentage: 40,
          fatPercentage: 30
        };
        break;
      case 'Muscle Gain':
        newGoal = {
          type: 'Muscle Gain',
          caloriesPerDay: 2700,
          carbsPercentage: 45,
          proteinPercentage: 35,
          fatPercentage: 20
        };
        break;
      case 'Balanced Health':
        newGoal = {
          type: 'Balanced Health',
          caloriesPerDay: 2200,
          carbsPercentage: 45,
          proteinPercentage: 30,
          fatPercentage: 25
        };
        break;
    }
    updateDietGoal(newGoal);
  };
  return <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Nutrition Coach</h2>
        <p className="text-muted-foreground">Track your diet and get personalized advice</p>
      </div>
      
      <Card className="p-5">
        <h3 className="text-lg font-medium mb-3">Diet Goal</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button variant={dietGoal.type === 'Weight Loss' ? 'default' : 'outline'} onClick={() => handleDietGoalChange('Weight Loss')} className={dietGoal.type === 'Weight Loss' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}>
            Weight Loss
          </Button>
          <Button variant={dietGoal.type === 'Muscle Gain' ? 'default' : 'outline'} onClick={() => handleDietGoalChange('Muscle Gain')} className={dietGoal.type === 'Muscle Gain' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}>
            Muscle Gain
          </Button>
          <Button variant={dietGoal.type === 'Balanced Health' ? 'default' : 'outline'} onClick={() => handleDietGoalChange('Balanced Health')} className={dietGoal.type === 'Balanced Health' ? 'bg-verolix-purple hover:bg-verolix-dark-purple' : ''}>Balanced</Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Daily Calories Target:</span>
            <span className="font-bold">{dietGoal.caloriesPerDay} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Carbs:</span>
            <span>{dietGoal.carbsPercentage}% ({Math.round(dietGoal.caloriesPerDay * dietGoal.carbsPercentage / 400)}g)</span>
          </div>
          <div className="flex justify-between">
            <span>Protein:</span>
            <span>{dietGoal.proteinPercentage}% ({Math.round(dietGoal.caloriesPerDay * dietGoal.proteinPercentage / 400)}g)</span>
          </div>
          <div className="flex justify-between">
            <span>Fat:</span>
            <span>{dietGoal.fatPercentage}% ({Math.round(dietGoal.caloriesPerDay * dietGoal.fatPercentage / 900)}g)</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-5 border border-verolix-purple border-opacity-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">AI Nutrition Tip</h3>
          <Button size="icon" variant="ghost" onClick={refreshTips} className="h-8 w-8 rounded-full">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-verolix-light-gray rounded-md">
          <p className="text-sm">{nutritionTip}</p>
        </div>
      </Card>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Food Journal</h3>
        <Button onClick={() => setShowForm(!showForm)} className="bg-verolix-purple hover:bg-verolix-dark-purple">
          {showForm ? 'Cancel' : 'Add Meal'}
        </Button>
      </div>
      
      {showForm && <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="meal-name">Meal Name</Label>
              <Input id="meal-name" value={mealName} onChange={e => setMealName(e.target.value)} placeholder="e.g. Oatmeal, Salad" required />
            </div>
            
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input id="calories" type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="e.g. 300" required />
            </div>
            
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="e.g. 40" required />
            </div>
            
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="e.g. 20" required />
            </div>
            
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="e.g. 15" required />
            </div>
            
            <div>
              <Label htmlFor="meal-time">Meal Time</Label>
              <Select value={mealTime} onValueChange={val => setMealTime(val)}>
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
            
            <div className="pt-2">
              <Button type="submit" className="w-full bg-verolix-purple hover:bg-verolix-dark-purple">
                Save Meal
              </Button>
            </div>
          </form>
        </Card>}
      
      <div className="space-y-3">
        {meals.map(meal => <Card key={meal.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{meal.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{meal.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Apple className="h-3 w-3 mr-1" />
                    <span>{meal.calories} calories</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-lg">{meal.protein}g</span>
                <p className="text-xs text-gray-500">protein</p>
              </div>
            </div>
          </Card>)}
      </div>
    </div>;
};
export default Nutrition;