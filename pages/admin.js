import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import styled from 'styled-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../apis';
import PriceTable from './PriceTable';

const AdminBlock = styled.div`
  padding: 11rem;
`;

export default function Admin() {
  const { data, isLoading } = useQuery(['config'], api.config.get);
  const [pricesData, setPricesData] = useState();
  const updateConfig = useMutation(api.config.put(pricesData));

  useEffect(() => {
    if (data?.prices) {
      setPricesData(data.prices);
    }
  }, [data]);

  if (isLoading) return null;

  const parsedPriceList = pricesData ? Object.entries(pricesData) : [];
  const tickers = parsedPriceList.map((price) => price[0]);
  const prices = parsedPriceList.map((price) => price[1]);

  return (
    <AdminBlock>
      <select>
        <option>config</option>
      </select>
      <PriceTable
        tickers={tickers}
        prices={prices}
        setPricesData={setPricesData}
      />
      <button
        onClick={() => {
          updateConfig.mutate(pricesData);
        }}
      >
        Save
      </button>
    </AdminBlock>
  );
}
