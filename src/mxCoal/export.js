function displayData(ctx) {
  chrome.storage.local.get(null, items => {
    ctx.value = JSON.stringify(items)
  });
}
displayData(document.getElementById('myData'));

function saveData(ctx) {
  const data = JSON.parse(ctx.value);
  console.info(data);
  chrome.storage.local.get(null, items => {
    var toRemove = [];
    if (items) {
      Object.keys(items).forEach(x => {
        if (!data.hasOwnProperty(x)) {
          toRemove.push(x);
        }
      });
    }
    if (toRemove.length > 0) {
      console.info(toRemove);
      chrome.storage.local.remove(toRemove, function () {
        chrome.storage.local.set(data);
      });
    }
    else {
      chrome.storage.local.set(data);
    }
  });
}

function mergeData(ctx) {
  const data = JSON.parse(ctx.value);
  console.info(data);
  for (const accountId in data) {
    chrome.storage.local.get(accountId, items => {
      var dates = {};
      if (items && items[accountId] && items[accountId]['data']) {
        for (const x in items[accountId]['data']) {
          const dateData = items[accountId]['data'][x];
          dates[dateData[0]] = dateData;
        }
      }
      if (data[accountId]['data']) {
        for (const x in data[accountId]['data']) {
          const dateData = data[accountId]['data'][x];
          dates[dateData[0]] = dateData;
        }
      }
      var dateList = Object.keys(dates);
      if (dateList.length) {
        dateList.sort().reverse();
        var modified = {};
        modified[accountId] = {
          data: [],
          ships: items[accountId] && items[accountId]['ships'] ? items[accountId]['ships'] : {},
          info: items[accountId] && items[accountId]['info'] ? items[accountId]['info'] : {},
        };
        for (const x in dateList) {
          modified[accountId].data.push(dates[dateList[x]]);
        }
        console.info(modified);
        chrome.storage.local.set(modified);
      }
    });
  }
}

function downloadData(ctx) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([ctx.value], {
      type: "application/json"
    })
  );
  a.setAttribute("download", "mxCoal.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function uploadData(evt) {
  let files = evt.target.files; // FileList object

  // use the 1st file from the list
  let f = files[0];

  let reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {

      document.getElementById('myData').value = e.target.result;
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}

document.getElementById('mergeData').addEventListener('click', function () { mergeData(document.getElementById('myData')); }, false);
document.getElementById('saveData').addEventListener('click', function () { saveData(document.getElementById('myData')); }, false);
document.getElementById('displayData').addEventListener('click', function () { displayData(document.getElementById('myData')); }, false);
document.getElementById('downloadData').addEventListener('click', function () { downloadData(document.getElementById('myData')); }, false);
document.getElementById('uploadData').addEventListener('change', uploadData, false);
