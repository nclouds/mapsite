/**
 * Google Apps Script to export MAP Checklist from Sheets to JSON
 * This version reads columns by header name, not position
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this script
 * 4. Save the project
 * 5. Run > exportToJSON
 * 6. The JSON will be saved to your Google Drive
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('MAP Checklist')
    .addItem('Export to JSON', 'exportToJSON')
    .addItem('Download JSON', 'downloadJSON')
    .addItem('Validate Sheet Structure', 'validateSheets')
    .addToUi();
}

function exportToJSON() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
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
    .setWidth(500)
    .setHeight(400);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Download JSON');
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

function generateJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get metadata
  const metadataSheet = ss.getSheetByName('Metadata');
  const metadata = getMetadata(metadataSheet);
  
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
      messages.push(`ℹ️ Optional link columns found: ${presentOptionalHeaders.join(', ')}`);
    } else {
      messages.push('ℹ️ No additional link columns found (link_text_2, link_url_2, etc.)');
    }
  }
  
  SpreadsheetApp.getUi().alert(
    'Sheet Validation Results',
    messages.join('\n'),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Create sample data for testing
 */
function createSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create Metadata sheet
  let metadataSheet = ss.getSheetByName('Metadata');
  if (!metadataSheet) {
    metadataSheet = ss.insertSheet('Metadata');
    metadataSheet.getRange(1, 1, 4, 2).setValues([
      ['Field', 'Value'],
      ['title', 'MAP Migration Project Checklist'],
      ['version', '1.0'],
      ['lastUpdated', '2024-01-15']
    ]);
    metadataSheet.getRange(1, 1, 1, 2).setBackground('#4285f4').setFontColor('#ffffff').setFontWeight('bold');
  }
  
  // Create Resources sheet
  let resourcesSheet = ss.getSheetByName('Resources');
  if (!resourcesSheet) {
    resourcesSheet = ss.insertSheet('Resources');
    resourcesSheet.getRange(1, 1, 4, 3).setValues([
      ['title', 'url', 'description'],
      ['AWS Partner Funding Portal (APFP)', 'https://partnercentral.awspartner.com/', 'Primary portal for fund requests and claims'],
      ['MAP Terms & Conditions', 'https://aws.amazon.com/migration-acceleration-program/terms', 'Official program terms'],
      ['Migration Readiness Assessment Guide', 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-readiness/welcome.html', 'Complete MRA documentation']
    ]);
    resourcesSheet.getRange(1, 1, 1, 3).setBackground('#4285f4').setFontColor('#ffffff').setFontWeight('bold');
  }
  
  // Create Checklist sheet
  let checklistSheet = ss.getSheetByName('Checklist');
  if (!checklistSheet) {
    checklistSheet = ss.insertSheet('Checklist');
    checklistSheet.getRange(1, 1, 5, 10).setValues([
      ['phase_id', 'phase_title', 'section_title', 'applicability', 'item_id', 'item_text', 'tooltip', 'required', 'link_text', 'link_url'],
      ['phase-1', 'Phase 1: Project Initiation', 'Both MAP & MAP Lite', 'map,map-lite', '1-1', 'Determine migration eligibility for MAP funding', 'Verify that your migration project meets AWS MAP requirements', 'TRUE', '', ''],
      ['phase-1', 'Phase 1: Project Initiation', 'Both MAP & MAP Lite', 'map,map-lite', '1-2', 'Confirm partner eligibility requirements are met', 'Must have AWS Migration Competency', 'TRUE', 'Partner Eligibility', 'https://aws.amazon.com/partners/'],
      ['phase-1', 'Phase 1: Project Initiation', 'MAP Only', 'map', '1-3', 'Complete Migration Readiness Assessment (MRA)', 'The MRA evaluates readiness across multiple dimensions', 'TRUE', 'MRA Guide', 'https://docs.aws.amazon.com/'],
      ['phase-2', 'Phase 2: Fund Request', 'All Projects', 'map,map-lite', '2-1', 'Submit fund request in APFP', 'Create and submit fund request', 'TRUE', '', '']
    ]);
    checklistSheet.getRange(1, 1, 1, 10).setBackground('#4285f4').setFontColor('#ffffff').setFontWeight('bold');
    
    // Auto-resize columns
    for (let i = 1; i <= 10; i++) {
      checklistSheet.autoResizeColumn(i);
    }
  }
  
  SpreadsheetApp.getUi().alert('Sample data created! You can now edit the sheets and export to JSON.');
}