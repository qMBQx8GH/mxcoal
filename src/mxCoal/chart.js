function MxCoalChart(mainMenu, discountCheckbox, shipSelect, chart, resources = {}) {
  this.lastAccountId = '';
  this.columnToDisplay = 3; //coal
  this.columnLabel = 'coal';
  if (window.location.hash.length > 1) {
    let res = window.location.hash.substring(1);
    Object.keys(resources).forEach(x => {
      if (resources[x].dataset.legend == res) {
        this.columnToDisplay = x;
        this.columnLabel = res;
        resources[x].checked = true;
      }
    });
  }
  this.mainMenu = mainMenu;
  this.discountCheckbox = discountCheckbox;
  this.shipSelect = shipSelect;
  this.chart = new Chart(chart, {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            //unit: 'day'
          },
          ticks: {
            source: 'data'
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'right'
        }
      },
    }
  });
  this.discounts = {
    coal: 0.75,
    steel: 0.75
  }
  //https://coolors.co/palette/012a4a-013a63-01497c-014f86-2a6f97-2c7da0-468faf-61a5c2-89c2d9-a9d6e5
  //012A4A 013A63 01497C 014F86 2A6F97 2C7DA0 468FAF 61A5C2 89C2D9 A9D6E5
  //                X      IX     VIII   VII    VI     V      IV     III
  this.ships = {
    coal: {
      black: {
        color: '#014F86',
        price: 296000
      },
      neustrashimy: {
        color: '#014F86',
        price: 296000
      },
      malta: {
        color: '#01497C',
        price: 268000
      },
      max_immelman: {
        color: '#01497C',
        price: 264000
      },
      grosser_kurfurst: {
        color: '#01497C',
        price: 256000
      },
      napoli: {
        color: '#01497C',
        price: 252000
      },
      yoshino: {
        color: '#01497C',
        price: 248000
      },
      moscow: {
        color: '#01497C',
        price: 244000
      },
      khabarovsk: {
        color: '#01497C',
        price: 240000
      },
      salem: {
        color: '#01497C',
        price: 240000
      },
      alvaro_de_bazan: {
        color: '#014F86',
        price: 238000
      },
      tromp: {
        color: '#014F86',
        price: 238000
      },
      hayate: {
        color: '#014F86',
        price: 238000
      },
      marceau: {
        color: '#01497C',
        price: 236000
      },
      forrest_sherman: {
        color: '#01497C',
        price: 232000
      },
      groningen: {
        color: '#014F86',
        price: 228000
      },
      azuma: {
        color: '#014F86',
        price: 228000
      },
      agir: {
        color: '#014F86',
        price: 228000
      },
      carnot: {
        color: '#014F86',
        price: 228000
      },
      iwami: {
        color: '#014F86',
        price: 228000
      },
      kearsarge: {
        color: '#014F86',
        price: 228000
      },
      tulsa: {
        color: '#014F86',
        price: 228000
      },
      marko_polo: {
        color: '#014F86',
        price: 228000
      },
      z_44: {
        color: '#014F86',
        price: 228000
      },
      pommern: {
        color: '#014F86',
        price: 228000
      },
      flint: {
        color: '#2C7DA0',
        price: 168000
      },
      duke_of_york: {
        color: '#2C7DA0',
        price: 101000
      },
      lazo: {
        color: '#2C7DA0',
        price: 83000
      },
      october_revolution: {
        color: '#61A5C2',
        price: 53500
      },
      rio_de_janeiro: {
        color: '#61A5C2',
        price: 53000
      },
      blyskawica: {
        color: '#2C7DA0',
        price: 51000
      },
      aigle: {
        color: '#468FAF',
        price: 48000
      },
      gallant: {
        color: '#468FAF',
        price: 48000
      },
      kirov: {
        color: '#61A5C2',
        price: 43000
      },
      anshan: {
        color: '#468FAF',
        price: 40000
      },
      hill: {
        color: '#61A5C2',
        price: 38000
      },
      marblehead: {
        color: '#61A5C2',
        price: 34000
      },
      yubari: {
        color: '#89C2D9',
        price: 25500
      },
      campbeltown: {
        color: '#A9D6E5',
        price: 19500
      },
      charleston: {
        color: '#A9D6E5',
        price: 15000
      }
    },
    steel: {
      franklin_d_roosevelt: {
        color: '#013A63',
        price: 33000
      },
      shikishima: {
        color: '#01497C',
        price: 32000
      },
      mecklenburg: {
        color: '#014F86',
        price: 31000
      },
      incomparable: {
        color: '#2A6F97',
        price: 31000
      },
      bourgogne: {
        color: '#2C7DA0',
        price: 30000
      },
      austin: {
        color: '#468FAF',
        price: 29000
      },
      stalingrad: {
        color: '#61A5C2',
        price: 28000
      },
      gato: {
        color: '#61A5C2',
        price: 28000
      },
      plymouth: {
        color: '#89C2D9',
        price: 27000
      },
      ragnar: {
        color: '#A9D6E5',
        price: 27000
      }
    },
    freexp: {
    }
  }

  var _this = this;
  Object.keys(resources).forEach(x => {
    resources[x].addEventListener("click", () => {
      _this.columnToDisplay = x;
      _this.columnLabel = resources[x].dataset.legend;
      window.location.href = "#" + resources[x].dataset.legend;
      _this.displayData();
    });
  });

  this.shipSelect.addEventListener("change", () => {
    _this.changeShip();
  });

  this.discountCheckbox.addEventListener("change", () => {
    _this.changeShip();
  });
}

