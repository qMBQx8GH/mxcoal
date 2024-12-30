function interceptData() {
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.src = chrome.runtime.getURL('injectedScript.js');
  xhrOverrideScript.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(xhrOverrideScript);
  console.info('[MXCOAL] Start');
}
function checkForDOM() {
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

window.addEventListener("onAccountInfo", function (evt) {
  var todayDate = new Date();
  var today = parseInt(
    todayDate.getFullYear()
    + ('0' + (todayDate.getMonth() + 1)).slice(-2)
    + ('0' + todayDate.getDate()).slice(-2)
  );
  // console.info(evt.detail);
  var accountInfo = evt.detail;
  var accountId = accountInfo.id.toString() + 'v2';
  if (!this.cache) {
    this.cache = {}
  }
  if (
    !this.cache['lastAccountId']
    || this.cache['lastAccountId'] != accountId
  ) {
    this.cache['lastAccountId'] = accountId;
    chrome.storage.local.set({ lastAccountId: accountId });
    // console.info('lastAccountId: ' + accountId);
  }
  if (
    this.cache[accountId]
    && this.cache[accountId]['data']
    && this.cache[accountId]['data'][0][0] == today
  ) {
    // console.info('cache hit');
    return;
  }
  chrome.storage.local.get(accountId, items => {
    // console.info(['get', items]);
    if (
      items
      && items[accountId]
      && items[accountId]['data']
      && items[accountId]['data'][0][0] == today
    ) {
      this.cache[accountId] = items[accountId];
    } else {
      var modified = {};
      modified[accountId] = {
        data: items[accountId] && items[accountId]['data'] ? items[accountId]['data'] : [],
        ships: items[accountId] && items[accountId]['ships'] ? items[accountId]['ships'] : {},
        info: {
          name: accountInfo.name
        }
      };

      var b = ['credits', 'gold', 'coal', 'steel', 'paragon_xp', 'free_xp'];
      for (var i = 0; i < b.length; i++) {
        var found = 0;
        for (var j = 0; j < accountInfo.balance.length; j++) {
          if (accountInfo.balance[j].currency == b[i]) {
            found = parseInt(accountInfo.balance[j].value) || 0;
            break;
          }
        }
        b[i] = found;
      }
      b.unshift(today);

      modified[accountId].data.unshift(b);
      chrome.storage.local.set(modified);
      // console.info(['set', modified]);
      this.cache[accountId] = modified[accountId];
      chrome.runtime.sendMessage(undefined, {'setBadgeText': '1'});
    }
  });
}, false);
