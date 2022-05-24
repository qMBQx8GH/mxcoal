function MxCoalChart(mainMenu, chart, settings = {}) {
  this.lastAccountId = '';
  this.columnToDisplay = 3; //coal
  this.columnLabel = chrome.i18n.getMessage('coal');
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
		display: false,
          position: 'right'
        }
      },
      animation: {
      onComplete: function() {
//  debugger;
         var ctx = this.ctx;
//         ctx.font = this.scale.font;
//         ctx.fillStyle = this.scale.textColor
//         ctx.textAlign = "center";
//         ctx.textBaseline = "bottom";

//         this.datasets.forEach(function (dataset) {
//             dataset.points.forEach(function (points) {
//                 ctx.fillText(points.value, points.x, points.y - 10);
//             });
//         })
	      var canvasWidthvar = this.canvas.width;
                var canvasHeight = this.canvas.height;
                var constant = 114;
                var fontsize = (canvasHeight / constant).toFixed(2);
                //ctx.font="2.8em Verdana";
                ctx.font = fontsize + "em Verdana";
                ctx.textBaseline = "middle";
                var total = 90;

                var tpercentage = "33%";
                console.log(total);
                var textWidth = ctx.measureText(tpercentage).width;

                var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                ctx.fillText(tpercentage, txtPosx, canvasHeight / 2);
    }    }}
  });
  var _this = this;
  Object.keys(settings).forEach( x => {
    settings[x].addEventListener("click", () => {
      _this.columnToDisplay = x;
      _this.columnLabel = chrome.i18n.getMessage(settings[x].dataset.legend);
      _this.displayData();
    });
  });
}

MxCoalChart.prototype.displayData = function () {
  chrome.storage.local.get(null, items => {
    Object.keys(items).forEach(x => {
      if (x != 'lastAccountId') {
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
      } else if (!this.lastAccountId) {
        this.lastAccountId = items[x];
      }
    });
    if (this.lastAccountId && document.getElementById(this.lastAccountId)) {
      document.getElementById(this.lastAccountId).className += ' active';
    }
    if (this.lastAccountId) {
      chrome.storage.local.get(this.lastAccountId, items => {
        if (items && items[this.lastAccountId] && items[this.lastAccountId]['data']) {
          var accountInfo = items[this.lastAccountId]['info'];

          var labels = [];
          var datas = [];
          var data = items[this.lastAccountId]['data'];
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
              label: this.columnLabel,
              data: datas,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ];
	  this.chart.data.datasets.push({
		  label: 'charleston',
		  data: [
		  {x: this.chart.options.scales['x'].min, y: 15000},
		  {x: this.chart.options.scales['x'].max, y: 15000}
		  ],
		  fill: false,
		  borderColor: 'rgb(127, 0, 0)',

	});
	  this.chart.data.datasets.push({
		  label: 'Marblehead',
		  data: [
		  {x: this.chart.options.scales['x'].min, y: 34000},
		  {x: this.chart.options.scales['x'].max, y: 34000}
		  ],
		  fill: false,
		  borderColor: 'rgb(127, 0, 0)',

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
