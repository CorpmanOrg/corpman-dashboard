"use client";

import { ChevronLeft, ChevronRight, Gift, Lightbulb, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function AdvertsCarousel() {
  const [currentAdvert, setCurrentAdvert] = useState(0);

  const adverts = [
    {
      title: "Special Loan Offer",
      description: "Get up to 5% discount on new loans this month. Limited time offer!",
      icon: <Gift className="h-8 w-8" />,
      bgColor: "from-purple-500 to-indigo-600",
      buttonText: "Apply Now",
    },
    {
      title: "Upcoming Webinar",
      description: "Join our financial planning webinar on June 15th at 3 PM.",
      icon: <Megaphone className="h-8 w-8" />,
      bgColor: "from-amber-500 to-orange-600",
      buttonText: "Register",
    },
    {
      title: "New Investment Options",
      description: "Explore our new high-yield investment opportunities starting from $500.",
      icon: <Lightbulb className="h-8 w-8" />,
      bgColor: "from-cyan-500 to-blue-600",
      buttonText: "Learn More",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdvert((prevS) => (prevS + 1) % adverts.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [adverts.length]);

  const goToAdvert = (index: number) => {
    setCurrentAdvert(index);
  };

  const nextAdvert = () => {
    setCurrentAdvert((prevS) => (prevS + 1) % adverts.length);
  };

  const prevsAdvert = () => {
    setCurrentAdvert((prevS) => (prevS - 1 + adverts.length) % adverts.length);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:border-t-green-600 overflow-hidden dark:shadow-green-900/10 dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
        <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Announcement</CardTitle>
        <div className="flex space-x-1">
          {adverts.map((__, index) => (
            <button
              key={index}
              onClick={() => goToAdvert(index)}
              className={`w-2 h-2 rounded-full ${
                currentAdvert === index ? "bg-[#19d21f] dark:bg-green-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
              aria-label={`Go to advert ${index + 1}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden">
          <div
            className={`p-6 bg-gradient-to-r ${adverts[currentAdvert].bgColor} text-white transition-all duration-500 ease-in-out`}
          >
            <div className="flex items-start">
              <div className="bg-white/20 p-3 rounded-full mr-4">{adverts[currentAdvert].icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{adverts[currentAdvert].title}</h3>
                <p className="mb-4 text-white/90">{adverts[currentAdvert].description}</p>
                <Button className="bg-white text-gray-800 hover:bg-gray-100">
                  {adverts[currentAdvert].buttonText}
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={prevsAdvert}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1 text-white transition-colors"
            aria-label="Previous advert"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextAdvert}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1 text-white transition-colors"
            aria-label="Next advert"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 bg-[#f9fdf9] dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className=" text-xs text-gray-500 dark:text-gray-400">
            Ad {currentAdvert + 1} 0f {adverts.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Rotates every 20 seconds</span>
        </div>
      </CardContent>
    </Card>
  );
}
