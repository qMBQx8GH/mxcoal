function localizeHtmlPage() {
  //Localize by replacing __MSG_***__ meta tags
  var objects = document.getElementsByTagName('html');
  for (var j = 0; j < objects.length; j++) {
    var obj = objects[j];

    var valStrH = obj.innerHTML.toString();
    var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : "";
    });

    if (valNewH != valStrH) {
      obj.innerHTML = valNewH;
    }
  }
}

localizeHtmlPage();

function intToDate(intDate) {
  var strDate = intDate.toString();
  return strDate.substring(0, 4) + '-' + strDate.substring(4, 6) + '-' + strDate.substring(6, 8);
}

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
