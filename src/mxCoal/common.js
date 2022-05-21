function textNodesUnder(el) {
    var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()) a.push(n);
    return a;
}

function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('body');
    for (var j = 0; j < objects.length; j++) {
        textNodesUnder(objects[j]).forEach(obj => {
            var valStrH = obj.nodeValue;
            var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
                return v1 ? chrome.i18n.getMessage(v1) : "";
            });

            if (valNewH != valStrH) {
                obj.nodeValue = valNewH;
            }
        });
    }
}

localizeHtmlPage();

function intToDate(intDate) {
    var strDate = intDate.toString();
    return strDate.substring(0, 4) + '-' + strDate.substring(4, 6) + '-' + strDate.substring(6, 8);
}
