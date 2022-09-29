import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import styled from 'styled-components';

const InvestorCardWrapper = styled.div`
  border: solid 0.1rem #dee0e3;
  width: 40rem;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 0.6rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }

  .avatar {
    width: 11rem;
    height: 11rem;
    object-fit: cover;
    border-radius: 99.9rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .investorName {
    font-size: 2rem;
    font-weight: bold;
    font-family: lato;
    margin-bottom: 3rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: lato;
    margin-bottom: 0rem;
  }

  .totalProfits {
    color: ${({ totalProfitTextColor }) => totalProfitTextColor};
  }

  .totalAssets {
    color: ${({ totalAssetsTextColor }) => totalAssetsTextColor};
  }
`;

const InvestorCard = (props) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const totalProfitTextColor = props.totalProfits >= 0 ? 'green' : 'red';
  const totalProfitArrow =
    props.totalProfits >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );
  const totalAssetsTextColor = props.totalProfits >= 0 ? 'green' : 'red';

  const seeInvestor = () => {
    if (user) {
      localStorage.setItem('userTokenEmail', user.email);
      var investorStrId = String(props.investorId);
      localStorage.setItem('investorStrId', investorStrId);
      router.push('/investor');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <InvestorCardWrapper
      onClick={() => seeInvestor()}
      investorAvatar={props.investorAvatar}
      totalProfitTextColor={totalProfitTextColor}
      totalAssetsTextColor={totalAssetsTextColor}
    >
      <div className='investorImg'>
        <img
          className='avatar'
          alt={props.investorName}
          src={props.investorAvatar}
        />
      </div>

      <div className='investorInfo'>
        <div className='investorName'>{props.investorName}</div>
        <p>
          Total Investment: $
          {new Intl.NumberFormat().format(props.totalInvestment)}
        </p>
        <p className='totalProfits'>
          Total Profits: ${new Intl.NumberFormat().format(props.totalProfits)} (
          {totalProfitArrow}{' '}
          {new Intl.NumberFormat().format(props.totalProfitPercentage)}%)
        </p>
        <p className='totalAssets'>
          Total Assets: ${new Intl.NumberFormat().format(props.totalAssets)}
        </p>
      </div>
    </InvestorCardWrapper>
  );
};

export default InvestorCard;
