function onOpen() {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu('MessageBird')
        .addItem('SendWhatsapp', 'sendAll')
        .addSeparator()
        .addToUi();
  }
  
  function sendSms(to, fromID, namespace, templateName,param1,param2, authToken) {
    Logger.log(to);
    Logger.log(fromID);
    Logger.log(namespace);
    Logger.log(templateName);
    Logger.log(param1);
    Logger.log(param2);
    
    var messages_url = "https://conversations.messagebird.com/v1/send";
    var payload = {
      "to": to,
      "from":fromID,
      "type": "hsm",
      "content": {
        "hsm": {
          "namespace": namespace,
          "templateName": templateName,
          "language": {
            "policy": "deterministic",
            "code": "en"
          },
        "params": [
            {
              "default": param1
            },
            {
              "default": param2
            }
        ]
        }
      }
    };
    payload = JSON.stringify(payload);
    Logger.log(payload);
    //var payload = {
    //  "originator": 'MIKESMS',
    //  "recipients": to,
    //  "type":"flash",
    //  "body": "Hi " + name
    //};
  
    var options = {
      "method" : "post",
      "payload" : payload
    };
  
    options.headers = { 
      "Authorization": "AccessKey " + authToken
    };
  
    var response = UrlFetchApp.fetch(messages_url, options);
    Logger.log(response.getContentText().id);
    return response;
  }
  
  function sendAll() {
    Logger.log("hello");
   
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
        var numRows = sheet.getLastRow()-1; 
        var dataRange = sheet.getRange(startRow, 1, numRows, 6) 
        var data = dataRange.getValues();
        
        for (i in data) {
          var row = data[i];
          try {
            
             Logger.log('Sending SMS to ' + row[0]);
            response_data = sendSms(row[0],row[1],row[2],row[3],row[4],row[5],authToken);
            Logger.log(response_data);
            status = JSON.parse(response_data);
            sheet.getRange(startRow + Number(i), 7).setValue(status.id);
            sheet.getRange(startRow + Number(i), 8).setValue(status.status);
          } catch(err) {
            Logger.log(err);
            status = "error : " + err;
            sheet.getRange(startRow + Number(i), 9).setValue(status);
          }
          
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