function MxCoalPopup(dataTable, accountName) {
  this.dataTable = dataTable;
  this.accountName = accountName;
}

MxCoalPopup.prototype.displayTable = function (accountInfo, data) {
  this.accountName.innerHTML = accountInfo.name;

  const rowsToDisplay = 7;
  const columnsToDisplay = [1, 3, 4, 6];

  var new_tbody = document.createElement('tbody');
  for (var i = 0; i < Math.min(data.length, rowsToDisplay); i++) {
    var newRow = new_tbody.insertRow();
    var newCell = newRow.insertCell();
    var newText = document.createTextNode(intToDate(data[i][0]));
    newCell.appendChild(newText);
    columnsToDisplay.forEach(index => {
      newCell = newRow.insertCell();
      if (i > 0) {
        var newDiv = document.createElement('div');
        var diff = data[i - 1][index] - data[i][index];
        newDiv.className = diff >= 0 ? 'plus' : 'minus';
        newText = document.createTextNode((diff > 0 ? '+' : '') + diff.toLocaleString());
        newDiv.appendChild(newText);
        newCell.appendChild(newDiv);
      }
      newText = document.createTextNode(data[i][index].toLocaleString());
      newCell.appendChild(newText);
    });

    chrome.action.setBadgeText({ text: '' });
  }
  var old_tbody = this.dataTable.getElementsByTagName('tbody')[0];
  this.dataTable.replaceChild(new_tbody, old_tbody);
}

MxCoalPopup.prototype.displayData = function () {
  chrome.storage.local.get('lastAccountId', items => {
    if (items && items['lastAccountId']) {
      chrome.storage.local.get(items['lastAccountId'], jtems => {
        if (jtems && jtems[items['lastAccountId']] && jtems[items['lastAccountId']]['data']) {
          this.displayTable(jtems[items['lastAccountId']]['info'], jtems[items['lastAccountId']]['data']);
        }
      });
    }
  });
}

const mxCoalPopup = new MxCoalPopup(document.getElementById('dataTable'), document.getElementById('accountName'));
mxCoalPopup.displayData();

document.getElementById('chartIcon').addEventListener("click", () => {
  chrome.tabs.create({
    url: 'chart.html'
  });
});
document.getElementById('chartIcon').title = chrome.i18n.getMessage('chart');

document.getElementById('dataIcon').addEventListener("click", () => {
  chrome.tabs.create({
    url: 'data.html'
  });
  return false;
});
document.getElementById('dataIcon').title = chrome.i18n.getMessage('data');

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
  mxCoalPopup.displayData();
});