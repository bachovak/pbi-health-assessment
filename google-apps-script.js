// ============================================================
// Google Apps Script - Power BI Health Assessment Backend
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com and create a new project
// 2. Replace the default code with this entire file
// 3. Click Deploy > New deployment
// 4. Select type: Web app
// 5. Set "Execute as" to "Me"
// 6. Set "Who has access" to "Anyone"
// 7. Click Deploy and copy the URL
// 8. Paste the URL into the GOOGLE_SCRIPT_URL variable in index.html
// ============================================================

// This function runs when the script receives a POST request
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    Logger.log("Received request type: " + (data.type || "assessment"));
    Logger.log("Data: " + JSON.stringify(data));

    // Handle follow-up request
    if (data.type === 'followup') {
      return handleFollowUpRequest(data);
    }

    var rows = data.rows;

    // Open or create the spreadsheet
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName("Responses") || ss.insertSheet("Responses");

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "ClientName", "Company", "Email", "CompanySize",
        "NumPBIUsers", "NumPBIDevelopers", "AvgHourlyRate",
        "CategoryID", "Category", "Pillar",
        "SubcategoryID", "Subcategory",
        "QuestionID", "Question", "Why", "Weight",
        "Score", "VerbalScoreID", "VerbalScore",
        "RiskScore", "Priority", "Risk", "Fix", "AffectedUsers", "DetailedRiskExplanation", "Comment"
      ];
      sheet.appendRow(headers);

      // Format headers
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1a73e8");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Append each row of data
    rows.forEach(function(row) {
      sheet.appendRow([
        row.Timestamp,
        row.ClientName,
        row.Company,
        row.Email,
        row.CompanySize,
        row.NumPBIUsers,
        row.NumPBIDevelopers,
        row.AvgHourlyRate,
        row.CategoryID,
        row.Category,
        row.Pillar,
        row.SubcategoryID,
        row.Subcategory,
        row.QuestionID,
        row.Question,
        row.Why,
        row.Weight,
        row.Score,
        row.VerbalScoreID,
        row.VerbalScore,
        row.RiskScore,
        row.Priority,
        row.Risk,
        row.Fix,
        row.AffectedUsers,
        row.DetailedRiskExplanation,
        row.Comment
      ]);
    });

    // Auto-resize columns
    for (var i = 1; i <= 27; i++) {
      sheet.autoResizeColumn(i);
    }

    // Optionally send email notification
    sendEmailNotification(rows);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", rowsAdded: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// This function handles GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Power BI Health Assessment backend is running." }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Get or create the spreadsheet to store responses
function getOrCreateSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty("SPREADSHEET_ID");

  Logger.log("Stored SPREADSHEET_ID: " + ssId);

  if (ssId) {
    try {
      var existingSs = SpreadsheetApp.openById(ssId);
      Logger.log("Opened existing spreadsheet: " + existingSs.getUrl());
      return existingSs;
    } catch (e) {
      Logger.log("Could not open spreadsheet (may be deleted): " + e.toString());
      // Clear the old ID so we create a new one
      props.deleteProperty("SPREADSHEET_ID");
    }
  }

  // Create new spreadsheet
  Logger.log("Creating new spreadsheet...");
  var ss = SpreadsheetApp.create("Power BI Health Assessment Responses");
  var newId = ss.getId();
  props.setProperty("SPREADSHEET_ID", newId);

  Logger.log("Created NEW spreadsheet!");
  Logger.log("ID: " + newId);
  Logger.log("URL: " + ss.getUrl());

  return ss;
}

// ============================================================
// EMAIL NOTIFICATION (Optional)
// Change the email address below to receive notifications
// Set to "" to disable email notifications
// ============================================================
var NOTIFICATION_EMAIL = ""; // e.g., "you@example.com"
var FOLLOWUP_EMAIL = "bachovak@gmail.com"; // Email for follow-up requests

// Handle follow-up request and send email
function handleFollowUpRequest(data) {
  try {
    Logger.log("Processing follow-up request for: " + data.name + " at " + data.company);

    if (!FOLLOWUP_EMAIL) {
      Logger.log("Error: FOLLOWUP_EMAIL is not configured");
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Follow-up email not configured" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var subject = "Hot Lead - " + data.name + " | " + data.company;
    var body = "The " + data.name + " from " + data.company + " has requested a follow up.\n\n" +
      "Their email is: " + data.email + "\n" +
      "Company Size: " + (data.companySize || "Not specified") + "\n" +
      "Number of Power BI Users: " + (data.numPBIUsers !== undefined ? data.numPBIUsers : "Not specified") + "\n" +
      "Number of Power BI Developers: " + (data.numPBIDevelopers !== undefined ? data.numPBIDevelopers : "Not specified") + "\n" +
      "Average BI Hourly Rate: EUR " + (data.avgHourlyRate !== undefined ? data.avgHourlyRate : "50 (default)");

    MailApp.sendEmail({
      to: FOLLOWUP_EMAIL,
      subject: subject,
      body: body
    });

    Logger.log("Follow-up email sent successfully to: " + FOLLOWUP_EMAIL);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Follow-up email sent" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in handleFollowUpRequest: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(rows) {
  if (!NOTIFICATION_EMAIL) return;

  var clientName = rows[0].ClientName;
  var company = rows[0].Company;
  var timestamp = rows[0].Timestamp;

  // Build CSV content for attachment
  var headers = Object.keys(rows[0]);
  var csvLines = [headers.join(",")];
  rows.forEach(function(row) {
    var values = headers.map(function(h) {
      var val = String(row[h] || "");
      if (val.indexOf(",") > -1 || val.indexOf('"') > -1 || val.indexOf("\n") > -1) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csvLines.push(values.join(","));
  });
  var csvContent = csvLines.join("\n");

  // Calculate summary scores
  var totalScore = 0;
  var maxScore = 0;
  rows.forEach(function(row) {
    totalScore += row.Score * row.Weight;
    maxScore += 5 * row.Weight;
  });
  var percentage = Math.round((totalScore / maxScore) * 100);

  var subject = "New Power BI Health Assessment: " + company + " - " + clientName;
  var body = "A new Power BI Health Assessment has been completed.\n\n" +
    "Client: " + clientName + "\n" +
    "Company: " + company + "\n" +
    "Email: " + (rows[0].Email || "Not provided") + "\n" +
    "Date: " + timestamp + "\n" +
    "Overall Score: " + percentage + "% (" + totalScore + "/" + maxScore + ")\n\n" +
    "The CSV file is attached. The full data is also available in Google Sheets.";

  var filename = "PBI_Assessment_" + company.replace(/[^a-zA-Z0-9]/g, "_") + "_" + timestamp.slice(0, 10) + ".csv";

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body,
    attachments: [Utilities.newBlob(csvContent, "text/csv", filename)]
  });
}
