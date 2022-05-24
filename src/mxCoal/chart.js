function displayData(mainMenu, lastAccountId = '') {
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
          mainMenu.appendChild(li);
          var a = document.createElement('a');
          a.id = x;
          a.className = 'nav-link';
          a.href = '#';
          a.innerHTML = items[x].info.name;
          a.addEventListener("click", () => {
            displayData(mainMenu, x);
            return false;
          });

          li.append(a);
        }
      } else if (!lastAccountId) {
        lastAccountId = items[x];
      }
    });
    if (lastAccountId && document.getElementById(lastAccountId)) {
      document.getElementById(lastAccountId).className += ' active';
    }
    if (lastAccountId) {
      chrome.storage.local.get(lastAccountId, jtems => {
        if (jtems && jtems[lastAccountId] && jtems[lastAccountId]['data']) {
          var accountInfo = jtems[lastAccountId]['info'];

          const columnToDisplay = 3; // Coal
          var labels = [];
          var datas = [];
          var data = jtems[lastAccountId]['data'];
          for (var i = 0; i < data.length; i++) {
            labels.unshift(intToDate(data[i][0]));
            datas.unshift({
              x: labels[0],
              y: data[i][columnToDisplay]
            });
            if (i == 0) window.mxCoalChart.options.scales['x'].max = labels[0];
          }
          window.mxCoalChart.options.scales['x'].min = labels[0];
          console.info([window.mxCoalChart.options.scales['x'].max]);
          //window.mxCoalChart.data.labels = labels;
          window.mxCoalChart.data.datasets = [
            {
              label: chrome.i18n.getMessage('coal'),
              data: datas,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ];

          window.mxCoalChart.update();
        }
      });
    }
  });
}
displayData(document.getElementById('main-menu'));

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


window.mxCoalChart = new Chart(document.getElementById('myChart'), {
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
    }
  }
});