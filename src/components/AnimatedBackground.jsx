import { /* eslint-disable-line no-unused-vars */ motion } from 'motion/react';
import { useEffect, useState } from 'react';

const generateCircuitPaths = () => [...Array(25)].map(() => {
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  
  const path = [`M ${startX} ${startY}`];
  let currX = startX;
  let currY = startY;
  
  const segments = Math.floor(2 + Math.random() * 3);
  const isHorizontalFirst = Math.random() > 0.5;
  
  for(let i=0; i<segments; i++) {
    if ((i % 2 === 0 && isHorizontalFirst) || (i % 2 !== 0 && !isHorizontalFirst)) {
      currX += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 15);
      path.push(`L ${currX} ${currY}`);
    } else {
      currY += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 15);
      path.push(`L ${currX} ${currY}`);
    }
  }
  
  return {
    d: path.join(' '),
    startX,
    startY,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * -5,
  };
});

const CyberpunkBackground = () => {
  const [paths] = useState(generateCircuitPaths);
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-50">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {paths.map((p, i) => (
          <g key={i}>
            <motion.path
              d={p.d}
              fill="none"
              stroke="var(--color-theme-primary)"
              strokeWidth="0.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
              style={{ filter: 'drop-shadow(0 0 1px var(--color-theme-primary))' }}
            />
            <motion.circle
              cx={p.startX}
              cy={p.startY}
              r="0.4"
              fill="var(--color-theme-secondary)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [1, 1.5, 1, 1] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
              style={{ filter: 'drop-shadow(0 0 1px var(--color-theme-secondary))' }}
            />
          </g>
        ))}
      </svg>
      {/* Subtle grid in background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(var(--color-theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-theme-primary) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.05,
        transform: 'perspective(600px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
      }} />
    </div>
  );
};

const generateTokyoRain = () => [...Array(50)].map(() => ({
  left: `${Math.random() * 100}%`,
  duration: 0.5 + Math.random() * 1.5,
  delay: Math.random() * -2,
  height: 20 + Math.random() * 60,
  opacity: 0.2 + Math.random() * 0.8
}));

const TokyoNightBackground = () => {
  const [rain] = useState(generateTokyoRain);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-60">
      {rain.map((r, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] rounded-full bg-gradient-to-b from-transparent via-theme-primary to-theme-secondary shadow-[0_0_10px_var(--color-theme-primary)]"
          style={{ left: r.left, height: r.height, opacity: r.opacity }}
          initial={{ y: '-10vh' }}
          animate={{ y: '110vh' }}
          transition={{ duration: r.duration, repeat: Infinity, ease: 'linear', delay: r.delay }}
        />
      ))}
    </div>
  );
};

const generateDraculaBats = () => [...Array(12)].map(() => ({
  size: 20 + Math.random() * 30,
  left: `${-10 + Math.random() * 120}%`,
  top: `${10 + Math.random() * 80}%`,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * -20,
  scaleX: Math.random() > 0.5 ? 1 : -1,
  yMove: (Math.random() - 0.5) * 150
}));

const DraculaBackground = () => {
  const [bats] = useState(generateDraculaBats);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      <div className="absolute inset-0 bg-gradient-to-t from-theme-background to-transparent z-10 opacity-70 pointer-events-none"></div>
      {bats.map((b, i) => (
        <motion.div
          key={i}
          className="absolute text-theme-primary opacity-60"
          style={{ width: b.size, height: b.size, left: b.left, top: b.top }}
          initial={{ x: b.scaleX === 1 ? '-20vw' : '120vw' }}
          animate={{ x: b.scaleX === 1 ? '120vw' : '-20vw', y: [0, b.yMove, 0] }}
          transition={{ 
            x: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay }, 
            y: { duration: b.duration / 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: b.delay } 
          }}
        >
          <div style={{ transform: `scaleX(${b.scaleX})` }} className="w-full h-full drop-shadow-[0_0_8px_var(--color-theme-primary)]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M22 13.52c-.88-1.48-2.62-3.02-4.52-3.02-3.35 0-5.46 3.23-6.48 5.61-.15.35-.35.54-.5.54s-.35-.19-.5-.54C8.98 13.73 6.87 10.5 3.52 10.5 1.62 10.5-.12 12.04-1 13.52c.86-1.02 2.22-1.92 3.52-1.92 1.5 0 2.45.74 3.32 1.68-.65 1.34-.4 2.52.82 2.85 1.02.28 1.88-.45 2.68-1.08 1-.82 1.15-2.25 1.66-2.25.5 0 .66 1.43 1.66 2.25.8.63 1.66 1.36 2.68 1.08 1.22-.33 1.47-1.51.82-2.85.87-.94 1.82-1.68 3.32-1.68 1.3 0 2.66.9 3.52 1.92z"/>
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const generateHighContrastShapes = () => [...Array(15)].map(() => ({
  type: Math.floor(Math.random() * 3),
  size: 20 + Math.random() * 60,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: 10 + Math.random() * 20,
  delay: Math.random() * -20,
  rotate: (Math.random() > 0.5 ? 1 : -1) * 360,
  x1: (Math.random() - 0.5) * 100,
  x2: (Math.random() - 0.5) * 200,
  y1: (Math.random() - 0.5) * 100,
  y2: (Math.random() - 0.5) * 200,
}));

const HighContrastBackground = () => {
  const [shapes] = useState(generateHighContrastShapes);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {shapes.map((s, i) => {
        const isRect = s.type === 0;
        const isTriangle = s.type === 1;
        
        return (
          <motion.div
            key={i}
            className={`absolute border-2 border-theme-primary ${isRect ? '' : isTriangle ? 'border-b-[40px] border-l-[20px] border-r-[20px] border-t-0 border-l-transparent border-r-transparent border-b-theme-primary bg-transparent' : 'rounded-full'}`}
            style={{ 
              width: isTriangle ? 0 : s.size, 
              height: isTriangle ? 0 : s.size, 
              left: s.left, 
              top: s.top,
              backgroundColor: isTriangle ? 'transparent' : 'var(--color-theme-secondary)',
              opacity: 0.5
            }}
            animate={{ 
              rotate: [0, s.rotate], 
              x: [s.x1, s.x2, 0],
              y: [s.y1, s.y2, 0] 
            }}
            transition={{ duration: s.duration, repeat: Infinity, ease: 'linear', delay: s.delay }}
          />
        )
      })}
    </div>
  );
};

const terminalCodeLines = [
  "sudo apt-get update && sudo apt-get upgrade",
  "npm run dev -- --port 3000",
  "import { useState, useEffect } from 'react';",
  "function processData(data) {",
  "  return data.map(item => item.value);",
  "}",
  "git push origin main",
  "docker run -d -p 80:80 nginx",
  "console.log('Hello, World!');",
  "const [count, setCount] = useState(0);",
  "01100010 01101001 01101110 01100001 01110010 01111001",
  "cat /var/log/syslog",
  "ssh root@192.168.1.1",
  "{ status: 'ok', data: [] }",
  "if (process.env.NODE_ENV === 'production')",
  "db.collection('users').find({})",
  "SELECT * FROM users WHERE active = true",
  "export default App;"
];

const generateTerminalLines = () => [...Array(20)].map(() => ({
  text: terminalCodeLines[Math.floor(Math.random() * terminalCodeLines.length)],
  left: `${Math.random() * 80}%`,
  top: `${Math.random() * 95}%`,
  duration: 1 + Math.random() * 2,
  delay: Math.random() * 5,
}));

const TypewriterLine = ({ text, left, top, delay, duration }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout;
    let cursorInterval;
    let index = 0;
    let isMounted = true;

    const type = () => {
      if (!isMounted) return;
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
        timeout = setTimeout(type, (duration / text.length) * 1000);
      } else {
        timeout = setTimeout(() => {
          index = 0;
          if (isMounted) type();
        }, 4000 + Math.random() * 2000);
      }
    };

    const initialDelay = setTimeout(type, delay * 1000);

    cursorInterval = setInterval(() => {
      if (isMounted) setShowCursor(prev => !prev);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearTimeout(initialDelay);
      clearInterval(cursorInterval);
    };
  }, [text, delay, duration]);

  return (
    <div
      className="absolute whitespace-nowrap"
      style={{ left, top }}
    >
      {displayText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
    </div>
  );
};

const TerminalBackground = () => {
  const [lines] = useState(generateTerminalLines);
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 font-mono text-theme-primary text-sm sm:text-base select-none">
      {lines.map((line, i) => (
        <TypewriterLine key={i} {...line} />
      ))}
    </div>
  );
};

const generateBubbles = () => [...Array(25)].map(() => ({
  size: 10 + Math.random() * 50,
  left: `${Math.random() * 100}%`,
  duration: 10 + Math.random() * 15,
  delay: Math.random() * -20,
  xMove: (Math.random() - 0.5) * 100
}));

const BubblesBackground = () => {
  const [bubbles] = useState(generateBubbles);
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-50">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-theme-primary/40 bg-theme-primary/5"
          style={{ width: b.size, height: b.size, left: b.left }}
          initial={{ y: '100vh', opacity: 0, x: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.8, 0], x: b.xMove }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay }}
        />
      ))}
    </div>
  );
};

const generateFlakes = () => [...Array(60)].map(() => ({
  size: 2 + Math.random() * 5,
  left: `${Math.random() * 100}%`,
  duration: 10 + Math.random() * 15,
  delay: Math.random() * -20,
  xMove: (Math.random() - 0.5) * 150
}));

const SnowBackground = () => {
  const [flakes] = useState(generateFlakes);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-60">
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-theme-text/60 shadow-[0_0_10px_var(--color-theme-text)]"
          style={{ width: f.size, height: f.size, left: f.left }}
          initial={{ y: '-10vh', x: 0 }}
          animate={{ y: '100vh', x: f.xMove }}
          transition={{ duration: f.duration, repeat: Infinity, ease: 'linear', delay: f.delay }}
        />
      ))}
    </div>
  );
};

const generateFireflies = () => [...Array(40)].map(() => ({
  size: 2 + Math.random() * 4,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 4,
  xMove: (Math.random() - 0.5) * 150,
  yMove: (Math.random() - 0.5) * 150,
}));

const FirefliesBackground = () => {
  const [fireflies] = useState(generateFireflies);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {fireflies.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-theme-primary shadow-[0_0_12px_var(--color-theme-primary)]"
          style={{ width: f.size, height: f.size, left: f.left, top: f.top }}
          animate={{
            x: f.xMove,
            y: f.yMove,
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: f.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: f.delay }}
        />
      ))}
    </div>
  );
};

const generatePetals = () => [...Array(40)].map(() => ({
  size: 10 + Math.random() * 20,
  left: `${Math.random() * 100}%`,
  duration: 8 + Math.random() * 10,
  delay: Math.random() * -20,
  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
  xMove: (Math.random() - 0.5) * 300
}));

const PetalsBackground = () => {
  const [petals] = useState(generatePetals);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-60">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-theme-primary/50 rounded-tl-full rounded-br-full shadow-sm"
          style={{ width: p.size, height: p.size, left: p.left }}
          initial={{ y: '-10vh', rotate: 0, x: 0 }}
          animate={{ y: '100vh', rotate: p.rotate, x: p.xMove }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
        />
      ))}
    </div>
  );
};

const VaporwaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-[60%] opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(var(--color-theme-secondary) 2px, transparent 2px), linear-gradient(90deg, var(--color-theme-secondary) 2px, transparent 2px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(400px) rotateX(75deg) translateY(50px) translateZ(0)',
          animation: 'vaporGrid 4s linear infinite'
        }} />
      </div>
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-theme-primary to-theme-secondary opacity-60 shadow-[0_0_100px_var(--color-theme-primary)] mix-blend-screen overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-end gap-3 pb-6 opacity-80">
           {[...Array(8)].map((_, i) => (
              <div key={i} className="h-2 bg-theme-background w-full" style={{ opacity: 1 - i * 0.1 }}></div>
           ))}
        </div>
      </div>
      <style>{`
        @keyframes vaporGrid {
          0% { transform: perspective(400px) rotateX(75deg) translateY(0) translateZ(0); }
          100% { transform: perspective(400px) rotateX(75deg) translateY(60px) translateZ(0); }
        }
      `}</style>
    </div>
  );
};

const generateDust = () => [...Array(50)].map(() => ({
  size: 1 + Math.random() * 3,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: 10 + Math.random() * 20,
  delay: Math.random() * -20,
  xMove: (Math.random() - 0.5) * 100,
  yMove: (Math.random() - 0.5) * 100,
}));

const DustBackground = () => {
  const [dust] = useState(generateDust);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-50">
      {dust.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-theme-text/40 shadow-[0_0_5px_var(--color-theme-text)]"
          style={{ width: d.size, height: d.size, left: d.left, top: d.top }}
          animate={{
            x: d.xMove,
            y: d.yMove,
            opacity: [0, 1, 0],
          }}
          transition={{ duration: d.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: d.delay }}
        />
      ))}
    </div>
  );
};

const generateStars = () => [...Array(100)].map(() => ({
  size: Math.random() * 2 + 1,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * -5,
}));

const StarsBackground = () => {
  const [stars] = useState(generateStars);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-70">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-theme-primary/80 shadow-[0_0_8px_var(--color-theme-primary)]"
          style={{ width: s.size, height: s.size, left: s.left, top: s.top }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}
    </div>
  );
};

const generateLeaves = () => [...Array(20)].map(() => ({
  size: 15 + Math.random() * 20,
  left: `${Math.random() * 100}%`,
  duration: 12 + Math.random() * 10,
  delay: Math.random() * -20,
  rotate: (Math.random() > 0.5 ? 1 : -1) * 360,
  xMove: (Math.random() - 0.5) * 200
}));

const LeavesBackground = () => {
  const [leaves] = useState(generateLeaves);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="absolute bg-theme-primary/40 rounded-tl-full rounded-br-full"
          style={{ width: l.size, height: l.size, left: l.left }}
          initial={{ y: '-10vh', rotate: 0, x: 0 }}
          animate={{ y: '100vh', rotate: l.rotate, x: l.xMove }}
          transition={{ duration: l.duration, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
        />
      ))}
    </div>
  );
};

const DefaultOrbs = () => (
  <>
    <motion.div
      animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 0.9, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-theme-primary/20 to-transparent blur-[120px]"
    />
    <motion.div
      animate={{ x: [0, -100, 50, 0], y: [0, 100, -50, 0], scale: [1, 1.1, 0.8, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gradient-to-tl from-theme-secondary/20 to-transparent blur-[150px]"
    />
  </>
);

const IncognitoBackground = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
    <svg viewBox="0 0 16 16" className="w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] text-theme-text" fill="currentColor">
      <path fillRule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/>
    </svg>
  </div>
);

export default function AnimatedBackground({ themeName = '', isPrivateView }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getBackgroundType = () => {
    if (isPrivateView) return 'incognito';

    const name = (themeName || 'midnight glass').toLowerCase();
    
    if (name.includes('cyberpunk')) return 'cyberpunk';
    if (name.includes('tokyo')) return 'tokyo';
    if (name.includes('dracula')) return 'dracula';
    if (name.includes('high contrast')) return 'highContrast';
    
    if (name.includes('terminal') || name.includes('gruvbox')) return 'terminal';
    if (name.includes('ocean') || name.includes('mint')) return 'bubbles';
    if (name.includes('forest') || name.includes('midnight') || name.includes('solarized dark')) return 'fireflies';
    if (name.includes('arctic') || name.includes('nord') || name.includes('slate') || name.includes('noir') || name.includes('monochrome')) return 'snow';
    if (name.includes('cherry') || name.includes('bubblegum') || name.includes('peach') || name.includes('sunset')) return 'petals';
    if (name.includes('vaporwave')) return 'vaporwave';
    
    if (name.includes('mocha') || name.includes('sepia')) return 'dust';
    if (name.includes('lavender')) return 'stars';
    if (name.includes('matcha') || name.includes('solarized light')) return 'leaves';

    return 'default';
  };

  const bgType = getBackgroundType();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-theme-background">
      {!isPrivateView && (
        <motion.div
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 200, mass: 0.5 }}
          className="absolute w-[600px] h-[600px] rounded-full bg-theme-primary/10 blur-[100px] opacity-50"
        />
      )}

      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        {bgType === 'incognito' && <IncognitoBackground />}
        {bgType === 'cyberpunk' && <CyberpunkBackground />}
        {bgType === 'tokyo' && <TokyoNightBackground />}
        {bgType === 'dracula' && <DraculaBackground />}
        {bgType === 'highContrast' && <HighContrastBackground />}
        {bgType === 'terminal' && <TerminalBackground />}
        {bgType === 'bubbles' && <BubblesBackground />}
        {bgType === 'fireflies' && <FirefliesBackground />}
        {bgType === 'snow' && <SnowBackground />}
        {bgType === 'petals' && <PetalsBackground />}
        {bgType === 'vaporwave' && <VaporwaveBackground />}
        {bgType === 'dust' && <DustBackground />}
        {bgType === 'stars' && <StarsBackground />}
        {bgType === 'leaves' && <LeavesBackground />}
        {bgType === 'default' && <DefaultOrbs />}
      </div>

      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50"></div>
    </div>
  );
}
