import React, { useEffect, useState, Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ProfileModal from './ProfileModal';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import styled from 'styled-components';

const BiocardBlock = styled.div`
  padding-left: 2rem;
  padding-top: 2rem;

  .investor-name-follow-button {
    display: flex;
    align-items: center;
  }

  .investor-name {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
    font-family: lato;
    font-weight: 900;
    margin-right: 3rem;
    display: flex;
  }

  .follow-button {
    background-color: transparent;
    border: solid 0.3rem transparent;
    box-shadow: 0rem 0rem 1rem #c4c7cc;
    border-radius: 0.6rem;
    width: 12rem;
    color: rgb(32, 38, 46);
    font-size: 1.6rem;
    margin-bottom: 2rem;
    font-family: lato;
    font-weight: 900;
    :hover {
      border: 0.3rem solid gray;
    }
  }

  .investor-social {
    display: flex;
    gap: 1rem;
  }
`;

const BioCard = (props) => {
  const [followText, setFollowText] = useState('');
  const followersObjectIdList = props.followersObjectIdList; // a prop of followers ObjectID List from investor.js
  const currentUserStrId = props.currentUserJSON?._id; // currently logged in user from investor.js
  const toggleFollow = followersObjectIdList.includes(currentUserStrId); // Returns either True or False

  useEffect(() => {
    if (toggleFollow) {
      // ㅑf toggleFollow is true, setFollowText to be "Unfollow"
      setFollowText('Unfollow');
    } else {
      // ㅑf toggleFollow is not ture, setFollowText to be "Follow"
      setFollowText('Follow');
    }
  }, [toggleFollow]); // useEffect happens every time toggleFollow changes

  const enableFollow = async () => {
    var currentUserStrId = String(props.currentUserJSON._id);
    var investorStrId = localStorage.getItem('investorStrId');
    await axios.put(
      `http://localhost:4000/api/v1/investor/following/${currentUserStrId}/${investorStrId}`
    ); //  api call to follow/unfollow an investor
    await props.getInvestor(investorStrId); // calling getInvestor function from investor.js
  };

  const seeInvestor = () => {
    console.log('See Investor Clicked');
  };

  const totalProfitTextColor = props.totalProfits >= 0 ? 'green' : 'red';
  const totalProfitArrow =
    props.totalProfits >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );
  const totalAssetsTextColor = props.totalAssets >= 0 ? 'green' : 'red';
  const totalAssetsArrow =
    props.totalAssets >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );
  var modalList = [];
  const purchasesText = props.purchases + ' Invested';
  const followersText = props.followers + ' Followers';
  const followingsText = props.followings + ' Following';
  var modalTitle = '';
  modalList.push(purchasesText);
  modalList.push(followersText);
  modalList.push(followingsText);

  const renderedModalList = modalList.map((text) => {
    var docJSONList = [];
    if (text.indexOf('Invested') != -1) {
      docJSONList = props.stockDocumentList;
      modalTitle = 'Invested';
    }
    if (text.indexOf('Followers') != -1) {
      docJSONList = props.followersDocumentList;
      modalTitle = 'Followers';
    }
    if (text.indexOf('Following') != -1) {
      docJSONList = props.followingsDocumentList;
      modalTitle = 'Following';
    }
    console.log('this is the doc json list', docJSONList);
    return (
      <ProfileModal
        title={text}
        docJSONList={docJSONList}
        currentUserJSONId={props.currentUserJSON?._id}
        modalTitle={modalTitle}
      />
    );
  });

  return (
    <BiocardBlock>
      <div className='investor-name-follow-button'>
        <div className='investor-name'>{props.investorName}</div>
        <div>
          <button className='follow-button'>Follow</button>
        </div>
      </div>

      <div class='investor-social'>{renderedModalList}</div>

      <div class='investor- info'>
        <div>{props.investorDescription}</div>
        <a href={props.investorWebsite}>{props.investorWebsite}</a>
      </div>

      <div class='investor-financials'>
        <div>
          Total Investment: $
          {new Intl.NumberFormat().format(props.totalInvestment)}
        </div>
        <div>
          Total Profits: ${new Intl.NumberFormat().format(props.totalProfits)} (
          {totalProfitArrow}{' '}
          {new Intl.NumberFormat().format(
            Math.floor((props.totalProfits / props.totalInvestment) * 100)
          )}
          %)
        </div>

        {/* <p className="totalProfits">
          Total Profits: ${new Intl.NumberFormat().format(props.totalProfits)} (
          {totalProfitArrow}{" "}
          {new Intl.NumberFormat().format(props.totalProfitPercentage)}%)
        </p> */}

        <div>
          Total Assets: ${new Intl.NumberFormat().format(props.totalAssets)}
        </div>
      </div>

      {/* <Typography onClick={() => seeInvestor()} variant="h5">
              <strong>{props.investorName}</strong> */}

      {/* <Button onClick={() => enableFollow()} variant="outlined">
                {followText}
              </Button> */}

      {/* <Grid container spacing={0.5}>
              {renderedModalList}
            </Grid> */}

      {/* <p>{props.investorDescription}</p> */}

      {/* <Link href={props.investorWebsite}>
              <a>{props.investorWebsite}</a> */}

      {/*           
              Total Investment: $
              {new Intl.NumberFormat().format(props.totalInvestment)} */}

      {/* <p style={{ color: `${totalProfitTextColor}` }}>
              Total Profits: {totalProfitArrow} $
              {new Intl.NumberFormat().format(props.totalProfits)}
            </p> */}

      {/* <p style={{ color: `${totalAssetsTextColor}` }}>
              Total Assets: {totalAssetsArrow} $
              {new Intl.NumberFormat().format(props.totalAssets)}
            </p> */}
    </BiocardBlock>
  );
};

export default BioCard;
