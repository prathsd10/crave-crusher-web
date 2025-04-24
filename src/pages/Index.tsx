
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Cigarette, Settings, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmokingStats {
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
}

const Index = () => {
  const [cigarettesToday, setCigarettesToday] = useState(0);
  const [quitDate, setQuitDate] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<SmokingStats>({
    cigarettesPerDay: 20,
    pricePerPack: 8.00,
    cigarettesPerPack: 20,
  });
  const [healthProgress, setHealthProgress] = useState({
    bloodPressure: 0,
    carbonMonoxide: 0,
    lungFunction: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedStats = localStorage.getItem('smokingStats');
    const savedQuitDate = localStorage.getItem('quitDate');
    const savedCigarettesToday = localStorage.getItem('cigarettesToday');
    
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedQuitDate) setQuitDate(savedQuitDate);
    if (savedCigarettesToday) setCigarettesToday(parseInt(savedCigarettesToday));
    
    calculateHealthProgress();
  }, [quitDate]);

  const calculateHealthProgress = () => {
    if (!quitDate) return;
    
    const days = Math.floor((new Date().getTime() - new Date(quitDate).getTime()) / (1000 * 3600 * 24));
    
    setHealthProgress({
      bloodPressure: Math.min((days / 14) * 100, 100), // Blood pressure normalizes in ~14 days
      carbonMonoxide: Math.min((days / 2) * 100, 100), // Carbon monoxide levels drop in ~2 days
      lungFunction: Math.min((days / 90) * 100, 100), // Lung function improves in ~90 days
    });
  };

  const calculateMoneySaved = () => {
    if (!quitDate) return 0;
    const days = Math.floor((new Date().getTime() - new Date(quitDate).getTime()) / (1000 * 3600 * 24));
    const costPerCigarette = stats.pricePerPack / stats.cigarettesPerPack;
    return (days * stats.cigarettesPerDay * costPerCigarette).toFixed(2);
  };

  const calculateCigarettesAvoided = () => {
    if (!quitDate) return 0;
    const days = Math.floor((new Date().getTime() - new Date(quitDate).getTime()) / (1000 * 3600 * 24));
    return days * stats.cigarettesPerDay;
  };

  const handleAddCigarette = () => {
    const newCount = cigarettesToday + 1;
    setCigarettesToday(newCount);
    localStorage.setItem('cigarettesToday', newCount.toString());
    toast({
      title: "Cigarette logged",
      description: "Stay strong! Every step counts towards your goal.",
    });
  };

  const handleRemoveCigarette = () => {
    if (cigarettesToday > 0) {
      const newCount = cigarettesToday - 1;
      setCigarettesToday(newCount);
      localStorage.setItem('cigarettesToday', newCount.toString());
    }
  };

  const handleQuitDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setQuitDate(newDate);
    localStorage.setItem('quitDate', newDate);
    toast({
      title: "Quit date updated",
      description: "Your journey to a smoke-free life begins here!",
    });
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newStats = { ...stats, [name]: parseFloat(value) };
    setStats(newStats);
    localStorage.setItem('smokingStats', JSON.stringify(newStats));
  };

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">QuitSmoke Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Days Smoke Free
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {quitDate ? Math.floor((new Date().getTime() - new Date(quitDate).getTime()) / (1000 * 3600 * 24)) : 0}
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Money Saved
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            ${calculateMoneySaved()}
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Cigarette className="h-5 w-5" />
            Cigarettes Avoided
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {calculateCigarettesAvoided()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span>Today's Cigarettes</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemoveCigarette}
                disabled={cigarettesToday === 0}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold">{cigarettesToday}</span>
              <Button variant="outline" size="icon" onClick={handleAddCigarette}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </h2>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          {showSettings ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quitDate">Quit Date</Label>
                <Input
                  id="quitDate"
                  type="date"
                  value={quitDate}
                  onChange={handleQuitDateChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="cigarettesPerDay">Cigarettes per Day</Label>
                <Input
                  id="cigarettesPerDay"
                  name="cigarettesPerDay"
                  type="number"
                  min="1"
                  value={stats.cigarettesPerDay}
                  onChange={handleStatsChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="pricePerPack">Price per Pack ($)</Label>
                <Input
                  id="pricePerPack"
                  name="pricePerPack"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={stats.pricePerPack}
                  onChange={handleStatsChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="cigarettesPerPack">Cigarettes per Pack</Label>
                <Input
                  id="cigarettesPerPack"
                  name="cigarettesPerPack"
                  type="number"
                  min="1"
                  value={stats.cigarettesPerPack}
                  onChange={handleStatsChange}
                  className="w-full"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Health Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Blood Pressure Normalized</span>
              <span>{healthProgress.bloodPressure.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${healthProgress.bloodPressure}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Carbon Monoxide Eliminated</span>
              <span>{healthProgress.carbonMonoxide.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${healthProgress.carbonMonoxide}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Lung Function Improved</span>
              <span>{healthProgress.lungFunction.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${healthProgress.lungFunction}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
