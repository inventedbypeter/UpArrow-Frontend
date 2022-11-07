import styled from '@emotion/styled';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 32,
          weight: 'bold',
        },
      },
    },
  },
};

const labels = [2018, 2019, 2020, 2021, 2022];

const FinancialsWrapper = styled.div``;

const Financial = ({ item, ...restProps }) => {
  const data = {
    labels,
    datasets: [
      {
        label: item.title,
        data: item.items,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <FinancialsWrapper {...restProps}>
      <Bar options={options} data={data} />
    </FinancialsWrapper>
  );
};

export default Financial;
