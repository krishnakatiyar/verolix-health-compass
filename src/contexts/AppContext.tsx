
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our data
export interface HealthStats {
  steps: number;
  caloriesBurned: number;
  sleepHours: number;
  waterIntake: number; // in ml
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  healthConditions: string[];
  fitnessGoal: string;
}

export interface FitnessActivity {
  id: string;
  name: string;
  duration: number; // in minutes
  intensity: 'Low' | 'Medium' | 'High';
  caloriesBurned: number;
  date: Date;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  time: string;
  date: Date;
}

export interface DietGoal {
  type: 'Weight Loss' | 'Muscle Gain' | 'Balanced Health';
  caloriesPerDay: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
}

// App context interface
interface AppContextType {
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Health Stats
  healthStats: HealthStats;
  updateHealthStats: (stats: Partial<HealthStats>) => void;
  
  // Fitness Activities
  fitnessActivities: FitnessActivity[];
  addFitnessActivity: (activity: Omit<FitnessActivity, 'id'>) => void;
  
  // Meals and Diet
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  dietGoal: DietGoal;
  updateDietGoal: (goal: DietGoal) => void;
  
  // Active tab management
  activeTab: 'home' | 'fitness' | 'nutrition' | 'chat';
  setActiveTab: (tab: 'home' | 'fitness' | 'nutrition' | 'chat') => void;
  
  // AI tips (mock for now)
  behaviorTip: string;
  fitnessTip: string;
  nutritionTip: string;
  refreshTips: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleUserProfile: UserProfile = {
  name: 'Alex Johnson',
  age: 32,
  gender: 'Male',
  height: 178,
  weight: 75,
  healthConditions: [],
  fitnessGoal: 'Build muscle and improve overall fitness',
};

const sampleHealthStats: HealthStats = {
  steps: 7580,
  caloriesBurned: 320,
  sleepHours: 6.5,
  waterIntake: 1800,
};

const sampleFitnessActivities: FitnessActivity[] = [
  {
    id: '1',
    name: 'Running',
    duration: 30,
    intensity: 'Medium',
    caloriesBurned: 280,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
  },
  {
    id: '2',
    name: 'Weight Training',
    duration: 45,
    intensity: 'High',
    caloriesBurned: 320,
    date: new Date(),
  },
];

const sampleMeals: Meal[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    carbs: 45,
    protein: 12,
    fat: 8,
    time: 'Breakfast',
    date: new Date(),
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 410,
    carbs: 20,
    protein: 38,
    fat: 15,
    time: 'Lunch',
    date: new Date(),
  },
];

const sampleDietGoal: DietGoal = {
  type: 'Balanced Health',
  caloriesPerDay: 2200,
  carbsPercentage: 45,
  proteinPercentage: 30,
  fatPercentage: 25,
};

// Sample tips
const behaviorTips = [
  "Based on your sleep patterns, try going to bed 30 minutes earlier to improve recovery.",
  "Your step count is good! Try to maintain at least 7,000 steps daily for optimal health.",
  "Consider taking short 5-minute breaks every hour to reduce sedentary behavior.",
  "Your water intake is below target. Try setting reminders to drink water throughout the day."
];

const fitnessTips = [
  "For your fitness goal, consider adding 1-2 more strength training sessions per week.",
  "Your intensity levels are good. Try incorporating interval training for better results.",
  "Consider adding more recovery days between high-intensity workouts.",
  "Based on your activities, adding more flexibility training would benefit your overall fitness."
];

const nutritionTips = [
  "Try increasing your protein intake to support your muscle building goals.",
  "Consider adding more vegetables to your meals for essential micronutrients.",
  "Your current meal pattern looks balanced. Try to maintain this consistency.",
  "Consider having smaller, more frequent meals to maintain energy levels throughout the day."
];

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleUserProfile);
  const [healthStats, setHealthStats] = useState<HealthStats>(sampleHealthStats);
  const [fitnessActivities, setFitnessActivities] = useState<FitnessActivity[]>(sampleFitnessActivities);
  const [meals, setMeals] = useState<Meal[]>(sampleMeals);
  const [dietGoal, setDietGoal] = useState<DietGoal>(sampleDietGoal);
  const [activeTab, setActiveTab] = useState<'home' | 'fitness' | 'nutrition' | 'chat'>('home');
  
  // AI tips (randomized for demo)
  const [behaviorTip, setBehaviorTip] = useState<string>(behaviorTips[0]);
  const [fitnessTip, setFitnessTip] = useState<string>(fitnessTips[0]);
  const [nutritionTip, setNutritionTip] = useState<string>(nutritionTips[0]);

  // Update user profile
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  // Update health stats
  const updateHealthStats = (stats: Partial<HealthStats>) => {
    setHealthStats(prev => ({ ...prev, ...stats }));
  };

  // Add fitness activity
  const addFitnessActivity = (activity: Omit<FitnessActivity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    setFitnessActivities(prev => [newActivity, ...prev]);
  };

  // Add meal
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  // Update diet goal
  const updateDietGoal = (goal: DietGoal) => {
    setDietGoal(goal);
  };

  // Refresh tips (randomly select new ones)
  const refreshTips = () => {
    const randomBehaviorTip = behaviorTips[Math.floor(Math.random() * behaviorTips.length)];
    const randomFitnessTip = fitnessTips[Math.floor(Math.random() * fitnessTips.length)];
    const randomNutritionTip = nutritionTips[Math.floor(Math.random() * nutritionTips.length)];
    
    setBehaviorTip(randomBehaviorTip);
    setFitnessTip(randomFitnessTip);
    setNutritionTip(randomNutritionTip);
  };

  // Context value
  const value: AppContextType = {
    userProfile,
    updateUserProfile,
    healthStats,
    updateHealthStats,
    fitnessActivities,
    addFitnessActivity,
    meals,
    addMeal,
    dietGoal,
    updateDietGoal,
    activeTab,
    setActiveTab,
    behaviorTip,
    fitnessTip,
    nutritionTip,
    refreshTips,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
