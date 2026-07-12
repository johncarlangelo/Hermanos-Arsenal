import { useState, useEffect } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion } from 'motion/react';
import greetingsData from '../data/greetings.json';

const getGreetingPool = () => {
  const date = new Date();
  const hours = date.getHours();
  const day = date.getDay(); 

  let pool = [];

  // Add generic and anyTime
  pool.push(...greetingsData.official.generic);
  pool.push(...greetingsData.custom.anyTime);

  // Time-based
  if (hours >= 5 && hours < 9) {
    pool.push(...greetingsData.custom.earlyMorning);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('morning')));
  } else if (hours >= 9 && hours < 12) {
    pool.push(...greetingsData.custom.midMorning);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('morning')));
  } else if (hours >= 12 && hours < 14) {
    pool.push(...greetingsData.custom.midday);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('afternoon')));
  } else if (hours >= 14 && hours < 18) {
    pool.push(...greetingsData.custom.afternoon);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('afternoon')));
  } else if (hours >= 18 && hours < 21) {
    pool.push(...greetingsData.custom.earlyEvening);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('evening')));
  } else if (hours >= 21 || hours < 0) {
    pool.push(...greetingsData.custom.night);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('evening') || g.toLowerCase().includes('night')));
  } else if (hours >= 0 && hours < 5) {
    pool.push(...greetingsData.custom.lateNight);
    pool.push(...greetingsData.official.timeBased.filter(g => g.toLowerCase().includes('night')));
  }

  // Day based
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[day];
  
  const dayGreetings = greetingsData.official.dayBased.filter(g => {
    if ((todayName === 'Friday' || todayName === 'Saturday' || todayName === 'Sunday') && g.toLowerCase().includes('weekend')) {
       return true;
    }
    return g.toLowerCase().includes(todayName.toLowerCase());
  });
  
  pool.push(...dayGreetings);

  return pool;
};

const renderGreetingTemplate = (greetingTemplate, username) => {
  if (!username && greetingTemplate.includes('{name}')) {
    greetingTemplate = greetingTemplate.replace(/,? \{name\}|\{name\} /g, '');
  }
  
  const parts = greetingTemplate.split('{name}');
  if (parts.length === 1) return <>{greetingTemplate}</>;
  
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-theme-primary">{username}</span>}
        </span>
      ))}
    </>
  );
};

export default function GreetingClock({ username }) {
  const [time, setTime] = useState(new Date());
  const [greetingTemplate, setGreetingTemplate] = useState('Welcome');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pool = getGreetingPool();
    if (pool.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGreetingTemplate(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [username]); // Refresh greeting when username changes or component mounts

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center mb-10 text-center"
    >
      <div className="text-sm font-medium text-theme-text-secondary uppercase tracking-[0.2em] mb-3">
        {dateString}
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-2">
        {timeString}
      </h2>
      <p className="text-xl text-theme-text/80 font-medium mt-2">
        {renderGreetingTemplate(greetingTemplate, username)}
      </p>
    </motion.div>
  );
}
