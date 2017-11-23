module.exports = {

  fetch: function(name, currencySymbol) {

    const url = 'https://api.coinmarketcap.com/v1/ticker/' +
                name +
                '/?convert=' +
                ((currencySymbol == '$') ? 'USD' : 'GBP')

    return fetch(url)
    .then(response => response.json())
    .then((response) => {

      const key = 'price_' + ((currencySymbol == '$') ? 'usd' : 'gbp')

      if (!response[0]) {
        return 'n/a'
      } else {
        return parseFloat(response[0][key]).toFixed(2)
      }
    })
  }
}
