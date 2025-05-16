// ChartComponent.tsx
import React, { useRef, useEffect } from 'react';
// import styles from './chartComponent.scss';
// import { Chart, registerables } from 'chart.js';
import './chartComponent.scss';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts';

// Chart.register(...registerables);


interface ChartComponentProps {
    NCArray: any[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ NCArray }) => {
    //   const openStatuses = ['Rework', 'Save as Draft', 'Pending'];
    //   const closedStatuses = ['Approved', 'Rejected'];
      const COLORS = ['#6A5ACD', '#00CFFF', '#555555']; // Total, Open, Close colors
     
    //   console.log(finalChartData);
      

    // return (

        return (
           
              <div className="chartCard">
               
                {NCArray.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={NCArray}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    //   finalChartData="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" stackId="a" fill={COLORS[0]} name="Total" />
                      <Bar dataKey="open" stackId="a" fill={COLORS[1]} name="Open" />
                      <Bar dataKey="closed" stackId="a" fill={COLORS[2]} name="Close" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="noDataMessage">No category data available</div>
                )}
                {/* <div className="categoryStats">
                  <span>Total: {finalChartData.reduce((sum, c) => sum + c.total, 0)}</span>
                  <span>Open: {finalChartData.reduce((sum, c) => sum + c.open, 0)}</span>
                  <span>Close: {finalChartData.reduce((sum, c) => sum + c.closed, 0)}</span>
                </div> */}
              </div>
           
          );
       
    

}




 // <div style={{ width: '100%', height: 400 }}>
        //   {/* <h2 style={{ textAlign: 'center' }}>Open vs Closed by Category</h2> */}
        //   <ResponsiveContainer>
        //     <BarChart
        //       data={finalChartData}
        //       layout="vertical"
        //       margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        //     >
        //       <CartesianGrid strokeDasharray="3 3" />
        //       <XAxis type="number" />
        //       <YAxis dataKey="name" type="category" />
        //       <Tooltip />
        //       <Legend />
        //       <Bar dataKey="total" stackId="a" fill="#6A5ACD" name="Total" />
        //       <Bar dataKey="open" stackId="a" fill="#8884d8" />
        //       <Bar dataKey="closed" stackId="a" fill="#82ca9d" />
        //     </BarChart>
        //   </ResponsiveContainer>
        // </div>
    //   );



// const ChartComponent: React.FC<ChartComponentProps> = ({ NCArray }) => {
//     const chartRef = useRef<HTMLCanvasElement>(null);

    
//     const titleCountMap: { [title: string]: number } = {};

//     NCArray.forEach(item => {
//         item.Category.forEach((category:any) => {
//             const title = category.Title;
//             titleCountMap[title] = (titleCountMap[title] || 0) + 1;
//         });
//     });

//     // Unique titles array
//     const uniqueTitles = Object.keys(titleCountMap);

    
//     const counts = uniqueTitles.map(title => titleCountMap[title]);

//     console.log("Unique Titles:", uniqueTitles);
//     console.log("Title Counts:", counts);



//     useEffect(() => {
//         if (!chartRef.current) return;

//         const myChart = new Chart(chartRef.current, {
//             type: 'bar', // 'line', 'pie', etc.
//             data: {
//                 // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
//                 labels: uniqueTitles,
//                 datasets: [{
//                     label: 'Statistics:',
//                     data: counts,
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(255,99,132,1)',
//                         'rgba(54,162,235,1)',
//                         'rgba(255,206,86,1)',
//                         'rgba(75,192,192,1)',
//                         'rgba(153,102,255,1)',
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });

//         return () => {
//             myChart.destroy(); // Clean up
//         };
//     }, [NCArray]);

//     return <canvas ref={chartRef} />;
// };

export default ChartComponent;
