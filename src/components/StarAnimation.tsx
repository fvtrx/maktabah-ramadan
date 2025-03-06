// pages/index.js
import { useEffect, useState } from "react";

type Stars = {
  id: number;
  size: number;
  left: string;
  top: string;

  animationDuration: string;
  animationDelay: string;
};

const StarAnimation = () => {
  const [stars, setStars] = useState<Stars[]>([]);

  useEffect(() => {
    // Generate stars on component mount
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 5}s`,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "white",
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: star.left,
            top: star.top,
            opacity: 0,
            animation: `twinkle ${star.animationDuration} infinite ease-in-out`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default StarAnimation;
