import React, { useEffect, useState, useRef, Fragment } from 'react';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import BioCard from '../components/BioCard';
import PurchaseCard from '../components/PurchaseCard';
import ProfileModal from '../components/ProfileModal';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import PostCard from '../components/PostCard';
import styled from 'styled-components';
import { ConstructionOutlined } from '@mui/icons-material';

const InvestorBlock = styled.div`
  padding-top: 11rem;
  padding-left: 2rem;

  .upper-section {
    display: flex;
    margin-bottom: 2rem;
  }

  .avatar img {
    width: 13rem;
    height: 13rem;
    object-fit: cover;
    border-radius: 99.9rem;
    margin-right: 2rem;
  }

  .middle-section {
    margin-bottom: 2rem;
  }

  .purchase-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .post-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .text {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
    font-family: lato;
    font-weight: 900;
  }
`;

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0rem',
  },
  avatar: {
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
  },
  bio: {
    marginTop: '1.5rem',
  },
}));

export default function Investor({ portfolioList, allUsersListResponse }) {
  console.log('this is portfolioList meow', portfolioList);
  console.log('this is all useslist woof!', allUsersListResponse);
  const classes = useStyles();
  const [investor, setInvestor] = useState(null);

  const [postList, setPostList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [averageList, setAverageList] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const router = useRouter();

  const getInvestor = async (investorStrId) => {
    var userEmail = localStorage.getItem('userTokenEmail');
    if (userEmail) {
      const currentUserResponse = await fetch(
        `http://localhost:4000/api/v1/user/${userEmail}/search`
      ).catch((err) => console.log(err));
      const currentUserJSON = await currentUserResponse.json();
      setCurrentUser(currentUserJSON);
    }
    console.log('userEmail : ', userEmail);
    console.log('investor Str id : ', investorStrId);
    const investorResponse = await fetch(
      `http://localhost:4000/api/v1/user/${investorStrId}`
    ).catch((err) => console.error('user investor fetch error : ', err)); // api for a logged investor to see other investor’s profile and comments
    setInvestor(await investorResponse.json());

    const stockDocumentListResponse = await axios
      .get(`http://localhost:4000/api/v1/investor/purchases/${investorStrId}`)
      .catch((err) => console.log(err));

    const followersDocumentListResponse = await axios
      .get(`http://localhost:4000/api/v1/investor/followers/${investorStrId}`)
      .catch((err) => console.log(err));

    const followingsDocumentListResponse = await axios
      .get(`http://localhost:4000/api/v1/investor/followings/${investorStrId}`)
      .catch((err) => console.log(err));
    // we made 3 api calls for invested companies, followers, followings
  };

  const getPosts = async (investorStrId) => {
    const post = await axios.get(
      `http://localhost:4000/api/v1/post/fetch/all/user/${investorStrId}`
    );
    const postResponse = post.data;
    setPostList(postResponse);
  };

  const renderedPostList = postList.map((post) => {
    return (
      <PostCard
        postImage={post.image_url}
        postTitle={post.title}
        postAuthor={post.userName}
        postDate={post.date}
        postLikes={post.numberLikes}
      />
    );
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetch(`https://api.github.com/users/${input}`)
  //       .then((res) => res.json())
  //       .then((res) => setData([res]))
  //       .catch((e) => console.error(e));
  //   };

  //   const timer = setTimeout(() => {
  //     fetchData();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [input]);

  useEffect(() => {
    console.log('MEOWW changes');
    var investorStrId = localStorage.getItem('investorStrId');
    getInvestor(investorStrId); // called the getInvestor function in useEffect
    console.log('investorStrId', investorStrId);
    console.log('portfolioList', portfolioList);
    console.log('all users list', allUsersListResponse);

    let filteredUserList = allUsersListResponse.filter(
      (user) => !(investorStrId != String(user._id))
    );
    console.log('filteredUserList', filteredUserList);
    let filteredUserDocument = filteredUserList[0];
    console.log('filteredUserDocument', filteredUserDocument);
    let filteredUserPurchaseList = filteredUserDocument.purchases;
    console.log('filteredUserPurchaseList', filteredUserPurchaseList);

    let filteredInvestorPurchaseList = [];

    for (let i = 0; i < portfolioList.length; i++) {
      let purchaseDoc = portfolioList[i];
      let purchaseDocId = purchaseDoc.purchaseId;
      let purchaseUserId = purchaseDoc.userId;
      for (let j = 0; j < filteredUserPurchaseList.length; j++) {
        let userPurchaseId = String(filteredUserPurchaseList[j]);
        if (
          purchaseUserId == investorStrId &&
          purchaseDocId == userPurchaseId
        ) {
          filteredInvestorPurchaseList.push(purchaseDoc);
        }
      }
    }

    // filter allUsersListResponse to get the user document that matches
    // the investor str id whcih means you only get 1 document in the
    /// filtered list after filtering

    // then from that user access the usrs purchases array which is objet ids
    // of all the purchase the user owns

    /// make a boolean flag hasPurchase and set to false
    // iterate through the user purchases which is a list of purchase object ids

    let investorPurchaseList = filteredInvestorPurchaseList;

    // code here
    let totalUserProfits = 0;
    let totalUserInvestment = 0;
    for (var i = 0; i < investorPurchaseList.length; i++) {
      let totalPurchaseAmount = investorPurchaseList[i].totalInvested;
      totalUserInvestment = totalUserInvestment + totalPurchaseAmount;
      totalUserProfits = investorPurchaseList[i].profit + totalUserProfits;
    }

    getPosts(investorStrId);

    const getAverage = async () => {
      try {
        const averageDocument = await axios.get(
          'http://localhost:4000/api/v1/admin/fetch/average'
        );
        const averageDocumentResponse = averageDocument.data;
        setAverageList(averageDocumentResponse);
      } catch (err) {
        console.log('error : ', err);
      }
    };
    getAverage();
  }, []);

  const renderedPurchaseList = purchaseList.map((purchase) => {
    return <PurchaseCard purchase={purchase} averageList={averageList} />;
  });

  const gridPurchaseList = renderedPurchaseList.map((purchase) => {
    return (
      <Grid item xs={4} sm={3} md={3}>
        {purchase}
      </Grid>
    );
  });

  const gridPostList = renderedPostList.map((post) => {
    return (
      <Grid item xs={4} sm={3} md={3}>
        {post}
      </Grid>
    );
  });

  if (!investor) return null;

  console.log('investor : ', investor);
  return (
    <InvestorBlock>
      <div className='upper-section'>
        <div className='avatar'>
          <img alt={investor.username} src={investor.investorAvatar}></img>
        </div>

        <div className='biocard'>
          <BioCard
            investor={investor}
            currentUserJSON={currentUser} // currently logged in user
            getInvestor={getInvestor}
          />
        </div>
      </div>
      <div className='middle-section'>
        <div className='text'>{investor.username}'s Portfolio</div>
        <div className='purchase-card'>{renderedPurchaseList}</div>
      </div>

      <div className='bottom-section'>
        <div className='text'>{investor.username}'s Ideas</div>
        <div className='post-card'>{renderedPostList}</div>
      </div>
    </InvestorBlock>
  );
}

export async function getServerSideProps() {
  const getPurchaseList = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/stocks/allpurchases'
  );
  const data = await getPurchaseList.json();
  // a user is getting all purchases in upArrow of all users

  const averageStockPriceResponse = (
    await axios.get(
      'http://localhost:4000/api/v1/admin/fetch/averagestockprice'
    )
  ).data;
  console.log('averageStockPriceResponse', averageStockPriceResponse);
  const averageList = averageStockPriceResponse[0].averages;

  // var averagesList = [];
  // if (props.averageList[0]) {
  //   averagesList = props.averageList[0].averages; //averageList = {average:[{"AAPL":180}, {"NIO":20}]}
  //   for (var i = 0; i < averagesList.length; i++) {
  //     var company = averagesList[i]; //{"AAPL":180}
  //     if (company[ticker]) {
  //       // company["AAPL"] => 180
  //       var currPrice = company[ticker];
  //       profit = quantity * currPrice - props.purchase.totalInvested;
  //       break;
  //     }
  //   }
  // }
  // console.log("this is profit", profit);

  var portfolioList = [];
  for (var i = 0; i < data.length; i++) {
    var purchase = data[i]; //purchase becomes one individual purchase document
    var stockId = purchase.stockId; // accessing the stockId of the purchase

    var stock = await axios.get(
      `http://localhost:4000/api/v1/investor/fetch/stock/${stockId}` // returns a stock doc
    );
    var stockResponse = stock.data; // a stock document

    var purchaseJSON = {};
    purchaseJSON.userId = purchase.userId;
    purchaseJSON.ticker = stockResponse.ticker;
    purchaseJSON.logo = stockResponse.profile_image_url;
    purchaseJSON.quantity = purchase.quantity;
    purchaseJSON.totalInvested = purchase.totalInvested;
    purchaseJSON.purchaseId = String(purchase._id);
    if (averageStockPriceResponse[0]) {
      var profit = 0;
      for (var j = 0; j < averageList.length; j++) {
        var company = averageList[j]; //{"AAPL":180}
        if (company[purchaseJSON.ticker]) {
          // company["AAPL"]
          var currPrice = company[purchaseJSON.ticker];
          profit =
            purchaseJSON.quantity * currPrice - purchaseJSON.totalInvested;
          purchaseJSON.profit = profit;
          // Start here ////////////////////////////////////////////
          break;
        }
      }
    }
    console.log('this is profit', profit);
    portfolioList.push(purchaseJSON);
  }
  console.log('portfolioList', portfolioList);

  // var twelveDataRes = await axios.get(
  //   `https://api.twelvedata.com/time_series?symbol=${tickerStr}&interval=1min&apikey=4c745db6ae464c4983f6f656092e5d15`
  // );
  //console.log("twelve data res", twelveDataRes.data);

  // call api to get all the users
  const allUsersList = await axios.get('http://localhost:4000/api/v1/user');
  const allUsersListResponse = allUsersList.data;

  console.log('Wooooooooooooooooooooof: ', allUsersListResponse);

  return {
    props: { portfolioList, allUsersListResponse },
  };
}