MxCoalChart.prototype.displayPlayerTabs = function (storageItems) {
  Object.keys(storageItems).forEach(x => {
    switch (x) {
      case 'lastAccountId':
        if (!this.lastAccountId) {
          this.lastAccountId = storageItems[x];
        }
        break;
      default:
        var a = document.getElementById(x);
        if (a) {
          if (a.className.indexOf(' active') >= 0) {
            a.classList.remove('active');
          }
        } else {
          var li = document.createElement('li');
          li.className = 'nav-item';
          this.mainMenu.appendChild(li);
          var a = document.createElement('a');
          a.id = x;
          a.className = 'nav-link';
          a.href = '#';
          a.innerHTML = storageItems[x].info.name;
          var _this = this;
          a.addEventListener("click", () => {
            _this.lastAccountId = x;
            _this.displayData();
            return false;
          });

          li.append(a);
        }
        break;
    }
  });

  if (this.lastAccountId && document.getElementById(this.lastAccountId)) {
    document.getElementById(this.lastAccountId).className += ' active';
  }
}

MxCoalChart.prototype.changeShip = function () {
  if (this.lastAccountId) {
    chrome.storage.local.get(this.lastAccountId, items => {
      if (items && items[this.lastAccountId] && items[this.lastAccountId]['data']) {
        var ships = items[this.lastAccountId]['ships'] || {};
        ships[this.columnLabel] = [this.shipSelect.value, this.discountCheckbox.checked];
        items[this.lastAccountId]['ships'] = ships;
        chrome.storage.local.set(items, () => {
          this.displayData();
        });
      }
    });
  }
}

MxCoalChart.prototype.displayShipsList = function (shipsContainer) {
  for (var i = shipsContainer.options.length - 1; i > 0; i--) {
    shipsContainer.remove(i);
  }
  if (this.ships[this.columnLabel]) {
    Object.keys(this.ships[this.columnLabel]).forEach(ship => {
      var label = chrome.i18n.getMessage(ship) || ship;
      label += ' (' + this.ships[this.columnLabel][ship].price.toLocaleString() + ')';
      shipsContainer.appendChild(new Option(label, ship));
    });
  }
}

