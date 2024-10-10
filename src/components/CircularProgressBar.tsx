import React from 'react';

interface CircularProgressBarProps {
  percentage: number;       // Progress percentage
  radius?: number;          // Radius of the circle
  strokeWidth?: number;     // Stroke width of the progress
  strokeColor?: string;     // Stroke color for progress
  pathColor?: string;       // Color inside the circular path
  padding?: number;         // Padding between circle and container
  backgroundColor?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage = 0,
  radius = 50,
  strokeWidth = 10,
  strokeColor = '#00bfff',
  pathColor = '#ffffff',
  padding = 5,
  backgroundColor = "#ED4D4D30"
}) => {
  // Normalized radius and circumference
  const normalizedRadius = radius - strokeWidth / 2 - padding;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;



  return (
    <div style={{ position: 'relative', width: `${radius * 2}px`, height: `${radius * 2}px` }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(-90deg)' }} // Rotate to start at the top
      >
        Background Circle
        <circle
          stroke={"none"}
          fill={backgroundColor}
          r={normalizedRadius * 0.8}
          cx={radius}
          cy={radius}
        />
        
        {/* Path Circle */}
        <circle
          stroke={pathColor}
          fill="none"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress Stroke */}
        <circle
          stroke={strokeColor}
          fill="none"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          fontWeight: 'bold',
          color: strokeColor,
        }}
      >
        {`${percentage}%`}
      </div>
    </div>
  );
};

export default CircularProgressBar;
