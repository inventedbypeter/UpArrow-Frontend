import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import StarRatings from 'react-star-ratings';
import ArgumentBox from '../components/ArgumentBox';
import Comment from '../components/Comment';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import date from 'date-and-time';
import Buy from '../components/Buy';
import Sale from '../components/Sale';
import StockCover from '../components/StockCover';
import StockChart from '../components/StockChart';
import Analyses from '../components/Analysis';
import StarRating from '../components/StarRating';
import Management from '../components/Management';
import Financial from '../components/Financial';
import UserIcon from '../components/UserIcon';

const CommentsBlock = styled.div`
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0.2rem #c4c7cc;
  margin-left: 2rem;
  margin-right: 2rem;
`;

const StockWrapper = styled.div`
  .content {
    padding: 0 3rem;

    .button-wrapper {
      display: flex;
      justify-content: center;
      gap: 5rem;
    }
  }

  .financial {
    margin-bottom: 5rem;
  }

  .investor-wrapper {
    display: flex;
    gap: 5rem;
  }
`;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function Stock({ stockData }) {
  console.log('this is stockDATA: ', stockData);

  const [content, setContent] = useState('Please enter your comment');
  const [comments, setComments] = useState([]);
  const [commentJSON, setCommentJSON] = useState(null);
  const [userId, setUserId] = useState('');
  const [stock, setStock] = useState(null);
  const [filteredStock, setFilteredStock] = useState(null);
  const contentRef = useRef();
  const { user, error, isLoading } = useUser();
  const [openInvest, setOpenInvest] = useState(false);
  const [openNotInvest, setOpenNotInvest] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [investors, setInvestors] = useState([]);
  var token = null;
  console.log('investors : ', investors);

  const fetchInvestors = async () => {
    const investorIdList =
      stock.detailInfo.find((info) => info.type === 'investors').content || [];
    console.log('investorIdList  :', investorIdList);
    const investorList = await Promise.all(
      investorIdList.map((id) =>
        axios.get(`http://localhost:4000/api/v1/user/${id}`)
      )
    );
    console.log('setInvestors : ', investorList);
    setInvestors(investorList.map((item) => item.data));
  };
  useEffect(() => {
    if (stock) {
      fetchInvestors();
    }
  }, [stock]);

  useEffect(() => {
    var stockJSONIdStr = localStorage.getItem('stockIdStr');
    if (!stockJSONIdStr) {
      stockJSONIdStr = localStorage.getItem('stockIdStrModal');
    }
    var filteredStockList = stockData.filter(
      (stock) => !(stockJSONIdStr != String(stock._id))
    );
    console.log('filtered stock list: ', filteredStockList);
    const filteredStock = filteredStockList[0];
    setFilteredStock(filteredStock);
    console.log('filteredStock: ', filteredStock);
    console.log('stock json id str', stockJSONIdStr);

    const getStockJSON = async () => {
      const stockResponse = await fetch(
        `http://localhost:4000/api/v1/investor/fetch/stock/${stockJSONIdStr}`
      );
      const stockData = await stockResponse.json();
      setStock(stockData);

      const ticker = stockData.ticker;
      try {
        const analysisResponse = await axios.get(
          `http://localhost:4000/api/v1/investor/fetch/analysis/${ticker}`
        );
        setAnalysis(analysisResponse.data);
      } catch (err) {
        console.log('error');
      }
    };
    getStockJSON();

    const getStockComments = async () => {
      const response = await fetch(
        `http://localhost:4000/api/v1/investor/fetch/stock/comments/${stockJSONIdStr}`
      );
      const data = await response.json();
      console.log('comment data  :', data);
      setComments(data);
    };
    getStockComments();

    const getUserId = async () => {
      if (user) {
        token = user;
        localStorage.setItem('email', token.email);
        const userEmail = user.email;
        const response = await fetch(
          `http://localhost:4000/api/v1/user/${userEmail}/email`
        );
        const data = await response.json();
        console.log('data of the user: ', data);
        setUserId(String(data._id));
      }
    };
    getUserId();
  }, [commentJSON]);

  let stockChartUrl = '';
  let stockTicker = '';
  let totalVotes = 0;
  let starScore = 0;
  let stockName = '';
  let stockImageUrl = '';
  let investedVotes = 0;
  let stockVideoUrl = '';
  let stockPros;
  let stockCons;
  let hasArgument;
  let totalVotesMessage = '';
  let hasVideo = false;
  let messageLabel;
  if (stock) {
    stockName = stock.name;
    stockVideoUrl = stock.video_url;
    stockPros = stock.pros;
    stockCons = stock.cons;
    stockImageUrl = stock.profile_image_url;
    stockTicker = stock.ticker.toUpperCase();
    totalVotes = stock.invest.length + stock.notInvest.length;
    investedVotes = stock.invest.length;
    starScore = (stock.invest.length / totalVotes / 2) * 10;
    stockChartUrl = `https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=8C5CD6B07F444FEEA5F9D26F4361B0B7&symbol=${stockTicker}&dividends=true&splits=true&palette=Financial-Light&showLogo=No`;
    totalVotesMessage = investedVotes + ' invested';
    if (totalVotes === 0) {
      starScore = 0;
    }
    hasVideo = stock.video_url.length > 0;
    hasArgument = stock.pros.length >= 5 && stock.cons.length >= 5;
    messageLabel = `What do you think about ${stock.name} stocks?`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContent(String(contentRef.current.value));
    if (contentRef.current.value && stock && user) {
      var userEmail = user.email;
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${userEmail}/email`
      );
      const data = await response.json();

      const now = new Date();
      const timeStamp = date.format(now, 'YYYY/MM/DD HH:mm:ss');
      console.log('this is time stamp: ', timeStamp);

      var commentJSON = {};
      commentJSON.stockId = String(stock._id);
      commentJSON.userId = String(data._id);
      commentJSON.content = contentRef.current.value;
      commentJSON.timeStamp = timeStamp;
      //commentJSON.timeStamp = format(new Date(), "do MMMM Y");
      commentJSON.likes = [];

      await axios
        .post(
          'http://localhost:4000/api/v1/investor/register/comment',
          commentJSON
        )
        .then((res) => {
          setCommentJSON(commentJSON);
        })
        .catch((error) => {});
      contentRef.current.value = '';
    }
  };

  const handleCloseInvest = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenInvest(false);
  };

  const callNotInvestAPI = async () => {
    if (user && stock) {
      var userEmail = user.email;
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${userEmail}/email`
      );
      const data = await response.json();
      const userId = String(data._id);
      const stockId = String(stock._id);

      await axios
        .put(
          `http://localhost:4000/api/v1/investor/update/notInvest/company/${stockId}/${userId}`,
          {}
        )
        .then((res) => {
          console.log('call notInvest api : ', res);
        })
        .catch((error) => {});

      setOpenNotInvest(true);
    }
  };

  const handleNotCloseInvest = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenNotInvest(false);
  };

  return (
    <StockWrapper>
      <StockCover stockImageUrl={stockImageUrl} stockName={stockName} />
      <div className='content'>
        <div>
          <div>
            <div variant='h5'>{starScore}</div>
          </div>
          <div>
            {/* <Rating
              precision={0.5}
              name='simple-controlled'
              value={starScore}
              readOnly
            /> */}
          </div>
        </div>
        <StockChart stockChartUrl={stockChartUrl} />
        {stock?.detailInfo?.map((detail) => {
          if (detail.type === 'html') {
            return (
              <Analyses
                key={detail.title}
                title={detail.title}
                type={detail.type}
              >
                {detail.content}
              </Analyses>
            );
          }
          if (detail.type === 'ratingList') {
            return (
              <Analyses
                key={detail.title}
                title={detail.title}
                type={detail.type}
              >
                <div className='star-ratings-wrapper'>
                  {detail.content.map((ratingItem) => {
                    return (
                      <StarRating
                        key={ratingItem.title}
                        title={ratingItem.title}
                        rating={ratingItem.score}
                      />
                    );
                  })}
                </div>
              </Analyses>
            );
          }
          if (detail.type === 'management') {
            return (
              <Analyses title={detail.title}>
                <Management management={detail.content} />
              </Analyses>
            );
          }
          if (detail.type === 'financials') {
            return (
              <Analyses title={detail.title}>
                {detail.content.map((financialItem) => {
                  return (
                    <Financial
                      className='financial'
                      key={financialItem.title}
                      item={financialItem}
                    />
                  );
                })}
              </Analyses>
            );
          }
          if (detail.type === 'video') {
            return (
              <Analyses title={detail.title}>
                <iframe width={880} height={500} src={stock.video_url} />
              </Analyses>
            );
          }
          if (detail.type === 'investors') {
            return (
              <Analyses title={detail.title}>
                <div className='investor-wrapper'>
                  {investors.map((investor) => {
                    return (
                      <UserIcon
                        src={investor.profile_image_url}
                        key={investor._id}
                      />
                    );
                  })}
                </div>
              </Analyses>
            );
          }
          if (detail.type === 'comments') {
            return (
              <Analyses title={detail.title}>
                {comments.map((comment) => {
                  return <Comment key={comment._id} commentJSON={comment} />;
                })}
              </Analyses>
            );
          }
          return '';
        })}

        {/* 
        <Analyses title='Competitive Advantages'>
          Once you use an iPhone, it’s <strong>difficult to switch</strong> to
          other brand as you get use to its user experience. Furthermore, Apple
          has a great ecosystem. iPhones, iPads, Macs, Watches, AirPods works
          together seamlessly. Which cause iPhone users to buy other Apple
          products.
          <br />
          <br />
          Premium brand image thanks to
          <strong>beautiful product design.</strong>
          <strong>Apple users are loyal</strong> and they are likely to buy
          Apple products even if the prices are increased.
          <br />
          <br />
          Apple charges 30% cut from app developers.
        </Analyses>
        <Analyses title='Product Reviews'>
          <div className='star-ratings-wrapper'>
            <StarRating title='IPhone' rating={4.5} />
            <StarRating title='IPad' rating={4.5} />
            <StarRating title='Mac' rating={3} />
            <StarRating title='Watch' rating={1} />
            <StarRating title='AirPot' rating={2} />
            <StarRating title='Apple TV' rating={2} />
          </div>
        </Analyses>
        <div className='button-wrapper'>
          <Buy className='buyButton' stockJSON={stock} />
          <Sale stockJSON={stock} />
        </div> */}
        {openInvest && stock && (
          <div spacing={2} sx={{ width: '100%' }}>
            <div
              open={openInvest}
              autoHideDuration={4000}
              onClose={handleCloseInvest}
            >
              <Alert
                onClose={handleCloseInvest}
                severity='success'
                sx={{ width: '100%' }}
              >
                {`You successfully invested in ${stock.name} stock`}
              </Alert>
            </div>
            <Alert severity='success'>{`You successfully invested in ${stock.name} stock`}</Alert>
          </div>
        )}
        {openNotInvest && stock && (
          <div spacing={2} sx={{ width: '100%' }}>
            <div
              open={openNotInvest}
              autoHideDuration={4000}
              onClose={handleNotCloseInvest}
            >
              <Alert
                onClose={handleNotCloseInvest}
                severity='success'
                sx={{ width: '100%' }}
              >
                {`You have not invested in ${stock.name} stock`}
              </Alert>
            </div>
            <Alert severity='success'>{`You have not invested in ${stock.name} stock`}</Alert>
          </div>
        )}
      </div>
    </StockWrapper>
  );
}

export async function getServerSideProps() {
  const stockResponse = await axios.get(
    `http://localhost:4000/api/v1/investor/fetch/stocks`
  );
  const stockData = stockResponse.data;

  return {
    props: { stockData },
  };
}
