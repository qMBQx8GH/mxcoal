function displayData(ctx) {
  chrome.storage.local.get('lastAccountId', items => {
    if (items && items['lastAccountId']) {
      chrome.storage.local.get(items['lastAccountId'], jtems => {
        if (jtems && jtems[items['lastAccountId']] && jtems[items['lastAccountId']]['data']) {
          var accountInfo = jtems[items['lastAccountId']]['info'];

          const columnToDisplay = 3; // Coal
          var labels = [];
          var datas = [];
          var data = jtems[items['lastAccountId']]['data'];
          for (var i = 0; i < data.length; i++) {
            labels.unshift(intToDate(data[i][0]));
            datas.unshift(data[i][columnToDisplay]);
          }

          const myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: chrome.i18n.getMessage('coal'),
                data: datas,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            },
            options: {
              scales: {
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

        }
      });
    }
  });

}
displayData(document.getElementById('myChart'));
