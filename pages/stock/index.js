import styled from '@emotion/styled';
import { useState } from 'react';
import { MainLayout } from '../../Layouts';
import { Body14Medium, HeadH1Bold, HeadH5Bold } from '../../styles/typography';
import color from '../../styles/color';
import Image from 'next/image';
import Viewmore from '../../components/common/Viewmore';

const StockBlock = styled.div`
  padding-top: 3.2rem;
  header {
    padding: 1.6rem 3.2rem;
  }
  h1 {
    ${HeadH1Bold}
  }

  .order-option-wrapper {
    padding: 0.8rem 3.2rem;
    display: flex;
    gap: 0.8rem;
    margin-bottom: 4rem;
  }

  .order-chip {
    padding: 0.8rem 1.6rem;
    background: white;
    color: black;
    border-radius: 999rem;
    border: 0.1rem solid black;
    cursor: pointer;

    &.selected {
      background: black;
      color: white;
    }
  }

  .table-wrapper {
    padding: 0 3.2rem;
  }

  table {
    width: 100%;
    margin-bottom: 3.2rem;
    thead {
      th {
        ${Body14Medium}
        color: ${color.B40};
        text-align: left;
        padding-bottom: 1.6rem;
      }
      border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
    }

    .number {
      width: 13rem;
      vertical-align: middle;
      font-weight: 500;
      font-size: 1.8rem;
      line-height: 2.2rem;
    }
    tbody {
      &:before {
        content: '-';
        display: block;
        line-height: 0.8rem;
        color: transparent;
      }
      tr {
        border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
      }
    }
  }

  .name-ticker {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2.4rem;
    ${HeadH5Bold}

    .image-container {
      padding: 1.2rem 0.8rem;
    }

    .image-wrapper {
      position: relative;
      width: 5.6rem;
      height: 5.6rem;
    }
  }

  .view-more-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2.4rem;
  }
  .view-more {
    width: 24rem;
  }
`;

const orderOptions = ['Popular', 'Trending', 'Market Cap'];

function Home({ stocks }) {
  const [orderOption, setOrderOption] = useState();
  return (
    <StockBlock>
      <header>
        <h1>Stocks</h1>
      </header>
      <nav className='order-option-wrapper'>
        {orderOptions.map((order) => (
          <div
            className={`order-chip ${order === orderOption ? 'selected' : ''}`}
            onClick={() => setOrderOption(order)}
            key={order}
          >
            {order}
          </div>
        ))}
      </nav>
      <div className='table-wrapper'>
        <table>
          <thead>
            <th>Name/Ticker</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Ideas</th>
            <th>Comments</th>
          </thead>
          <tbody>
            {stocks?.map((stock) => (
              <tr>
                <td>
                  <div className='name-ticker'>
                    <div className='image-container'>
                      <div className='image-wrapper'>
                        <Image
                          src={stock.logoUrl}
                          layout='fill'
                          alt={stock.name}
                        />
                      </div>
                    </div>
                    <p>
                      {stock.name} / {stock.ticker}
                    </p>
                  </div>
                </td>
                <td className='number'>${stock.price.toLocaleString()}</td>
                <td className='number'>${stock.marketCap.toLocaleString()}T</td>
                <td className='number'>{stock.buyer.toLocaleString()}</td>
                <td className='number'>{stock.seller.toLocaleString()}</td>
                <td className='number'>{stock.ideas.toLocaleString()}</td>
                <td className='number'>{stock.comments.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='view-more-wrapper'>
        <Viewmore className='view-more' />
      </div>
    </StockBlock>
  );
}

export default function StockPage(props) {
  return (
    <MainLayout>
      <Home {...props} />
    </MainLayout>
  );
}

export function getServerSideProps() {
  const fixtureStocks = [
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
    {
      logoUrl: '/images/apple.png',
      name: 'Apple',
      ticker: 'AAPL',
      price: 151.32,
      marketCap: 2.26,
      buyer: 2302,
      seller: 924,
      ideas: 104,
      comments: 3324,
    },
  ];

  return {
    props: {
      stocks: fixtureStocks,
    },
  };
}
