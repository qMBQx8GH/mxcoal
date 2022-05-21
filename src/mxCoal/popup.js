function populateData(dataTable, accountName) {
  var old_tbody = dataTable.getElementsByTagName('tbody')[0];
  var new_tbody = document.createElement('tbody');
  //populate_with_new_rows(new_tbody);
  chrome.storage.local.get('lastAccountId', items => {
    if (items && items['lastAccountId']) {
      chrome.storage.local.get(items['lastAccountId'], jtems => {
        if (jtems && jtems[items['lastAccountId']] && jtems[items['lastAccountId']]['data']) {
          var accountInfo = jtems[items['lastAccountId']]['info'];
          accountName.innerHTML = accountInfo.name;

          const rowsToDisplay = 7;
          const columnsToDisplay = [1, 3, 4, 6];
          var data = jtems[items['lastAccountId']]['data'];
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
          }
        }
      });
    }
  });
  dataTable.replaceChild(new_tbody, old_tbody);
}
populateData(document.getElementById('dataTable'), document.getElementById('accountName'));

document.getElementById('chartIcon').addEventListener("click", () => {
  chrome.tabs.create({
    url: 'chart.html'
  });
});

document.getElementById('dataLink').addEventListener("click", () => {
  chrome.tabs.create({
    url: 'data.html'
  });
  return false;
});
