function localizeHtmlPage()
{
  //Localize by replacing __MSG_***__ meta tags
  var objects = document.getElementsByTagName('html');
  for (var j = 0; j < objects.length; j++)
  {
      var obj = objects[j];

      var valStrH = obj.innerHTML.toString();
      var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
          return v1 ? chrome.i18n.getMessage(v1) : "";
      });

      if (valNewH != valStrH) {
          obj.innerHTML = valNewH;
      }
  }
}

localizeHtmlPage();

function intToDate(intDate)
{
  var strDate = intDate.toString();
  return strDate.substring(0, 4) + '-' + strDate.substring(4, 6) + '-' + strDate.substring(6, 8);
}

function displayData(ctx)
{
  chrome.storage.sync.get(null, items => {
    ctx.value = JSON.stringify(items)
  });
}
displayData(document.getElementById('myData'));

function saveData(ctx)
{
	const data = JSON.parse(ctx.value);
	console.info(data);
	chrome.storage.sync.get(null, items => {
		var toRemove = [];
		if (items) {
			Object.keys(items).forEach(x => {
				if (!data.hasOwnProperty(x)) {
				 toRemove.push(x);
				}
			});
		}
		if (toRemove.length > 0)
		{
			console.info(toRemove);
			chrome.storage.sync.remove(toRemove, function() {
				chrome.storage.sync.set(data);
			});
		}
		else
		{
			chrome.storage.sync.set(data);
		}
  });
}

function downloadData(ctx)
{
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
    reader.onload = (function(theFile) {
        return function(e) {

          document.getElementById('myData').value = e.target.result;
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
  }

document.getElementById('saveData').addEventListener('click', function() {saveData(document.getElementById('myData'));}, false);
document.getElementById('displayData').addEventListener('click', function() {displayData(document.getElementById('myData'));}, false);
document.getElementById('downloadData').addEventListener('click', function() {downloadData(document.getElementById('myData'));}, false);
document.getElementById('uploadData').addEventListener('change', uploadData, false);