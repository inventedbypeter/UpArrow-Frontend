import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SaleWrapper = styled.div`
  font-family: sans-serif;
  font-size: 25px;
  color: white;
  border: 1px #ef4232;
  background-color: #ef4232;
  width: 260px;
  height: 94.25px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InvisibleCover = styled.div`
  background-color: rgba(0 0 0 / 10%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; //viewportwidth
  height: 100vh; //viewportheight
  z-index: 990;
`;

const ModalWrapper = styled.div`
  font-family: sans-serif;
  font-size: 22px;
  color: black;
  width: 800px;
  height: 800px;
  background-color: white;
  position: fixed;
  left: calc(-400px + 50%);
  top: calc(-400px + 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .stockLogo {
    width: 200px;
    height: 200px;
  }

  .boldText {
    font-weight: bold;
    display: inline;
  }

  .quantity {
    width: 200px;
    height: 50px;
    margin-bottom: 15px;
    text-align: center;
  }

  .button {
    font-family: sans-serif;
    font-size: 25px;
    color: white;
    width: 200px;
    height: 70px;
    border-radius: 5px;
    background-color: #ef4232;
    border: 1px #ef4232;
    margin-bottom: 15px;
  }
`;

const ConfirmationWrapper = styled.div`
  .congratulations {
    font-family: sans-serif;
    font-size: 30px;
    color: Black;
    font-weight: bold;
  }
`;

// const showModal = false ? <ModalWrapper></ModalWrapper> : null;

// function showModal() {

// }

function Sale({ stockJSON }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [stock, setStock] = useState(null);
  const [user, setUser] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [buy, setBuy] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userEmail = localStorage.getItem('email');
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${userEmail}/email`
      );
      const data = await response.json();
      setUser(data);
    };
    getUser();
  }, [totalInvestment]);

  const getAverageStockPrice = async () => {
    const response = await axios.get(
      'http://localhost:4000/api/v1/admin/fetch/averagestockprice'
    );
    const stockList = response.data[0].averages;
    //   data = averageStockPriceResponse[0].averages;

    for (let i = 0; i < stockList.length; i++) {
      let stock = stockList[i]; //{AAPL: 180.5}
      let stockCurrentPrice = 0;
      if (stockJSON && stock[stockJSON.ticker]) {
        //180.5
        stockCurrentPrice = stock[stockJSON.ticker];
        //setUser(userJSON);
        setStock(stockJSON);

        setCurrentPrice(stockCurrentPrice);
      }
    }
  };

  if (stockJSON) {
    getAverageStockPrice();
  }

  const showModal = () => {
    if (!open) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const purchaseStock = async () => {
    let purchaseJSON = {};
    purchaseJSON.userId = String(user._id);
    purchaseJSON.stockId = String(stock._id);
    purchaseJSON.quantity = parseInt(text);
    purchaseJSON.averagePrice = currentPrice;
    purchaseJSON.totalInvested = totalInvestment;
    setBuy(true);

    await axios.post(
      'http://localhost:4000/api/v1/investor/purchase',
      purchaseJSON
    );

    localStorage.setItem('investorStrId', purchaseJSON.userId);
    setTimeout(() => {
      router.push('/investor');
    }, 10000);
  };

  const calculateTotalInvestment = (e) => {
    const enteredQuantity = parseInt(text);
    const totalInvestment = currentPrice * enteredQuantity;
    setTotalInvestment(totalInvestment);
  };

  let stockLogo = '';
  let stockName = '';
  let availableCash = 0;

  if (stock) {
    stockLogo = stock.profile_image_url;
    stockName = stock.name;
  }

  if (user) {
    availableCash = user.availableCash;
  }

  let num = 123456789101112349994;

  const numberComma = (num) => {
    if (typeof num === 'number' && String(num).length > 3) {
      num = [...String(num)].reverse().join('');
      let newNum = '';
      for (let i = 0; i < num.length; i++) {
        if (i % 3 === 0 && i !== 0) {
          newNum += ',';
        }
        newNum = newNum + num[i]; //8
      }

      return [...newNum].reverse().join('');
    }
    return num;
  };

  let superNum = 0;

  for (let i = 0; i <= 10; i++) {
    superNum = superNum + i;
  }

  return (
    <>
      <SaleWrapper onClick={showModal}>Sell</SaleWrapper>

      {open === true ? (
        <>
          <ModalWrapper>
            {buy === false ? (
              <>
                <img className='stockLogo' src={stockLogo} />
                <p>
                  Stock Name: <div className='boldText'>{stockName}</div>
                </p>
                <p>
                  Current Price:{' '}
                  <div className='boldText'>${numberComma(currentPrice)}</div>
                </p>
                <p className='boldText'>
                  How many shares would you like to buy?
                </p>

                <input
                  type='text'
                  id='quantity'
                  className='quantity'
                  name='quantity'
                  onChange={(e) => setText(e.target.value)}
                />
                <button className='button' onClick={calculateTotalInvestment}>
                  Calculate
                </button>

                <p>
                  Total Investment:{' '}
                  <div className='boldText'>
                    ${numberComma(totalInvestment)}
                  </div>
                </p>
                <p>
                  Available Cash:{' '}
                  <div className='boldText'>${numberComma(availableCash)}</div>
                </p>

                <button className='button' onClick={purchaseStock}>
                  Sell
                </button>
                <p className='stock-price-disclaimer'>
                  * Current price is the estimated price of the {stockName}{' '}
                  stock
                </p>
                <p className='simulation-disclaimer'>
                  * UpArrow is an investment simulator, you are not buying the
                  actual {stockName} stock
                </p>
              </>
            ) : (
              <ConfirmationWrapper>
                <p className='congratulations'>Congratulations!</p>
                <p className='confirmation-message'>
                  You bought{' '}
                  <span className='boldText'>
                    {numberComma(Number(text))} shares
                  </span>{' '}
                  of <span className='boldText'>{stockName} </span>
                  at{' '}
                  <span className='boldText'>
                    ${numberComma(Number(currentPrice))}!
                  </span>
                </p>
                <p className='remaining-cash'>
                  Remaining Cash:{' '}
                  <span className='boldText'>
                    ${numberComma(availableCash - Number(text) * currentPrice)}
                  </span>
                </p>
                <p className='loading-message'>
                  Redirecting you to your portfolio...
                </p>
              </ConfirmationWrapper>
            )}
          </ModalWrapper>
          <InvisibleCover
            onClick={() => {
              setOpen(false);
            }}
          ></InvisibleCover>
        </>
      ) : null}
    </>
  );
}

export default Sale;
