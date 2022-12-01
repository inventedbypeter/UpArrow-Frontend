import React from 'react';
import styled from '@emotion/styled';
import PostCard from '../../components/PostCard';

import axios from 'axios';
import { numberComma } from '../../utils/number';
import InvestorProfile from '../../components/common/InvestorProfile';
import {
  Body14Medium,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from '../../styles/typography';
import color from '../../styles/color';

const InvestorBlock = styled.div`
  display: flex;
`;

const InvestorDataBlock = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.8rem;

  .title {
    ${HeadH3Bold}
    margin-bottom: 2.4rem;
  }

  .portfolio-wrapper {
    width: 100%;
    margin-bottom: 2rem;
    border-bottom: 0.1rem solid ${color.B93};
    .stocks {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;

      .stock {
        border: 0.1rem solid ${color.B93};
        border-radius: 0.8rem;
        padding: 1.2rem 1.6rem;
        width: calc(50% - 0.8rem);
        display: flex;
        gap: 1.6rem;
        align-items: center;

        margin-bottom: 2.4rem;

        .stock-logo {
          width: 7.2rem;
          height: 7.2rem;
        }

        .stock-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          .stock-name {
            ${HeadH5Bold}
          }

          .stock-quantity {
            ${Body14Medium}
            color: ${color.B27}
          }

          .stock-total-value {
            ${HeadH6Bold}
            color: ${color.AGREE_GREEN}
          }
        }
      }
    }

    .view-all {
      display: flex;
      justify-content: center;
      align-items: center;
      ${HeadH6Bold}
      border: 0.1rem solid ${color.B80};
      border-radius: 0.4rem;
      height: 4.4rem;
    }
  }
`;

// -> 한 함수 / 모듈 / 는 한가지 일만 해야한다.  clean code
// Investor : Investor 페이지를 보여주는 일 // 다른 기능들은 다른 파일에서 .

export default function Investor({ investor, stocksWithPrices }) {
  const {
    comments,
    description,
    email,
    followers,
    followings,
    isAdmin,
    likes,
    name,
    password,
    posts,
    profile_image_url,
    // purchases,
    stockPreference,
    totalAssets,
    totalInvestment,
    totalProfits,
    username,
    websiteUrl,
    _id,
  } = investor;

  const availableCash = totalAssets - totalInvestment;
  return (
    <InvestorBlock>
      <InvestorProfile
        profile_image_url={profile_image_url}
        username={username}
        investedCompanies={stocksWithPrices}
        followers={followers}
        followings={followings}
        description={description}
        websiteUrl={websiteUrl}
        availableCash={availableCash}
        totalInvestment={totalInvestment}
        totalProfits={totalProfits}
        totalAssets={totalAssets}
      />
      <InvestorDataBlock>
        <div className='portfolio-wrapper'>
          <div className='title'>{username}'s Portfolio</div>
          <div className='stocks'>
            {stocksWithPrices.map((company) => (
              <div className='stock'>
                <img className='stock-logo' src={company.profile_image_url} />
                <div className='stock-info'>
                  <div className='stock-name'>{company.name}</div>
                  <div className='stock-quantity'>
                    {company.quantity} shares
                  </div>
                  <div className='stock-total-value'>
                    ${numberComma(company.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='view-all'>View All</div>
          <div>
            <div>Warren Buffett's Ideas</div>
            {Array(4)
              .fill(0)
              .map(() => (
                <PostCard
                  theme={'test'}
                  postId={'test'}
                  postImage={'tset'}
                  postTitle={'test'}
                  postAuthor={'test'}
                  postDate={new Date()}
                  stockId={'test'}
                />
              ))}
          </div>
          <div className='view-all'>View All</div>
        </div>
      </InvestorDataBlock>
    </InvestorBlock>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const investor = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${id}`
  );
  const purchaseIds = investor.data.purchases;
  const purchases = (
    await Promise.all(
      purchaseIds?.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/purchase/${id}`)
      )
    )
  ).map((v) => v.data);
  const prices = (
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/config`)
  ).data.prices;
  console.log('prices:  ', prices);

  const stockPurchaseInfos = purchases.reduce((acc, purchase) => {
    if (acc[purchase.stockId]) {
      return {
        ...acc,
        [acc[purchase.stockId]]: {
          ...acc[purchase.stockId],
          id: purchase.stockId,
          quantity: acc[purchase.stockId].quantity + purchase.quantity,
          averagePrice:
            acc[purchase.stockId].averagePrice + purchase.averagePrice,
        },
      };
    }
    return {
      ...acc,
      [purchase.stockId]: {
        id: purchase.stockId,
        quantity: purchase.quantity,
      },
    };
  }, {});

  const stockIds = Object.keys(stockPurchaseInfos);
  const stocks = (
    await Promise.all(
      stockIds.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${id}`)
      )
    )
  ).map((v) => v.data);

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id].quantity * prices[stock.ticker],
    };
  });

  return {
    props: {
      investor: investor.data,
      stocksWithPrices,
    },
  };
}
