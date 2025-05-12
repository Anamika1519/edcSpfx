import * as React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ICircularProgressBarProps {
  value: number; // percentage (0-100)
  text?: string; // optional display text
}

const CircularProgressBar: React.FC<ICircularProgressBarProps> = ({ value, text }) => {
  return (
    <div style={{ width: 120, height: 120 , margin: '10px 0px 0px 75px' }}>
      <CircularProgressbar
        value={value}
        text={text || `${value}%`}
        styles={buildStyles({
          textColor: '#333',
          pathColor: '#6658dd',
          trailColor: '#eee'
        })}
      />
    </div>
  );
};

export default CircularProgressBar;
