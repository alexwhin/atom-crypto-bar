const cryptoData = require('./crypto-data')

const currencies = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'bitcoin-cash': 'BCH',
  'ripple': 'XRP',
  'dash': 'DASH',
  'litecoin': 'LTC',
  'monero': 'XMR',
  'neo': 'NEO',
  'nem': 'XEM',
  'ethereum-classic': 'ETC',
  'zcash': 'ZEC',
  'stellar': 'XLM',
  'tether': 'USDT',
  'waves': 'WAVES',
  'stratis': 'STRAT',
  'bitshares': 'BTS'
}

module.exports = {

  config: {
    currency: {
      order: 1,
      'title': 'Conversion currency',
      type: 'string',
      'default': '£',
      'enum': ['£', '$']
    },
    refresh: {
      order: 2,
      'title': 'Refresh rate (seconds)',
      type: 'integer',
      'default': 8
    },
    'bitcoin': {
      type: 'boolean',
      'default': true
    },
    'ethereum': {
      type: 'boolean',
      'default': true
    },
    'bitcoin-cash': {
      type: 'boolean',
      'default': false
    },
    'ripple': {
      type: 'boolean',
      'default': false
    },
    'dash': {
      type: 'boolean',
      'default': false
    },
    'litecoin': {
      type: 'boolean',
      'default': true
    },
    'monero': {
      type: 'boolean',
      'default': false
    },
    'neo': {
      type: 'boolean',
      'default': false
    },
    'nem': {
      type: 'boolean',
      'default': false
    },
    'ethereum-classic': {
      type: 'boolean',
      'default': false
    },
    'zcash': {
      type: 'boolean',
      'default': false
    },
    'stellar': {
      type: 'boolean',
      'default': false
    },
    'tether': {
      type: 'boolean',
      'default': false
    },
    'waves': {
      type: 'boolean',
      'default': false
    },
    'stratis': {
      type: 'boolean',
      'default': false
    },
    'bitshares': {
      type: 'boolean',
      'default': false
    },
  },

  assignFollowing: function() {

    let array = []

    for (let key of Object.keys(currencies)) {
      if (atom.config.get('atom-crypto-bar.' + key)) array.push(key)
    }

    return array
  },

  populate: function() {

    const cryptoBar = document.getElementById('crypo-bar')
    cryptoBar.innerHTML = '' // clear if changing settings

    let follow = this.assignFollowing()
    for (let key of Object.keys(follow)) {

      let shorthand = currencies[follow[key]].toLowerCase()

      cryptoBar.innerHTML += '<li data-description="' + currencies[follow[key]] + '">' +
                               '<img src="atom://atom-crypto-bar/icons/' + shorthand + '.png">' +
                               '<span id="crypo-' + follow[key] + '"></span>' +
                             '</li>'
    }
  },

  fetchData: function() {

    let follow = this.assignFollowing()
    let currency = atom.config.get('atom-crypto-bar.currency')

    for (let key of Object.keys(follow)) {

      cryptoData.fetch(follow[key], currency).then(function (price) {

        let cryptoElement = document.getElementById('crypo-' + follow[key])
        if (cryptoElement == null) {

          let cryptoBar = document.getElementById('crypo-bar')
          cryptoBar.className = 'populate' // prompt reload

        } else {

          cryptoElement.innerHTML = currency + price
        }
      })
    }
  },

  activate: function() {

    let refresh = atom.config.get('atom-crypto-bar.refresh') * 1000
    this.fetchData()

    setInterval(() => {

      let cryptoBar = document.getElementById('crypo-bar')
      if (cryptoBar.classList.contains('populate')) this.populate()
      cryptoBar.className = ''

      this.fetchData()
    }, refresh)
  },

  consumeStatusBar: function(statusBar) {

    /* Create bar container */
    element = document.createElement('ul')
    element.setAttribute('id', 'crypo-bar')
    this.statusBarTile = statusBar.addRightTile({
      item: element,
      priority: 500
    })

    this.populate()
  }
};
