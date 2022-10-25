const PriceTable = ({ tickers, prices, setPricesData }) => {
  return (
    <table>
      <tbody>
        {prices.map((price, index) => (
          <tr key={index}>
            <td>{tickers[index]}</td>
            <td>
              <input
                type='number'
                value={price}
                onChange={(e) => {
                  setPricesData((originPrices) => ({
                    ...originPrices,
                    [tickers[index]]: e.target.valueAsNumber,
                  }));
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceTable;
