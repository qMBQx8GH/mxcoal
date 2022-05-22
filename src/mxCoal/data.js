function populateData(mainMenu, dataTable, lastAccountId = '') {
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
            populateData(mainMenu, dataTable, x);
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
  });
  var old_tbody = dataTable.getElementsByTagName('tbody')[0];
  var new_tbody = document.createElement('tbody');
  //populate_with_new_rows(new_tbody);
  chrome.storage.local.get('lastAccountId', items => {
    if (items && lastAccountId) {
      chrome.storage.local.get(lastAccountId, jtems => {
        if (jtems && jtems[lastAccountId] && jtems[lastAccountId]['data']) {
          var accountInfo = jtems[lastAccountId]['info'];

          const columnsToDisplay = [1, 3, 4, 6];
          var data = jtems[lastAccountId]['data'];
          for (var i = 0; i < data.length; i++) {
            var newRow = new_tbody.insertRow();

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(intToDate(data[i][0]));
            newCell.appendChild(newText);

            columnsToDisplay.forEach(index => {
              newCell = newRow.insertCell();
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
populateData(document.getElementById('main-menu'), document.getElementById('dataTable'));
