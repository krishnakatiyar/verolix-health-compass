
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Scale, Ruler, Heart } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock weight data for the chart
const weightData = [
  { date: 'Apr 10', weight: 76.2 },
  { date: 'Apr 12', weight: 76.0 },
  { date: 'Apr 14', weight: 75.7 },
  { date: 'Apr 16', weight: 75.5 },
  { date: 'Apr 18', weight: 75.2 },
  { date: 'Apr 20', weight: 75.0 },
];

const Profile = () => {
  const { userProfile, updateUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age.toString());
  const [gender, setGender] = useState(userProfile.gender);
  const [height, setHeight] = useState(userProfile.height.toString());
  const [weight, setWeight] = useState(userProfile.weight.toString());
  const [fitnessGoal, setFitnessGoal] = useState(userProfile.fitnessGoal);
  const [healthConditions, setHealthConditions] = useState(userProfile.healthConditions.join(', '));
  
  // Calculate BMI
  const getBMI = (): number => {
    const heightInMeters = userProfile.height / 100;
    return userProfile.weight / (heightInMeters * heightInMeters);
  };
  
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  };
  
  const bmi = getBMI();
  const bmiCategory = getBMICategory(bmi);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
    const weightNum = parseInt(weight);
    
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) return;
    
    updateUserProfile({
      name,
      age: ageNum,
      gender,
      height: heightNum,
      weight: weightNum,
      healthConditions: healthConditions.split(',').map(c => c.trim()).filter(c => c !== ''),
      fitnessGoal,
    });
    
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-muted-foreground">Manage your health information</p>
      </div>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-verolix-purple text-white text-xl">
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{userProfile.name}</h3>
              <p className="text-gray-500">{userProfile.age} years old, {userProfile.gender}</p>
            </div>
          </div>
          
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Profile
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={gender}
                  onValueChange={setGender}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="health-conditions">Health Conditions (comma separated)</Label>
                <Input 
                  id="health-conditions"
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                  placeholder="e.g. Asthma, High blood pressure"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="fitness-goal">Fitness Goal</Label>
                <Input 
                  id="fitness-goal"
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  placeholder="e.g. Lose weight, Build muscle"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-verolix-purple hover:bg-verolix-dark-purple"
              >
                Save Profile
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-verolix-dark-purple mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Age</span>
                  <p className="font-medium">{userProfile.age} years</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Ruler className="h-5 w-5 text-verolix-dark-purple mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Height</span>
                  <p className="font-medium">{userProfile.height} cm</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Scale className="h-5 w-5 text-verolix-dark-purple mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Weight</span>
                  <p className="font-medium">{userProfile.weight} kg</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">BMI</h4>
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-verolix-green flex items-center justify-center mr-4">
                    <span className="text-xl font-bold">{bmi.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p className="font-medium">{bmiCategory}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Fitness Goal</h4>
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-verolix-purple mr-3" />
                  <p>{userProfile.fitnessGoal}</p>
                </div>
              </Card>
            </div>
            
            <Card className="p-4">
              <h4 className="font-medium mb-3">Weight Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weightData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
