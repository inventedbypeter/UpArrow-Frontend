import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const BuyWrapper = styled.div`
  font-family: sans-serif;
  font-size: 25px;
  color: white;
  border: 1px #34aa52;
  background-color: #34aa52;
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
    background-color: #34aa52;
    border: 1px #34aa52;
    margin-bottom: 15px;
  }

  .error-message {
    font-size: 2.4rem;
    color: red;
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

function Buy({ stockJSON }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const stock = stockJSON;
  const [user, setUser] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [buy, setBuy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userEmail = localStorage.getItem('email');
      const response = await axios(
        `http://localhost:4000/api/v1/user/${userEmail}/email`
      );
      const data = response.data;
      setUser(data);
    };
    getUser();
  }, [totalInvestment, stock]);

  useEffect(() => {
    if (stockJSON) {
      getAverageStockPrice();
    }
  }, [stock]);

  const getAverageStockPrice = async () => {
    const response = await axios.get('http://localhost:4000/api/v1/config');
    const currentStockPrices = response.data.prices;
    console.log('currentStockPrice : ', currentStockPrices);
    console.log('ticker : ', stockJSON.ticker);
    const currentPrice = currentStockPrices[stockJSON.ticker];
    console.log('currentPrice : ', currentPrice);
    setCurrentPrice(currentPrice);
  };

  const showModal = () => setOpen((s) => !s);

  const purchaseStock = async () => {
    const purchaseJSON = {
      userId: String(user._id),
      stockId: String(stock._id),
      quantity: parseInt(text),
      averagePrice: currentPrice,
      totalInvested: totalInvestment,
    };

    try {
      await axios.post(
        'http://localhost:4000/api/v1/investor/purchase',
        purchaseJSON
      );
      setBuy(true);
      localStorage.setItem('investorStrId', purchaseJSON.userId);
      setTimeout(() => {
        router.push('/investor');
      }, 10000);
    } catch (error) {
      setErrorMsg(JSON.stringify(error.message));
      return;
    }
  };

  const calculateTotalInvestment = () => {
    const enteredQuantity = parseInt(text);
    const totalInvestment = currentPrice * enteredQuantity;
    setTotalInvestment(totalInvestment);
  };

  return (
    <>
      <BuyWrapper onClick={showModal}>Buy</BuyWrapper>

      {open ? (
        <>
          <ModalWrapper>
            {!buy ? (
              <>
                <img className='stockLogo' src={stock?.profile_image_url} />
                <p>
                  Stock Name: <div className='boldText'>{stock?.name}</div>
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
                  <div className='boldText'>
                    ${numberComma(user?.availableCash)}
                  </div>
                </p>

                <button className='button' onClick={purchaseStock}>
                  Buy
                </button>
                <p className='error-message'>{errorMsg}</p>
                <p className='stock-price-disclaimer'>
                  * Current price is the estimated price of the {stock?.name}{' '}
                  stock
                </p>
                <p className='simulation-disclaimer'>
                  * UpArrow is an investment simulator, you are not buying the
                  actual {stock?.name} stock
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
                  of <span className='boldText'>{user.stockName} </span>
                  at{' '}
                  <span className='boldText'>
                    ${numberComma(Number(currentPrice))}!
                  </span>
                </p>
                <p className='remaining-cash'>
                  Remaining Cash:{' '}
                  <span className='boldText'>
                    $
                    {numberComma(
                      user.availableCash - Number(text) * currentPrice
                    )}
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

export default Buy;
