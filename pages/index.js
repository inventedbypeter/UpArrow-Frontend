import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import InvestorCard from '../components/InvestorCard';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

const IndexWrapper = styled.div`
  padding: 3rem;
  padding-top: 11rem;
  margin-bottom: 5rem;

  .text {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
    font-family: lato;
    font-weight: 900;
  }

  .stockList {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .postList {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .investorList {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

export default function Home({
  sortedStockDataList,
  postDataList,
  investorDataList,
  stockRef,
  ideaRef,
  investorRef,
}) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  console.log('investorDataList: ', investorDataList);

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        let email = user.email;
        // let userDocument = null;
        console.log('this is the email', email);

        // const userDocument = await axios
        //   .get(`http://localhost:4000/api/v1/investor/fetch/user/${email}`)
        //   .then((response) => {
        //     console.log("response: ", response);
        //   })
        //   .catch((error) => {
        //     console.log("error: ", error);
        //   });

        const userDocument = await axios
          .get(`http://localhost:4000/api/v1/investor/fetch/user/${email}`)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log('error', error.response);
            if (error.response.status == 400 || error.response.status == 404) {
              console.log(error.response.data); // => the response payload
              return error.response.data;
            }
          });

        // const userDocument = await axios
        //   .get(`http://localhost:4000/api/v1/investor/fetch/user/${email}`)
        //   .catch(function (error) {
        //     console.log("this is error", error.response);
        //     if (error.response) {
        //       console.log("ignore");
        //       router.push("/signup");
        //     } else if (error.request) {
        //       console.log("ignore");
        //       router.push("/signup");
        //     } else {
        //       console.log("ignore too");
        //       router.push("/signup");
        //     }
        //   }

        console.log('userDocument.data', userDocument);
        localStorage.setItem(
          'profile_image_url',
          userDocument.data.profile_image_url
        );
        if (Object.keys(userDocument.data).length == 0) {
          console.log('this user does not exist');
          router.push('/signup');
        }
      }
    };
    getUser();
  }, [user]);

  const logoList = sortedStockDataList.map((data) => {
    return <Logo stockJSON={data} />;
  });

  console.log('this is investor data list: ', investorDataList);

  const gridList = logoList.map((logo) => {
    return <div>{logo}</div>;
  });

  const postList = postDataList.map((post) => {
    return (
      <PostCard
        postImage={post.image_url}
        postTitle={post.title}
        postAuthor={post.userName}
        postDate={post.date}
        postLikes={post.likes.length}
      />
    );
  });

  const gridPostList = postList.map((post) => {
    return <div>{post}</div>;
  });

  var topEightInvestorList = investorDataList.slice(0, 8);
  const topEightRenderedInvestorList = topEightInvestorList.map((investor) => {
    return (
      <InvestorCard
        investorId={investor._id}
        investorName={investor.name}
        investorAvatar={investor.profile_image_url}
        totalInvestment={investor.totalInvestment}
        totalProfits={investor.totalProfits}
        totalAssets={investor.totalAssets}
        totalProfitPercentage={investor.totalProfitPercentage}
      />
    );
  });

  const topEightGridInvestorList = topEightRenderedInvestorList.map(
    (investor) => {
      return <>{investor}</>;
    }
  );

  var options = [];
  var valueCount = 0;

  for (var i = 0; i < sortedStockDataList.length; i++) {
    var labelJSON = {};
    valueCount++;
    labelJSON['value'] = valueCount;
    labelJSON['label'] = sortedStockDataList[i].name;
    labelJSON['stockId'] = String(sortedStockDataList[i]._id);
    options.push(labelJSON);
  }
  console.log(options);

  return (
    <IndexWrapper>
      <SearchBar options={options} />

      <div className='text' ref={stockRef}>
        Analyses
      </div>

      <div className='stockList'>{gridList}</div>

      <div className='text' ref={ideaRef}>
        Ideas
      </div>

      <div className='postList'>{gridPostList}</div>

      <div className='text' ref={investorRef}>
        {' '}
        Investors{' '}
      </div>

      <div className='investorList'>{topEightGridInvestorList}</div>
      <div></div>
    </IndexWrapper>
  );
}

export async function getServerSideProps() {
  const allStockList = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/stocks'
  );
  // getting all stocks available on UpArrow (a user at the landing page where all stocks are)
  const allStockDataList = await allStockList.json();

  const sortedStockDataList = allStockDataList.sort(function (stock1, stock2) {
    stock1 = stock1.name.toLowerCase();
    stock2 = stock2.name.toLowerCase();

    return stock1 < stock2 ? -1 : stock1 > stock2 ? 1 : 0;
  });
  // making all stock data in alphabetical order

  const getTopSixPost = await fetch(
    'http://localhost:4000/api/v1/post/fetch/top/six'
  );
  const postDataList = await getTopSixPost.json();
  // a user is getting top 6 posts (on index.js)

  const getInvestorList = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/userprofiles/' // this api gets all investors in upArrow
  );
  const investorDataList = await getInvestorList.json(); // investorDataList gets user document of all users in UpArrow

  for await (const [index, investorData] of investorDataList.entries()) {
    let investorStrId = String(investorData._id);
    let userTotalProfit = 0;
    let userTotalInvestment = 0;

    // I am trying to understand what's happening from here to below by changing names to more straight forward names
    const getPurchaseList = await fetch(
      'http://localhost:4000/api/v1/investor/fetch/stocks/allpurchases'
    );
    const data = await getPurchaseList.json();

    const averageStockPriceResponse = (
      await axios.get(
        'http://localhost:4000/api/v1/admin/fetch/averagestockprice'
      )
    ).data;
    const averageList = averageStockPriceResponse[0].averages;

    let portfolioList = [];
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
      if (averageStockPriceResponse[0]) {
        var profit = 0;
        for (var j = 0; j < averageList.length; j++) {
          var company = averageList[j]; //{"AAPL":180}
          if (company[purchaseJSON.ticker]) {
            // company["AAPL"] => 180
            var currPrice = company[purchaseJSON.ticker];
            profit =
              purchaseJSON.quantity * currPrice - purchaseJSON.totalInvested;
            purchaseJSON.profit = profit;
            break;
          }
        }
      }
      console.log('this is profit', profit);
      portfolioList.push(purchaseJSON);
    }
    console.log('portfolioList', portfolioList);

    let investorPurchaseList = portfolioList.filter(
      (purchase) => !(investorStrId != purchase.userId)
    );
    //console.log("investorPurchaseList: ", investorPurchaseList);

    for (let i = 0; i < investorPurchaseList.length; i++) {
      let purchaseStock = investorPurchaseList[i];
      userTotalProfit = userTotalProfit + purchaseStock.profit;
      userTotalInvestment = userTotalInvestment + purchaseStock.totalInvested;
    }

    investorDataList[index].totalProfits = userTotalProfit;
    investorDataList[index].totalInvestment = userTotalInvestment;
    investorDataList[index].totalAssets = userTotalProfit + userTotalInvestment;
    var percentage = (userTotalProfit / userTotalInvestment) * 100;
    investorDataList[index].totalProfitPercentage = Math.floor(percentage);
  }

  investorDataList.sort(function (a, b) {
    var x = a.totalProfitPercentage;
    var y = b.totalProfitPercentage;

    if (x === 0 && y === 0) return 1 / y - 1 / x || 0;
    else return y - x;
  });

  // investorDataList.sort(function (a, b) {
  //   return b.totalProfitPercentage - a.totalProfitPercentage;
  // });

  console.log('investor data list', investorDataList);

  return {
    props: { sortedStockDataList, postDataList, investorDataList },
  };
}
