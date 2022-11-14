import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import InvestorCard from '../components/InvestorCard';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { MainLayout } from '../Layouts';

const IndexWrapper = styled.div`
  padding: 3rem;
  margin-bottom: 5rem;

  .text {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
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
// Lead -> 설계  [ ] [  ] [ ] [ ]
//어junior, 시니어

// AI -> // AI 특이점 (오기 직전의 세대)
// AI 일을 다한다. -> 사람 일자리 X -> 사람이 일을 안해도 됨.
// 필수 편안.

function Home({
  sortedStockDataList,
  postDataList,
  investorDataList,
  stockRef,
  ideaRef,
  investorRef,
}) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const email = user.email;

        const userDocument = await axios
          .get(`http://localhost:4000/api/v1/user/${email}/email`)
          .catch((error) => {
            console.log('error', error.response);
            if (error.response.status == 400 || error.response.status == 404) {
              console.log(error.response.data); // => the response payload
              return error.response.data;
            }
          });

        localStorage.setItem(
          'profile_image_url',
          userDocument.data.profile_image_url
        );
        if (Object.keys(userDocument.data).length == 0) {
          router.push('/signup');
        }
      }
    };
    getUser();
  }, [user]);

  const logoList = sortedStockDataList.map((data, index) => {
    return <Logo key={index} stockJSON={data} />;
  });

  const postList = postDataList.map((post) => {
    return (
      <PostCard
        key={post.title}
        postId={post._id}
        postImage={post.thumbnailImageUrl}
        postTitle={post.title}
        postAuthor={post.username}
        postDate={post.date}
        postLikes={post.likes.length}
        stockId={post.stockId}
      />
    );
  });

  const topEightRenderedInvestorList = investorDataList
    .slice(0, 8)
    .map((investor) => {
      return (
        <InvestorCard
          key={investor._id}
          investorId={investor._id}
          investorName={investor.name}
          investorAvatar={investor.profile_image_url}
          totalInvestment={investor.totalInvestment}
          totalProfits={investor.totalProfits}
          totalAssets={investor.totalAssets}
        />
      );
    });

  let options = [];
  let valueCount = 0;

  for (let i = 0; i < sortedStockDataList.length; i++) {
    let labelJSON = {};
    valueCount++;
    labelJSON['value'] = valueCount;
    labelJSON['label'] = sortedStockDataList[i].name;
    labelJSON['stockId'] = String(sortedStockDataList[i]._id);
    options.push(labelJSON);
  }

  return (
    <IndexWrapper>
      <SearchBar options={options} />

      <div className='text' ref={stockRef}>
        Analyses
      </div>

      <div className='stockList'>{logoList}</div>

      <div className='text' ref={ideaRef}>
        Ideas
      </div>

      <div className='postList'>{postList}</div>

      <div className='text' ref={investorRef}>
        {' '}
        Investors{' '}
      </div>

      <div className='investorList'>{topEightRenderedInvestorList}</div>
      <div></div>
    </IndexWrapper>
  );
}

export async function getServerSideProps() {
  const allStockList = await axios(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/stock`
  );
  // getting all stocks available on UpArrow (a user at the landing page where all stocks are)
  const allStockDataList = allStockList.data;

  const sortedStockDataList = allStockDataList.sort(function (stock1, stock2) {
    stock1 = stock1.name.toLowerCase();
    stock2 = stock2.name.toLowerCase();

    return stock1 < stock2 ? -1 : stock1 > stock2 ? 1 : 0;
  });
  // making all stock data in alphabetical order

  const topSixPost = await axios('http://localhost:4000/api/v1/post', {
    params: {
      order: 'desc',
      limit: 6,
    },
  });
  const postDataList = topSixPost.data;
  // a user is getting top 6 posts (on index.js)

  // 10번
  // 10번을 동시에 할수도 있고선 6차선
  // 10 번을 순서대로 할 수도 있음
  // 4차선 <
  // 1차선
  const investorList = await axios(
    'http://localhost:4000/api/v1/user' // this api gets all investors in upArrow
  );
  const investorDataList = investorList.data; // investorDataList gets user document of all users in UpArrow

  investorDataList.sort(function (a, b) {
    var x = a.totalProfitPercentage;
    var y = b.totalProfitPercentage;

    if (x === 0 && y === 0) return 1 / y - 1 / x || 0;
    else return y - x;
  });

  return {
    props: { sortedStockDataList, postDataList, investorDataList },
  };
}

export default function MainPage(props) {
  return (
    <MainLayout>
      <Home {...props} />
    </MainLayout>
  );
}
