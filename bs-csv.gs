function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("BS-CSV", [{name: "Save all as csv", functionName: "downloadAsCSV"}]);
};

function showURL(href){
  var template = HtmlService.createTemplateFromFile('download');
  template.url1 = href
  var iframe =  t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(iframe, "Download");
}

function downloadAsCSV() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var csv = "";
  for (var i=0; i<sheets.length; i++) {
    var sheet = sheets[i];
    csv += appendToCSV(sheet, csv) + "\r\n";
  }

  var folder = DriveApp.createFolder(ss.getName().toLowerCase().replace(/ /g,'_'));
  var file = folder.createFile(Date.now().toString() + ".csv", csv);
  var url = file.getUrl();
  showURL(url);
}

function appendToCSV(sheet, csv) {
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getValues();
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row.length]; col++) {
          if (data[row][col] == null || data[row][col] == undefined) {
            continue;
          }
          if (data[row][col].toString().indexOf(",") != -1 || data[row][col].toString().indexOf("\n") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        if (row < data.length-1) {
          csv += append.join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
    }
    return csv;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}

function appendColumnsToCSV(max_column, sheet, csv) {
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getValues();
    if (data.length > 1) {
      var csv = "";
      for (var row = 1; row < data.length; row++) {
        for (var col = 0; col < max_column; col++) {
          if (data[row][col] == null || data[row][col] == undefined) {
            continue;
          }
          if (data[row][col].toString().indexOf(",") != -1 || data[row][col].toString().indexOf("\n") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        if (row < data.length) {
       	  var append = data[row].splice(0, max_column);
       	  for (var i=0; i<max_column; i++) {
       	  	if (append[i] == null || append[i] == undefined) {
       	  	  append[i] == "";
       	  	}
       	  }
          csv += append.join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
    }
    return csv;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}