import React from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';

const InvestorCardWrapper = styled.div`
  border: solid 0.1rem #dee0e3;
  width: 44rem;
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

const InvestorCard = ({
  investorId,
  investorAvatar,
  investorName,
  totalInvestment,
  totalProfits,
  totalAssets,
}) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const totalProfitTextColor = totalProfits >= 0 ? 'green' : 'red';
  const totalProfitArrow =
    totalProfits >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );
  const totalAssetsTextColor = totalProfits >= 0 ? 'green' : 'red';

  const seeInvestor = () => {
    if (user) {
      localStorage.setItem('userTokenEmail', user.email);
      var investorStrId = String(investorId);
      localStorage.setItem('investorStrId', investorStrId);
      router.push('/investor');
    } else {
      router.push('/api/auth/login');
    }
  };

  const totalProfitPercentage = (totalProfits / totalInvestment) * 100;

  return (
    <InvestorCardWrapper
      onClick={() => seeInvestor()}
      investorAvatar={investorAvatar}
      totalProfitTextColor={totalProfitTextColor}
      totalAssetsTextColor={totalAssetsTextColor}
    >
      <div className='investorImg'>
        <img className='avatar' alt={investorName} src={investorAvatar} />
      </div>

      <div className='investorInfo'>
        <div className='investorName'>{investorName}</div>
        <p>
          Total Investment: ${new Intl.NumberFormat().format(totalInvestment)}
        </p>
        <p className='totalProfits'>
          Total Profits: ${new Intl.NumberFormat().format(totalProfits)} (
          {totalProfitArrow}{' '}
          {new Intl.NumberFormat().format(totalProfitPercentage)}%)
        </p>
        <p className='totalAssets'>
          Total Assets: ${new Intl.NumberFormat().format(totalAssets)}
        </p>
      </div>
    </InvestorCardWrapper>
  );
};

export default InvestorCard;
