import React, { useEffect, useState } from 'react';
import BioCard from '../components/BioCard';
import PurchaseCard from '../components/PurchaseCard';
import axios from 'axios';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const InvestorBlock = styled.div`
  padding-top: 2rem;
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

export default function Investor({ portfolioList, allUsersListResponse }) {
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
    const investorResponse = await fetch(
      `http://localhost:4000/api/v1/user/${investorStrId}`
    ).catch((err) => console.error('user investor fetch error : ', err)); // api for a logged investor to see other investor’s profile and comments
    setInvestor(await investorResponse.json());

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

    useEffect(() => {
      var investorStrId = localStorage.getItem('investorStrId');
      getInvestor(investorStrId); // called the getInvestor function in useEffect

      const filteredUserList = allUsersListResponse.filter(
        (user) => !(investorStrId != String(user._id))
      );
      const filteredUserDocument = filteredUserList[0];
      const filteredUserPurchaseList = filteredUserDocument.purchases;
      const filteredInvestorPurchaseList = [];

      for (let i = 0; i < portfolioList.length; i++) {
        const purchaseDoc = portfolioList[i];
        const purchaseDocId = purchaseDoc.purchaseId;
        const purchaseUserId = purchaseDoc.userId;
        for (let j = 0; j < filteredUserPurchaseList.length; j++) {
          const userPurchaseId = String(filteredUserPurchaseList[j]);
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

    if (!investor) return <>test</>;

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
  };
}

export async function getServerSideProps() {
  const getPurchaseList = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/stocks/allpurchases'
  );
  const data = await getPurchaseList.json();
  // a user is getting all purchases in upArrow of all users

  const currentStockPrices = (
    await axios.get('http://localhost:4000/api/v1/config')
  ).data.price;

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
    purchaseJSON.totalInvested = purchase.totalInvested || 0;
    purchaseJSON.purchaseId = String(purchase._id);
    if (currentStockPrices) {
      let profit = 0;
      const currentPrice = currentStockPrices[purchaseJSON.ticker];
      profit =
        purchaseJSON.quantity * currentPrice - purchaseJSON.totalInvested;
      purchaseJSON.profit = profit;
    }
    portfolioList.push(purchaseJSON);
  }

  // call api to get all the users
  const allUsersList = await axios.get('http://localhost:4000/api/v1/user');
  const allUsersListResponse = allUsersList.data;

  return {
    props: { portfolioList, allUsersListResponse },
  };
}
