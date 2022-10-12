import styled from 'styled-components';

const StockCoverWrapper = styled.div`
  position: relative;
  height: 43rem;
  margin-bottom: 5rem;
  .empty-cover-img {
    background-color: skyblue;
    height: 37rem;
    width: 100%;
  }
  .cover-img {
    height: 37rem;
    width: 100%;
    object-fit: cover;
  }

  .stock-info {
    position: absolute;
    display: flex;
    align-items: flex-end;
    left: 3rem;
    bottom: 0rem;
    .stock-img {
      width: 12rem;
      height: 12rem;
      margin-right: 2rem;
    }
    .stock-name {
      font-size: 4rem;
    }
  }
`;

const StockCover = ({ stockImageUrl, stockCoverImageUrl, stockName }) => {
  return (
    <StockCoverWrapper>
      {stockCoverImageUrl ? (
        <img className='cover-img' src={stockCoverImageUrl} />
      ) : (
        <div className='empty-cover-img'></div>
      )}
      <div className='stock-info'>
        <img
          className='stock-img'
          src={stockImageUrl}
          width='230'
          height='230'
        />
        <h1 className='stock-name'>{stockName}</h1>
      </div>
    </StockCoverWrapper>
  );
};
export default StockCover;
