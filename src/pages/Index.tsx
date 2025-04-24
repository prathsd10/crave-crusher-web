
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MinusCircle, Cigarette } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [cigarettesToday, setCigarettesToday] = useState(0);
  const [quitDate, setQuitDate] = useState<string>("");
  const [daysSmokeFreeStat, setDaysSmokeFreeStat] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from localStorage
    const savedQuitDate = localStorage.getItem('quitDate');
    const savedCigarettesToday = localStorage.getItem('cigarettesToday');
    const savedDailyCigarettes = localStorage.getItem('dailyCigarettes');
    const savedPricePerPack = localStorage.getItem('pricePerPack');
    
    if (savedQuitDate) setQuitDate(savedQuitDate);
    if (savedCigarettesToday) setCigarettesToday(parseInt(savedCigarettesToday));
    
    // Calculate days smoke free and money saved
    if (savedQuitDate && savedDailyCigarettes && savedPricePerPack) {
      const days = Math.floor((new Date().getTime() - new Date(savedQuitDate).getTime()) / (1000 * 3600 * 24));
      setDaysSmokeFreeStat(days > 0 ? days : 0);
      
      const cigarettesPerDay = parseInt(savedDailyCigarettes);
      const pricePerPack = parseFloat(savedPricePerPack);
      const cigarettesPerPack = 20;
      const moneySavedCalc = (days * cigarettesPerDay * (pricePerPack / cigarettesPerPack));
      setMoneySaved(moneySavedCalc > 0 ? moneySavedCalc : 0);
    }
  }, []);

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

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">QuitSmoke Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Days Smoke Free</h2>
          <p className="text-3xl font-bold text-green-600">{daysSmokeFreeStat}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Money Saved</h2>
          <p className="text-3xl font-bold text-blue-600">
            ${moneySaved.toFixed(2)}
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Cigarettes Today</h2>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemoveCigarette}
              disabled={cigarettesToday === 0}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Cigarette className="h-6 w-6" />
              <span className="text-3xl font-bold">{cigarettesToday}</span>
            </div>
            <Button variant="outline" size="icon" onClick={handleAddCigarette}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Set Your Quit Date</h2>
          <Input
            type="date"
            value={quitDate}
            onChange={handleQuitDateChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
