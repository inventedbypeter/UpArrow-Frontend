const PriceTable = ({ tickers, prices, setConfigData }) => {
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
                  setConfigData((config) => ({
                    ...config,
                    prices: {
                      ...config.prices,
                      [tickers[index]]: e.target.valueAsNumber,
                    },
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
