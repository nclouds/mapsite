/**
 * Google Apps Script to export MAP Checklist from Sheets to JSON
 * This version includes token protection for cross-origin access
 * 
 * Instructions:
 * 1. Replace your existing code with this script
 * 2. Save the project
 * 3. Deploy > New deployment > Web app
 * 4. Execute as: "Me" (your email)
 * 5. Who has access: "Anyone"
 */

const SHEET_ID = '1igp2UOuz1GEIXqmGMOhKfIYyTEPYGNGeDyaQjKx6kFM'; // Your sheet ID

// Add this function to your Apps Script to create a proxy endpoint

function doPost(e) {
  try {
    // This endpoint will accept POST requests and return JSON with CORS headers
    const ACCESS_TOKEN = 'nclouds-map-2024';
    
    // Parse the POST data
    const postData = JSON.parse(e.postData.contents);
    
    // Check for token
    if (postData.token !== ACCESS_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Invalid token' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Generate and return the data
    const checklistData = generateJSON();
    
    return ContentService
      .createTextOutput(JSON.stringify(checklistData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Google Apps Script with JSONP support for cross-origin requests
 * This works with GitHub Pages and other external sites
 */
function doGet(e) {
  try {
    // Simple token protection
    const ACCESS_TOKEN = 'nclouds-map-2024'; // Change this to something secure
    
    // Check for token
    if (e.parameter.token !== ACCESS_TOKEN) {
      const errorResponse = { error: 'Invalid or missing access token' };
      
      if (e.parameter.callback) {
        return ContentService
          .createTextOutput(e.parameter.callback + '(' + JSON.stringify(errorResponse) + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify(errorResponse))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Token is valid, proceed with data generation
    const callback = e.parameter.callback;
    const checklistData = generateJSON();
    
    if (callback) {
      // JSONP response
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(checklistData) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON
      return ContentService
        .createTextOutput(JSON.stringify(checklistData))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    const errorResponse = { error: error.toString() };
    
    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify(errorResponse) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

// ===== MENU AND UI FUNCTIONS =====

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('MAP Checklist')
    .addItem('Export to JSON', 'exportToJSON')
    .addItem('Download JSON', 'downloadJSON')
    .addItem('Validate Sheet Structure', 'validateSheets')
    .addSeparator()
    .addItem('Test Web App Access', 'testWebAppAccess')
    .addToUi();
}

/**
 * Test the Web App deployment
 */
function testWebAppAccess() {
  const ui = SpreadsheetApp.getUi();
  const userEmail = Session.getActiveUser().getEmail();
  
  const message = `Current user: ${userEmail}\n\n` +
    `This deployment uses token-based authentication.\n\n` +
    `To test the API:\n` +
    `1. Deploy as Web App (Deploy > New deployment)\n` +
    `2. Execute as: "Me" (your email)\n` +
    `3. Who has access: "Anyone"\n` +
    `4. Test URL: {deployment_url}?token=nclouds-map-2024\n` +
    `5. For JSONP: {deployment_url}?token=nclouds-map-2024&callback=handleData`;
  
  ui.alert('Web App Access Test', message, ui.ButtonSet.OK);
}

function exportToJSON() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Get metadata
    const metadataSheet = ss.getSheetByName('Metadata');
    const metadata = getMetadata(metadataSheet);
    
    // Get resources
    const resourcesSheet = ss.getSheetByName('Resources');
    const resources = getResources(resourcesSheet);
    
    // Get checklist items
    const checklistSheet = ss.getSheetByName('Checklist');
    const phases = getPhases(checklistSheet);
    
    // Construct final JSON
    const jsonData = {
      metadata: metadata,
      resources: resources,
      phases: phases
    };
    
    // Save to Drive
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = Utilities.newBlob(jsonString, 'application/json', 'checklist-data.json');
    const file = DriveApp.createFile(blob);
    
    // Show success message with link
    const ui = SpreadsheetApp.getUi();
    const result = ui.alert(
      'Export Successful!',
      `JSON file created: ${file.getName()}\n\nFile URL: ${file.getUrl()}\n\nWould you like to open it?`,
      ui.ButtonSet.YES_NO
    );
    
    if (result == ui.Button.YES) {
      const html = `<script>window.open('${file.getUrl()}', '_blank');google.script.host.close();</script>`;
      ui.showModelessDialog(HtmlService.createHtmlOutput(html), 'Opening file...');
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

function downloadJSON() {
  try {
    const jsonData = generateJSON();
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Create download dialog
    const html = HtmlService.createHtmlOutput(`
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Download JSON File</h3>
        <p>Click the button below to download your checklist data:</p>
        <button onclick="downloadFile()" style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
          Download checklist-data.json
        </button>
        <div id="json-preview" style="margin-top: 20px; max-height: 300px; overflow-y: auto; background: #f5f5f5; padding: 10px; border-radius: 4px; display: none;">
          <h4>Preview:</h4>
          <pre style="font-size: 12px; white-space: pre-wrap;">${jsonString.substring(0, 1000)}...</pre>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          After downloading, place this file in the same directory as your index.html file.
        </p>
      </div>
      <script>
        function downloadFile() {
          const jsonData = ${jsonString};
          const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'checklist-data.json';
          a.click();
          URL.revokeObjectURL(url);
          document.getElementById('json-preview').style.display = 'block';
        }
      </script>
    `)
    .setWidth(600)
    .setHeight(500);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Download JSON');
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

// ===== DATA PROCESSING FUNCTIONS =====

function generateJSON() {
  // Use openById instead of getActiveSpreadsheet
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Get metadata
  const metadataSheet = ss.getSheetByName('Metadata');
  const metadata = getMetadata(metadataSheet);
  
  // Update lastUpdated field with current date and time
  updateLastUpdated(metadataSheet);
  
  // Get resources
  const resourcesSheet = ss.getSheetByName('Resources');
  const resources = getResources(resourcesSheet);
  
  // Get checklist items
  const checklistSheet = ss.getSheetByName('Checklist');
  const phases = getPhases(checklistSheet);
  
  return {
    metadata: metadata,
    resources: resources,
    phases: phases
  };
}

/**
 * Update the lastUpdated field in the Metadata sheet
 */
function updateLastUpdated(metadataSheet) {
  if (!metadataSheet) return;
  
  const data = metadataSheet.getDataRange().getValues();
  const currentDateTime = new Date().toISOString();
  
  // Find the lastUpdated row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'lastUpdated' || data[i][0] === 'LastUpdated') {
      // Update the value in column B
      metadataSheet.getRange(i + 1, 2).setValue(currentDateTime);
      return;
    }
  }
  
  // If lastUpdated doesn't exist, add it
  const lastRow = metadataSheet.getLastRow();
  metadataSheet.getRange(lastRow + 1, 1).setValue('lastUpdated');
  metadataSheet.getRange(lastRow + 1, 2).setValue(currentDateTime);
}

/**
 * Helper function to get column index by header name (case-insensitive)
 */
function getColumnIndex(headers, columnName) {
  // Try exact match first
  let index = headers.indexOf(columnName);
  
  // If not found, try case-insensitive match
  if (index === -1) {
    const lowerColumnName = columnName.toLowerCase();
    index = headers.findIndex(h => h.toString().toLowerCase() === lowerColumnName);
  }
  
  // If still not found, try partial match
  if (index === -1) {
    const lowerColumnName = columnName.toLowerCase();
    index = headers.findIndex(h => h.toString().toLowerCase().includes(lowerColumnName));
  }
  
  if (index === -1) {
    throw new Error(`Column "${columnName}" not found in headers. Available headers: ${headers.join(', ')}`);
  }
  return index;
}

/**
 * Get metadata using column headers
 */
function getMetadata(sheet) {
  if (!sheet) {
    throw new Error('Metadata sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const metadata = {};
  
  // Find column indices
  let fieldCol, valueCol;
  try {
    fieldCol = getColumnIndex(headers, 'Field');
    valueCol = getColumnIndex(headers, 'Value');
  } catch (e) {
    // If headers not found, assume first two columns
    fieldCol = 0;
    valueCol = 1;
  }
  
  for (let i = 1; i < data.length; i++) {
    const field = data[i][fieldCol];
    const value = data[i][valueCol];
    if (field && value) {
      metadata[field] = value;
    }
  }
  
  // Ensure we have the updated lastUpdated value
  if (metadata.lastUpdated === undefined) {
    metadata.lastUpdated = new Date().toISOString();
  }
  
  return metadata;
}

/**
 * Get resources using column headers (case-insensitive and flexible order)
 */
function getResources(sheet) {
  if (!sheet) {
    throw new Error('Resources sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return [];
  }
  
  const headers = data[0];
  const resources = [];
  
  try {
    // Find column indices - case insensitive
    let titleCol = -1;
    let urlCol = -1;
    let descriptionCol = -1;
    
    // Search for columns by various possible names
    headers.forEach((header, index) => {
      const h = header.toString().toLowerCase().trim();
      if (h === 'title' || h === 'name' || h === 'resource') {
        titleCol = index;
      } else if (h === 'url' || h === 'link' || h === 'address') {
        urlCol = index;
      } else if (h === 'description' || h === 'desc' || h === 'details') {
        descriptionCol = index;
      }
    });
    
    // Verify we found all required columns
    if (titleCol === -1) {
      throw new Error('Could not find Title column');
    }
    if (urlCol === -1) {
      throw new Error('Could not find URL column');
    }
    if (descriptionCol === -1) {
      throw new Error('Could not find Description column');
    }
    
    // Process data rows
    for (let i = 1; i < data.length; i++) {
      const title = data[i][titleCol];
      const url = data[i][urlCol];
      const description = data[i][descriptionCol];
      
      if (title) {
        resources.push({
          title: String(title),
          url: String(url || '#'),
          description: String(description || '')
        });
      }
    }
  } catch (e) {
    // If headers don't match, show what's available
    throw new Error(`Resources sheet error: ${e.message}\nExpected headers: Title, URL, Description (any order, any case)\nFound headers: ${headers.join(', ')}`);
  }
  
  return resources;
}

/**
 * Get phases using column headers
 */
function getPhases(sheet) {
  if (!sheet) {
    throw new Error('Checklist sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const phases = [];
  const phaseMap = {};
  
  // Find column indices by header name
  const colIndex = {};
  const requiredColumns = [
    'phase_id', 'phase_title', 'section_title', 'applicability', 
    'item_id', 'item_text', 'tooltip', 'required', 'link_text', 'link_url'
  ];
  
  // Optional columns
  const optionalColumns = [
    'responsible',
    'link_text_2', 'link_url_2',
    'link_text_3', 'link_url_3', 
    'link_text_4', 'link_url_4'
  ];
  
  // Map all headers to their indices
  headers.forEach((header, index) => {
    colIndex[header] = index;
  });
  
  // Verify required columns exist
  const missingColumns = [];
  for (const col of requiredColumns) {
    if (colIndex[col] === undefined) {
      missingColumns.push(col);
    }
  }
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  // Process data rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Read values using column headers
    const phaseId = String(row[colIndex.phase_id] || '');
    const phaseTitle = String(row[colIndex.phase_title] || '');
    const sectionTitle = String(row[colIndex.section_title] || '');
    const applicability = String(row[colIndex.applicability] || '');
    const itemId = String(row[colIndex.item_id] || '');
    const itemText = String(row[colIndex.item_text] || '');
    const tooltip = String(row[colIndex.tooltip] || '');
    const required = row[colIndex.required];
    const responsible = colIndex.responsible !== undefined ? String(row[colIndex.responsible] || '') : '';
    
    // Skip rows without phase_id or item_id
    if (!phaseId || !itemId) continue;
    
    // Clean up the itemId if it looks like a date/timestamp
    let cleanItemId = itemId;
    if (itemId.includes('T') && itemId.includes('Z')) {
      // This looks like a timestamp, generate a clean ID
      if (!phaseMap[phaseId]) {
        phaseMap[phaseId] = { itemCount: 0 };
      }
      phaseMap[phaseId].itemCount++;
      cleanItemId = `${phaseId.replace('phase-', '')}-${phaseMap[phaseId].itemCount}`;
    }
    
    // Create phase if it doesn't exist
    if (!phaseMap[phaseId]) {
      phaseMap[phaseId] = {
        id: phaseId,
        title: phaseTitle,
        sections: {},
        itemCount: 0
      };
      phases.push(phaseMap[phaseId]);
    }
    
    // Create section if it doesn't exist
    const sectionKey = `${phaseId}-${sectionTitle}`;
    if (!phaseMap[phaseId].sections[sectionKey]) {
      phaseMap[phaseId].sections[sectionKey] = {
        title: sectionTitle,
        applicability: applicability ? applicability.split(',').map(s => s.trim()) : ['map', 'map-lite'],
        items: []
      };
    }
    
    // Create item
    const item = {
      id: cleanItemId,
      text: itemText,
      tooltip: tooltip,
      links: []
    };
    
    // Add responsible if provided
    if (responsible) {
      item.responsible = responsible;
    }
    
    // Add required flag if true
    if (required === true || required === 'TRUE' || required === 'Yes' || required === 'YES' || required === 'yes') {
      item.required = true;
    }
    
    // Add primary link if provided
    const linkText = String(row[colIndex.link_text] || '');
    const linkUrl = String(row[colIndex.link_url] || '');
    if (linkText && linkUrl) {
      item.links.push({
        text: linkText,
        url: linkUrl
      });
    }
    
    // Add additional links (2-4)
    for (let linkNum = 2; linkNum <= 4; linkNum++) {
      const textCol = `link_text_${linkNum}`;
      const urlCol = `link_url_${linkNum}`;
      
      // Check if these columns exist
      if (colIndex[textCol] !== undefined && colIndex[urlCol] !== undefined) {
        const additionalLinkText = String(row[colIndex[textCol]] || '');
        const additionalLinkUrl = String(row[colIndex[urlCol]] || '');
        
        if (additionalLinkText && additionalLinkUrl) {
          item.links.push({
            text: additionalLinkText,
            url: additionalLinkUrl
          });
        }
      }
    }
    
    // Add item to section
    phaseMap[phaseId].sections[sectionKey].items.push(item);
  }
  
  // Convert sections object to array and clean up
  phases.forEach(phase => {
    phase.sections = Object.values(phase.sections);
    delete phase.itemCount; // Remove temporary counter
  });
  
  return phases;
}

/**
 * Validate sheet structure
 */
function validateSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const messages = [];
  
  // Check Metadata sheet
  const metadataSheet = ss.getSheetByName('Metadata');
  if (!metadataSheet) {
    messages.push('❌ Metadata sheet not found');
  } else {
    const headers = metadataSheet.getRange(1, 1, 1, 2).getValues()[0];
    if (headers[0] !== 'Field' || headers[1] !== 'Value') {
      messages.push('⚠️ Metadata sheet headers should be: Field, Value');
    } else {
      messages.push('✅ Metadata sheet structure is correct');
    }
  }
  
  // Check Resources sheet
  const resourcesSheet = ss.getSheetByName('Resources');
  if (!resourcesSheet) {
    messages.push('❌ Resources sheet not found');
  } else {
    const headers = resourcesSheet.getRange(1, 1, 1, 3).getValues()[0];
    if (headers[0] !== 'title' || headers[1] !== 'url' || headers[2] !== 'description') {
      messages.push('⚠️ Resources sheet headers should be: title, url, description');
    } else {
      messages.push('✅ Resources sheet structure is correct');
    }
  }
  
  // Check Checklist sheet
  const checklistSheet = ss.getSheetByName('Checklist');
  if (!checklistSheet) {
    messages.push('❌ Checklist sheet not found');
  } else {
    const headers = checklistSheet.getDataRange().getValues()[0];
    const requiredHeaders = [
      'phase_id', 'phase_title', 'section_title', 'applicability',
      'item_id', 'item_text', 'tooltip', 'required', 'link_text', 'link_url'
    ];
    
    const optionalHeaders = [
      'responsible',
      'link_text_2', 'link_url_2',
      'link_text_3', 'link_url_3',
      'link_text_4', 'link_url_4'
    ];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    const presentOptionalHeaders = optionalHeaders.filter(h => headers.includes(h));
    
    if (missingHeaders.length > 0) {
      messages.push(`⚠️ Checklist sheet missing headers: ${missingHeaders.join(', ')}`);
    } else {
      messages.push('✅ Checklist sheet structure is correct');
    }
    
    if (presentOptionalHeaders.length > 0) {
      messages.push(`ℹ️ Optional columns found: ${presentOptionalHeaders.join(', ')}`);
    } else {
      messages.push('ℹ️ No optional columns found (responsible, link_text_2, link_url_2, etc.)');
    }
    
    // Check for responsible column specifically
    if (headers.includes('responsible')) {
      messages.push('✅ Responsible column found');
    } else if (headers.includes('Responsible')) {
      messages.push('⚠️ Found "Responsible" column - should be lowercase "responsible"');
    }
  }
  
  SpreadsheetApp.getUi().alert(
    'Sheet Validation Results',
    messages.join('\n'),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}