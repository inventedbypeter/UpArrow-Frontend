import { WorkOutlined } from '@mui/icons-material';
import * as React from 'react';
import styled from 'styled-components';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

const PurchaseBlock = styled.div`
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  width: 27rem;
  height: 12rem;
  display: flex;

  .picture img {
    border: solid 0.1rem #dee0e3;
    box-shadow: 0rem 0rem 0.2rem #c4c7cc;
    width: 10rem;
    height: 10rem;
    margin-left: 1rem;
    margin-top: 1rem;
  }

  .ticker {
    margin-left: 2rem;
    margin-top: 1rem;
    font-weight: bold;
  }

  .shares {
    margin-left: 2rem;
    margin-top: 1rem;
    font-weight: bold;
  }

  .profits {
    margin-left: 1.5rem;
    margin-top: 1rem;
    font-weight: bold;
  }
`;

const PurchaseCard = ({ purchase }) => {
  const profitArrow =
    purchase.profit >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );

  const profitTextColor = purchase.profit >= 0 ? 'green' : 'red';

  return (
    <PurchaseBlock>
      <div className='picture'>
        <img src={purchase.logo}></img>
      </div>

      <div className='purchaseInfo'>
        <div className='ticker'>{purchase.ticker}</div>

        <div className='shares'>{purchase.quantity} Shares</div>

        <div className='profits'>
          <p style={{ color: `${profitTextColor}` }}>
            {profitArrow}{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(purchase.profit)}
          </p>
        </div>
        <div>
          <p>
            {'Total Invested: '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(purchase.totalInvested)}
          </p>
        </div>
      </div>
    </PurchaseBlock>
  );
};

export default PurchaseCard;
