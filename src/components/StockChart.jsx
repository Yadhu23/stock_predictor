import { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function StockChart({ symbol, predictedPrice }) {
    const chartData = useMemo(() => {
        const labels = ['Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Prediction (Today)'];
        const basePrice = predictedPrice * (1 + (Math.random() * 0.1 - 0.05)); // +/- 5% from predicted

        const historicalData = [];
        let currentPrice = basePrice;
        for (let i = 0; i < 5; i++) {
            currentPrice = currentPrice * (1 + (Math.random() * 0.04 - 0.02));
            historicalData.push(currentPrice);
        }

        historicalData.reverse();
        historicalData.push(predictedPrice);

        return {
            labels,
            datasets: [
                {
                    fill: true,
                    label: `${symbol} Price Trend`,
                    data: historicalData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#10b981'],
                    pointRadius: [4, 4, 4, 4, 4, 6],
                    pointBorderColor: '#fff',
                    tension: 0.4,
                },
            ],
        };
    }, [symbol, predictedPrice]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.raw.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function (value) {
                        return '$' + value;
                    },
                },
            },
        },
    };

    return <Line options={options} data={chartData} />;
}
