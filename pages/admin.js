import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import styled from 'styled-components';
import axios from 'axios';

const AdminBlock = styled.div`
  padding-top: 11rem;
`;

export default function Admin({ allStocksResponse }) {
  console.log('allStocksResponse', allStocksResponse);
  const [userDocument, setUserDocument] = useState(null);
  useEffect(() => {
    const adminUserId = localStorage.getItem('adminUserId');
    console.log('adminUserId in admin.js', adminUserId);

    const getUser = async () => {
      const userResponse = await axios.get(
        `http://localhost:4000/api/v1/investor/fetch/userprofile/${adminUserId}`
      );
      console.log('userResponse in admin.js', userResponse);
      setUserDocument(userResponse.data);
    };
    getUser();
  }, []);

  return (
    <AdminBlock>
      <h1>this is the admin page</h1>
      <button>Add a stock</button>
    </AdminBlock>
  );
}

export async function getServerSideProps() {
  const getAllStocks = await axios.get(
    'http://localhost:4000/api/v1/investor/fetch/stocks/allportfolio'
  );

  const allStocksResponse = getAllStocks.data;
  console.log('allStocksResponse in getServerSidePros', allStocksResponse);

  return {
    props: { allStocksResponse },
  };
}
