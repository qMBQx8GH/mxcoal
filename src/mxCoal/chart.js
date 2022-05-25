function MxCoalChart(mainMenu, chart, resources = {}) {
  this.lastAccountId = '';
  this.columnToDisplay = 3; //coal
  this.columnLabel = 'coal';
  this.mainMenu = mainMenu;
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
            unit: 'day'
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
  //https://coolors.co/palette/012a4a-013a63-01497c-014f86-2a6f97-2c7da0-468faf-61a5c2-89c2d9-a9d6e5
  //012A4A 013A63 01497C 014F86 2A6F97 2C7DA0 468FAF 61A5C2 89C2D9 A9D6E5
  //                X      IX     VIII   VII    VI     V      IV     III
  this.ships = {
    coal: {
      blyskawica: {
        color: '#2C7DA0',
        price: 51000,
      },
      aigle: {
        color: '#468FAF',
        price: 48000,
      },
      gallant: {
        color: '#468FAF',
        price: 48000,
      },
      kirov: {
        color: '#61A5C2',
        price: 43000,
      },
      anshan: {
        color: '#468FAF',
        price: 40000,
      },
      hill: {
        color: '#61A5C2',
        price: 38000,
      },
      marblehead: {
        color: '#61A5C2',
        price: 34000,
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
    }
  }

  var _this = this;
  Object.keys(resources).forEach(x => {
    resources[x].addEventListener("click", () => {
      _this.columnToDisplay = x;
      _this.columnLabel = resources[x].dataset.legend;
      _this.displayData();
    });
  });
}

MxCoalChart.prototype.displayData = function () {
  var ships = document.getElementById('ships');
  ships.innerHTML = '';
  if (this.ships[this.columnLabel]) {
    Object.keys(this.ships[this.columnLabel]).forEach(ship => {
      var div = document.createElement('div');
      div.className = 'form-check';
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = 'checked'; //TODO
      checkbox.className = 'form-check-input';
      checkbox.id = 'ship-' + ship;
      checkbox.dataset.ship = ship;
      var _this = this;
      checkbox.addEventListener("click", () => {
        if (_this.lastAccountId) {
          chrome.storage.local.get(_this.lastAccountId, items => {
            if (items && items[_this.lastAccountId] && items[_this.lastAccountId]['data']) {
              var ships = items[_this.lastAccountId]['ships'] ? items[_this.lastAccountId]['ships'] : [];
              if (checkbox.checked && ships.includes(checkbox.dataset.ship)) {
                ships.splice(ships.indexOf(checkbox.dataset.ship), 1);
                chrome.storage.local.set(items, () => {
                  _this.displayData();
                });
              }
              if (!checkbox.checked && !ships.includes(checkbox.dataset.ship)) {
                ships.push(checkbox.dataset.ship);
                items[_this.lastAccountId]['ships'] = ships;
                chrome.storage.local.set(items, () => {
                  _this.displayData();
                });
              }
            }
          });
        }
        return false;
      });
      div.appendChild(checkbox);
      var label = document.createElement('label');
      label.className = 'form-check-label';
      label.htmlFor = checkbox.id;
      label.innerHTML = chrome.i18n.getMessage(ship) || ship;
      div.appendChild(label);
      ships.appendChild(div);
    })
  }
  chrome.storage.local.get(null, items => {
    Object.keys(items).forEach(x => {
      switch (x) {
        case 'lastAccountId':
          if (!this.lastAccountId) {
            this.lastAccountId = items[x];
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
            a.innerHTML = items[x].info.name;
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
    if (this.lastAccountId) {
      chrome.storage.local.get(this.lastAccountId, items => {
        if (items && items[this.lastAccountId] && items[this.lastAccountId]['data']) {
          var accountInfo = items[this.lastAccountId]['info'];
          var data = items[this.lastAccountId]['data'];
          var ships = items[this.lastAccountId]['ships'] ? items[this.lastAccountId]['ships'] : [];

          var labels = [];
          var datas = [];
          for (var i = 0; i < data.length; i++) {
            labels.unshift(intToDate(data[i][0]));
            datas.unshift({
              x: labels[0],
              y: data[i][this.columnToDisplay]
            });
            if (i == 0) this.chart.options.scales['x'].max = labels[0];
          }
          this.chart.options.scales['x'].min = labels[0];
          console.info([this.chart.options.scales['x'].max]);
          //this.data.labels = labels;
          this.chart.data.datasets = [
            {
              label: chrome.i18n.getMessage(this.columnLabel),
              data: datas,
              fill: false,
              borderColor: '#012A4A',
              tension: 0.1
            }
          ];
          Object.keys(this.ships[this.columnLabel]).forEach(ship => {
            if (ships.includes(ship)) {
              document.getElementById('ship-' + ship).checked = false;
            } else {
              this.chart.data.datasets.push({
                label: chrome.i18n.getMessage(ship) || ship,
                data: [
                  { x: this.chart.options.scales['x'].min, y: this.ships[this.columnLabel][ship].price },
                  { x: this.chart.options.scales['x'].max, y: this.ships[this.columnLabel][ship].price }
                ],
                fill: false,
                borderColor: this.ships[this.columnLabel][ship].color,

              });
            }
          });

          this.chart.update();
        }
      });
    }
  });
}

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
    console.info(['parse', value, format]);
    const date = new Date(value + 'T00:00:00Z');
    console.info(['date', date]);
    return date;
  },

  format: function (time, format) {
    console.info(['format', time, format]);
    var result = '';
    if (!isNaN(time)) {
      const date = new Date(time);
      result = date.getFullYear()
        + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '-' + ('0' + date.getDate()).slice(-2);
    } else {
      result = NaN;
    }
    console.info(['result', result]);
    return result;
  },

  add: function (time, amount, unit) {
    console.info(['add', time, amount, unit]);
    if (unit == 'day') {
      const date = new Date(time + (1000 * 60 * 60 * 24) * amount);
      console.info(['date', date]);
      return date;
    }
  },

  diff: function (max, min, unit) {
    console.info(['diff', max, min, unit]);
    var date1 = new Date(min);
    var date2 = new Date(max);
    var result = null;
    if (unit == 'day') {
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      result = diffDays;
    }
    console.info(['result', result]);
    return result;
  },

  startOf: function (time, unit, weekday) {
    console.info(['startOf', time, unit]);
    if (isNaN(time)) {
      return NaN;
    }
    var date = new Date(time);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    console.info(['date', date.toISOString()]);
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
    console.info(['endOf', time, unit, date.toISOString()]);
    if (unit == 'day') {
      return date + (24 * 60 * 60 * 1000);
    }
  }
});

const mxCoalChart = new MxCoalChart(document.getElementById('main-menu'), document.getElementById('myChart'), {
  1: document.getElementById('creditsChart'),
  3: document.getElementById('coalChart'),
  4: document.getElementById('steelChart'),
  6: document.getElementById('freexpChart')
});
mxCoalChart.displayData();
