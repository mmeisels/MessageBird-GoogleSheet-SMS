function onOpen() {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu('MessageBird')
        .addItem('SendSMS', 'sendAll')
        .addSeparator()
        .addToUi();
  }
  
  function sendSms(to, name, authToken) {
    var messages_url = "https://rest.messagebird.com/messages";
    var payload = {
      "originator": 'MIKESMS',
      "recipients": to,
      "body": "Hi " + name
    };
  
    var options = {
      "method" : "post",
      "payload" : payload
    };
  
    options.headers = { 
      "Authorization": "AccessKey " + authToken
    };
  
    UrlFetchApp.fetch(messages_url, options);
  }
  
  function sendAll() {
    var ui = SpreadsheetApp.getUi();
    var result = ui.prompt("Please enter your Access Token");
    Logger.log(result.getResponseText());
    var authToken=result.getResponseText();
        
    //
    if (result.getResponseText()!=""){
      var ui = SpreadsheetApp.getUi();
      var response = ui.alert('Are you ok to proceed?', ui.ButtonSet.YES_NO);
      
      // Process the user's response.
      if (response == ui.Button.YES) {
        Logger.log('The user clicked "Yes."');
        var sheet = SpreadsheetApp.getActiveSheet();
        var startRow = 2; 
        var numRows = sheet.getLastRow() - 1; 
        var dataRange = sheet.getRange(startRow, 1, numRows, 2) 
        var data = dataRange.getValues();
        
        for (i in data) {
          var row = data[i];
          try {
            
             Logger.log('Sending SMS to ' + row[0]);
            response_data = sendSms(row[0], row[1],authToken);
            status = "sent";
          } catch(err) {
            Logger.log(err);
            status = "error : " + err;
          }
          sheet.getRange(startRow + Number(i), 3).setValue(status);
        }
      }
       else {
             Logger.log('The user clicked "No" or the dialog\'s close button.');
       }
    }else{
      // Display a dialog box with a message and "Yes" and "No" buttons.
      var ui = SpreadsheetApp.getUi();
      var response = ui.alert('You did not enter a token. Please try again', ui.ButtonSet.OK);
      
      // Process the user's response.
      if (response == ui.Button.YES) {
        Logger.log('The user clicked "Yes."');
      } else {
        Logger.log('The user clicked "No" or the dialog\'s close button.');
      }
  }
  }
  
  function myFunction() {
    sendAll();
  }