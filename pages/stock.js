import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import StarRatings from 'react-star-ratings';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import styles from '../components/Stock.module.css';
import ArgumentBox from '../components/ArgumentBox';
import Grid from '@mui/material/Grid';
import Comment from '../components/Comment';
import Paper from '@material-ui/core/Paper';
import { useUser } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import date from 'date-and-time';
import Buy from '../components/Buy';
import Sale from '../components/Sale';

const CommentsBlock = styled.div`
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0.2rem #c4c7cc;
  margin-left: 2rem;
  margin-right: 2rem;
`;

const BuySellButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;

  .buyButton {
    width: 400;
    height: 145;
    background-color: green;
  }
`;

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function Stock({ stockData }) {
  console.log('this is stockDATA: ', stockData);

  const classes = useStyles();
  const [content, setContent] = useState('Please enter your comment');
  const [comments, setComments] = useState([]);
  const [commentJSON, setCommentJSON] = useState(null);
  const [userId, setUserId] = useState('');
  const [stock, setStock] = useState(null);
  const [filteredStock, setFilteredStock] = useState(null);
  const router = useRouter();
  const contentRef = useRef();
  const { user, error, isLoading } = useUser();
  const [openInvest, setOpenInvest] = useState(false);
  const [openNotInvest, setOpenNotInvest] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  var token = null;

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
    // const getStockAvg = async () => {
    //     const res = await axios.get("http://localhost:4000/api/v1/investor/fetch/stocks/purchase/6232ba3c69c746d0e7f01706");
    //     //http://localhost:4000/api/v1/investor/fetch/stocks/purchase/:userId
    //     const purchaseList = res.data;
    //     console.log("This is the purchaseList", purchaseList);

    //     var totalInvestment = 0;
    //     var totalProfits = 0;

    //     for (var i = 0; i < purchaseList.length; i++) {
    //         var purchase = purchaseList[i];
    //         var investment = purchase.totalInvested;
    //         totalInvestment = totalInvestment + investment;
    //         var profits = purchase.profit;
    //         totalProfits = totalProfits + profits;
    //     }
    //     var totalAssets = totalInvestment + totalProfits;
    //     console.log("total Investment", totalInvestment)
    //     console.log("total Profits", totalProfits)
    //     console.log("total Assets", totalAssets)
    // }
    // getStockAvg();

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

  var hasVideo = false;
  var hasArgument = false;
  var messageLabel = '';
  var stockChartUrl = '';
  var stockTicker = '';
  var totalVotes = 0;
  var starScore = 0;
  var totalVotesMessage = '';
  var stockName = '';
  var stockVideoUrl = '';
  var stockPros = [];
  var stockCons = [];
  var stockImageUrl = '';
  var investedVotes = 0;
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
    if (totalVotes == 0) {
      starScore = 0;
    }
    hasVideo = stock.video_url.length > 0 ? true : false;
    hasArgument =
      stock.pros.length >= 5 && stock.cons.length >= 5 ? true : false;
    messageLabel = `What do you think about ${stock.name} stocks?`;
  }

  const newCommentsList = comments.map((comment) => {
    return (
      <div key={comment._id}>
        <Comment commentJSON={comment} />
        <br />
      </div>
    );
  });

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

  const callInvestAPI = async () => {
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
          `http://localhost:4000/api/v1/investor/update/invest/company/${stockId}/${userId}`,
          {}
        )
        .then((res) => {
          console.log('call invest api : ', res);
        })
        .catch((error) => {});

      setOpenInvest(true);
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
    <div>
      <Box pl={5} pt={10}>
        <Card sx={{ maxWidth: 250 }}>
          <Paper variant='outlined' square>
            <img src={stockImageUrl} width='230' height='230' />
          </Paper>
        </Card>
      </Box>
      <br />
      <Box
        sx={{
          width: 500,
          display: 'flex',
          alignItems: 'center',
        }}
        pl={5}
      >
        <Typography variant='h5'>
          <strong>{stockName}</strong>
        </Typography>
        <Box sx={{ ml: 5 }}>
          <Typography variant='h5'>{starScore}</Typography>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Rating
            precision={0.5}
            name='simple-controlled'
            value={starScore}
            readOnly
          />
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography style={{ color: '#459BF2' }} variant='h5'>
            {totalVotesMessage}
          </Typography>
        </Box>
      </Box>
      <br />
      <Box pl={5}>
        <iframe
          key={stockChartUrl}
          frameBorder='0'
          scrolling='no'
          width='800'
          height='420'
          src={stockChartUrl}
        ></iframe>
      </Box>
      <br />

      {hasArgument && (
        <Box
          sx={{
            width: 1000,
            display: 'flex',
            alignItems: 'center',
          }}
          pl={10}
        >
          <Box pl={10} pt={5}>
            <Box pl={10}>
              <img
                src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgVN0RnW-KHJoOm1VWyJ6ezgtwMhLJgUTmUxEz2QNaPsZTjzGFXEqnCzP1W-cmKg0i6x7RQwYRWfxkdF8rOrjyNiNLrtkG62t2GEISp2cKpxwsPqB9lI9ayJYyp9Skp2KqWjylXikBmMMKa2QdugY7iyPgw5JIBZh7Q2eD35J9kNLGOClZEANPZ-eC7bA/s320/Pros%20Cons%20Icon.jpg'
                width='45'
                height='45'
              />
            </Box>
            <br />
            <ArgumentBox pros={stockPros} isPro={true} />
          </Box>

          <Box pl={10} pt={5}>
            <Box pl={10}>
              <img
                src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9woXkUgJ20EzbmOErBBPcu10fDBSsMSTxth_6czpZ4Etk7Cbyfp32tN_nkVNeY9vGCShilwORgV6YBhQkBpm8-V7UgNknfaP8h9l6Zf0TIQV0VsFJajvQXjH2-lR1ZU9rynMN97URoCj94z5OSHtRrQBrksUG6D2B4FlyVNJ0xN3Wm2oiWHdnIkYOnQ/s320/Cons%20Icon.jpg'
                width='45'
                height='45'
              />
            </Box>
            <br />
            <ArgumentBox cons={stockCons} isPro={false} />
          </Box>
        </Box>
      )}
      {hasVideo && (
        <Box pl={5} pt={5} pb={4}>
          <iframe
            key={stockVideoUrl}
            width='560'
            height='315'
            src={stockVideoUrl}
            title='YouTube video player'
            frameborder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowfullscreen
          ></iframe>
        </Box>
      )}

      <Box
        sx={{
          width: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
        pl={5}
      >
        <Typography variant='h6'>
          <strong> What other investors think about {stockName} stocks </strong>
        </Typography>
      </Box>
      <br />
      <br />
      <CommentsBlock>{newCommentsList}</CommentsBlock>
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={contentRef}
          className={classes.field}
          type='text'
          label={messageLabel}
          variant='outlined'
          color='secondary'
          multiline
          rows={4}
          fullWidth
        />

        <Button type='submit' color='secondary' variant='contained'>
          Submit
        </Button>
      </form>
      <br />
      <br />
      <Typography align='center' style={{ color: '#459BF2' }} variant='h5'>
        What’s your decision?
      </Typography>
      <br />
      <br />
      <br />
      <Box textAlign='center'>
        {/* <Button
          onClick={() => callInvestAPI()}
          style={{
            backgroundColor: "#50C878",
            padding: "1rem 5.5rem",
            fontSize: "1.8rem",
            color: "white",
            width: "25rem",
            height: "7.5rem",
          }}
          variant="contained"
          size="large"
        >
          Buy
        </Button> */}
        <BuySellButtons>
          <Buy className='buyButton' stockJSON={stock} />
          <Sale stockJSON={stock} />
        </BuySellButtons>

        <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>
        <Button
          onClick={() => callNotInvestAPI()}
          style={{
            backgroundColor: 'blue',
            padding: '1rem 5.5rem',
            fontSize: '1.8rem',
            color: 'white',
            width: '25rem',
            height: '7.5rem',
          }}
          variant='contained'
          size='large'
        >
          Sell
        </Button>
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {openInvest && stock && (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
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
          </Snackbar>
          <Alert severity='success'>{`You successfully invested in ${stock.name} stock`}</Alert>
        </Stack>
      )}
      {openNotInvest && stock && (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
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
          </Snackbar>
          <Alert severity='success'>{`You have not invested in ${stock.name} stock`}</Alert>
        </Stack>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  // gets all stocks

  const stockResponse = await axios.get(
    `http://localhost:4000/api/v1/investor/fetch/stocks`
  );
  const stockData = stockResponse.data;

  console.log('stockData for all', stockData);

  return {
    props: { stockData },
  };
}
