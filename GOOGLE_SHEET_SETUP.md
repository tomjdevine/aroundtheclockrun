# Google Sheet Setup Instructions

Follow these steps to set up Google Sheets integration for the registration form:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Around the Clock Run Registrations" (or any name you prefer)
4. In the first row, add these column headers:
   - A1: Timestamp
   - B1: Team Name
   - C1: Team Captain
   - D1: Email
   - E1: Phone
   - F1: Description
   - G1: Team Members

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the current timestamp
    const timestamp = new Date();
    
    // Add the data to the sheet
    sheet.appendRow([
      timestamp,
      data.teamName || '',
      data.teamCaptain || '',
      data.email || '',
      data.phone || '',
      data.description || '',
      data.teamMembers || ''
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration received'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function to verify setup
function test() {
  const testData = {
    teamName: 'Test Team',
    teamCaptain: 'John Doe',
    email: 'test@example.com',
    phone: '+31 123 456 789',
    description: 'Test description',
    teamMembers: 'John Doe\nJane Smith\nBob Johnson'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(mockEvent);
}
```

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set the following:
   - **Description**: "Registration Form Handler" (or any description)
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (this is required for the form to work)
4. Click **Deploy**
5. **Copy the Web App URL** that appears (it will look like: `https://script.google.com/macros/s/.../exec`)

## Step 4: Update the Website

1. Open `script.js` in your project
2. Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL you copied
4. Save and deploy your website

## Step 5: Test

1. Submit a test registration through your website
2. Check your Google Sheet - you should see the data appear in a new row

## Security Note

The Web App URL will be public in your JavaScript code. This is fine for form submissions, but be aware that:
- Anyone with the URL can submit data to your sheet
- Consider adding basic validation or rate limiting in your Apps Script if needed
- The sheet itself should remain private (only you have edit access)

## Troubleshooting

- **Data not appearing**: Make sure "Who has access" is set to "Anyone" in the deployment settings
- **CORS errors**: The code uses `mode: 'no-cors'` which should handle this, but if you see errors, check the Apps Script deployment settings
- **Permission errors**: Make sure you've authorized the Apps Script when prompted

