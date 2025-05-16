import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartComponentProps {
  UniqNCDept: any[];
}
const DepartmentPieChart: React.FC<ChartComponentProps> = ({ UniqNCDept }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  // Generate N distinct colors using HSL
  const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    const saturation = 70;
    const lightness = 60;
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    // const ctx = document.getElementById('lifetime-sales') as HTMLCanvasElement;

    // if (!ctx) return;

    // if (chartRef.current) {
    //   chartRef.current.destroy();
    // }

    const countMap: { [key: string]: number } = {};
    UniqNCDept.forEach(dep => {
      countMap[dep.Title] = (countMap[dep.Title] || 0) + 1;
    });

    const labels = Object.keys(countMap);      // ['HR', 'Finance', 'IT']
    const data = Object.values(countMap);      // [2, 2, 1]
    // const colors = Array.from({ length: labels.length }, (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`);
    const colors = generateColors(labels.length);


    // new Chart(ctx, {
    chartInstanceRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#333',
              font: {
                size: 14,
                family: 'Segoe UI, sans-serif'
              }
            }
          }
        }
      }
    });
  }, [UniqNCDept]);

  return (
    <canvas ref={canvasRef} style={{ height: '270px' }}></canvas>
    // <canvas id="lifetime-sales" style={{ height: '270px' }}></canvas>
  );
};

export default DepartmentPieChart;
