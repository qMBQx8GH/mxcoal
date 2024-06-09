/*
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        console.info('aaa: ' + this.url);
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            console.info('bbb: ' + this.url);
            if (this.url.includes('https://armory.worldofwarships.ru/ru/api/account/info/')) {
                var dataDOMElement = document.createElement('div');
                dataDOMElement.id = '__interceptedData';
                dataDOMElement.innerText = this.response;
                dataDOMElement.style.height = 0;
                dataDOMElement.style.overflow = 'hidden';
                document.body.appendChild(dataDOMElement);
                console.info(this.response);
            }
        });
        return send.apply(this, arguments);
    };
  })();
*/
(function () {
  const { fetch: origFetch } = window;
  window.fetch = async (...args) => {
    // console.log("fetch called with args:", args);
    const response = await origFetch(...args);
    if (args && args[0].includes('/api/account/info/')) {
      response
        .clone()
        .json()
        .then(body => {
          if (body && !!body.id && !!body.name && !!body.balance) {
            // console.info(body);
            var event = new CustomEvent("onAccountInfo", { detail: body });
            window.dispatchEvent(event);
          }
        })
        .catch(err => console.error(err))
        ;
    }
    if (args && args[0].includes('/api/get_lootbox/')) {
      response
        .clone()
        .json()
        .then(body => {
          // console.info(body);
          if (body && !!body.status && body.status == 'ok' && !!body.data) {
            console.info(' ' + body.data.id + ' ' + body.data.name + ' ' + body.data.title);
          }
        })
        .catch(err => console.error(err))
        ;
    }
    return response;
  };
})();
