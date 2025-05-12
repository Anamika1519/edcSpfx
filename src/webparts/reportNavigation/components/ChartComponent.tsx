// ChartComponent.tsx
import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartComponentProps {
    NCArray: any[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ NCArray }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    // const uniqueCategories = Array.from(new Set(NCArray.map(item => item.Category?.Title || 'Unknown')));
    // const categoryCounts = uniqueCategories.map(category => 
    //     NCArray.reduce((count, item) => item.Category?.Title === category ? count + 1 : count, 0)
    // );

    const titleCountMap: { [title: string]: number } = {};

    NCArray.forEach(item => {
        item.Category.forEach((category:any) => {
            const title = category.Title;
            titleCountMap[title] = (titleCountMap[title] || 0) + 1;
        });
    });

    // Unique titles array
    const uniqueTitles = Object.keys(titleCountMap);

    // Count per title
    // const countArray = uniqueTitles.map(title => ({
    //     title,
    //     count: titleCountMap[title]
    // }));
    const counts = uniqueTitles.map(title => titleCountMap[title]);

    console.log("Unique Titles:", uniqueTitles);
    console.log("Title Counts:", counts);



    useEffect(() => {
        if (!chartRef.current) return;

        const myChart = new Chart(chartRef.current, {
            type: 'bar', // 'line', 'pie', etc.
            data: {
                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
                labels: uniqueTitles,
                datasets: [{
                    label: 'Statistics:',
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54,162,235,1)',
                        'rgba(255,206,86,1)',
                        'rgba(75,192,192,1)',
                        'rgba(153,102,255,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            myChart.destroy(); // Clean up
        };
    }, [NCArray]);

    return <canvas ref={chartRef} />;
};

export default ChartComponent;