MxCoalChart.prototype.adjustShipsList = function (shipsData) {
  if (this.ships[this.columnLabel] && shipsData[this.columnLabel]) {
    this.shipSelect.value = shipsData[this.columnLabel][0];
    this.discountCheckbox.checked = shipsData[this.columnLabel][1];
  } else {
    this.shipSelect.value = '';
    this.discountCheckbox.checked = false;
  }
  this.shipSelect.style.display = this.ships[this.columnLabel] ? '' : 'none';
  this.discountCheckbox.parentElement.style.display = this.discounts[this.columnLabel] ? '' : 'none';
}

MxCoalChart.prototype.sum = function (data) {
  return data.reduce((a, b) => a + b);
}

MxCoalChart.prototype.avg = function (data) {
  return this.sum(data) / data.length;
}

MxCoalChart.prototype.displayChart = function (storageItem) {
  var accountInfo = storageItem['info'];
  var data = storageItem['data'];
  var ships = storageItem['ships'] || [];

  var labels = [];
  var datas = [];
  for (var i = 0; i < data.length; i++) {
    labels.unshift(intToDate(data[i][0]));
    datas.unshift({
      x: labels[0],
      y: data[i][this.columnToDisplay]
    });
  }

  if (labels.length > 0) {
    this.chart.options.scales['x'].min = labels[0];
    this.chart.options.scales['x'].max = labels[labels.length - 1];
    console.info([this.chart.options.scales['x'].min, this.chart.options.scales['x'].max]);
  }

  this.chart.data.datasets = [
    {
      label: chrome.i18n.getMessage(this.columnLabel),
      data: datas,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ];

  var shipPrice = 0;
  var ship = ships[this.columnLabel];
  if (this.ships[this.columnLabel] && ship && this.ships[this.columnLabel][ship[0]]) {
    shipPrice = this.ships[this.columnLabel][ship[0]].price;
    if (ship[1]) {
      shipPrice -= shipPrice * 0.25;
    }
  }

  if (shipPrice > 0 && data.length > 0 && shipPrice > data[0][this.columnToDisplay]) {
    var datas = [];
    var prev_x = false;
    var prev_y = false;
    for (var i = 0; i < data.length; i++) {
      var x = new Date(intToDate(data[i][0]) + 'T00:00:00Z');
      var y = data[i][this.columnToDisplay];
      if (i > 0 && y < prev_y && x < prev_x) {
        var delta = (prev_y - y) / (prev_x - x) * (24 * 3600 * 1000);
        datas.push(delta);
      }
      prev_x = x;
      prev_y = y;
    }
    console.info(datas);
    if (datas.length > 1) {

      var avg = this.avg(datas);
      console.info('avg: ' + avg);

      var sigma = datas.reduce((a, b) => a + (b - avg) * (b - avg), 0) / datas.length;
      console.info('sigma: ' + sigma);

      var dispersion = Math.sqrt(sigma);
      console.info('dispersion: ' + dispersion);

      var min = avg - 1 * dispersion;
      var max = avg + 1 * dispersion;
      console.info([min, max]);

      var filtered = datas.filter(a => a > min && a < max);

      if (filtered.length > 1) {
        avg = this.avg(filtered);
        console.info('avg flt: ' + avg);
        if (avg > 0) {
          var data_ext = [];
          var start_y = data[0][this.columnToDisplay];
          var start_x = new Date(intToDate(data[0][0]));
          console.info([start_y, shipPrice, start_x]);
          data_ext.push({
            x: start_x.toISOString().split('T')[0],
            y: start_y
          });
          do {
            start_y += Math.ceil(avg);
            start_x.setDate(start_x.getDate() + 1);
            data_ext.push({
              x: start_x.toISOString().split('T')[0],
              y: start_y
            });
          } while (start_y < shipPrice);

          this.chart.options.scales['x'].max = start_x.toISOString().split('T')[0];
          this.chart.data.datasets.push({
            label: chrome.i18n.getMessage(this.columnLabel),
            data: [data_ext[0], data_ext[data_ext.length - 1]], //data_ext,
            fill: false,
            borderColor: 'rgb(255, 192, 192)',
            borderDash: [5, 5],
          });
        }
      }
    }
  }

  if (this.ships[this.columnLabel] && ship && this.ships[this.columnLabel][ship[0]]) {
    this.chart.data.datasets.push({
      label: chrome.i18n.getMessage(ship[0]) || ship[0],
      data: [
        { x: this.chart.options.scales['x'].min, y: shipPrice },
        { x: this.chart.options.scales['x'].max, y: shipPrice }
      ],
      fill: false,
      borderColor: this.ships[this.columnLabel][ship[0]].color
    });
  }

  this.chart.update();
}

MxCoalChart.prototype.displayData = function () {
  this.displayShipsList(document.getElementById('ships'));
  chrome.storage.local.get(null, items => {
    this.displayPlayerTabs(items);
    if (this.lastAccountId) {
      chrome.storage.local.get(this.lastAccountId, items => {
        if (items && items[this.lastAccountId] && items[this.lastAccountId]['data']) {
          var ships = items[this.lastAccountId]['ships'] || [];
          this.adjustShipsList(ships);
          this.displayChart(items[this.lastAccountId]);
        }
      });
    }
  });
}
/*
const FORMATS = {
  datetime: 'MMM D, YYYY, h:mm:ss a',
  millisecond: 'h:mm:ss.SSS a',
  second: 'h:mm:ss a',
  minute: 'h:mm a',
  hour: 'hA',
  day: 'MMM D',
  week: 'll',
  month: 'MMM YYYY',
  quarter: '[Q]Q - YYYY',
  year: 'YYYY'
};

window.Chart._adapters._date.override({
  _id: 'moment', // DEBUG ONLY

  formats: function () {
    return FORMATS;
  },

  parse: function (value, format) {
    // console.info(['parse', value, format]);
    const date = new Date(value + 'T00:00:00Z');
    // console.info(['date', date]);
    return date;
  },

  format: function (time, format) {
    // console.info(['format', time, format]);
    var result = '';
    if (!isNaN(time)) {
      const date = new Date(time);
      result = date.getFullYear()
        + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '-' + ('0' + date.getDate()).slice(-2);
    } else {
      result = NaN;
    }
    // console.info(['result', result]);
    return result;
  },

  add: function (time, amount, unit) {
    // console.info(['add', time, amount, unit]);
    if (unit == 'day') {
      const date = new Date(time + (1000 * 60 * 60 * 24) * amount);
      // console.info(['date', date]);
      return date;
    }
  },

  diff: function (max, min, unit) {
    // console.info(['diff', max, min, unit]);
    var date1 = new Date(min);
    var date2 = new Date(max);
    var result = null;
    if (unit == 'day') {
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      result = diffDays;
    }
    // console.info(['result', result]);
    return result;
  },

  startOf: function (time, unit, weekday) {
    // console.info(['startOf', time, unit]);
    if (isNaN(time)) {
      return NaN;
    }
    var date = new Date(time);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    // console.info(['date', date.toISOString()]);
    if (unit == 'day') {
      return date;
    }
  },

  endOf: function (time, unit) {
    var date = new Date(time);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    // console.info(['endOf', time, unit, date.toISOString()]);
    if (unit == 'day') {
      return date + (24 * 60 * 60 * 1000);
    }
  }
});
*/

const mxCoalChart = new MxCoalChart(
  document.getElementById('main-menu'),
  document.getElementById('discount'),
  document.getElementById('ships'),
  document.getElementById('myChart'),
  {
    1: document.getElementById('creditsChart'),
    3: document.getElementById('coalChart'),
    4: document.getElementById('steelChart'),
    6: document.getElementById('freexpChart')
  });
mxCoalChart.displayData();
