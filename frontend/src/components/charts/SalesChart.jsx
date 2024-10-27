import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the required components
ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const SalesChart = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [12000, 19000, 30000, 50000, 20000, 30000, 45000],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Orders',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y1',
            }
        ]
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Sales (in USD)'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // Avoid grid lines from being drawn for the second axis
                },
                title: {
                    display: true,
                    text: 'Orders'
                }
            }
        }
    };

    return (
        <>
            <Line data={data} options={options} />
        </>
    );
}

export default SalesChart;
