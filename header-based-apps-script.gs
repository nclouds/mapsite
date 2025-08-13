// Configuration - UPDATE THESE VALUES
const SPREADSHEET_ID = '1igp2UOuz1GEIXqmGMOhKfIYyTEPYGNGeDyaQjKx6kFM'; // Replace with your spreadsheet ID
const SHEET_NAME = 'Checklist'; // Name of the sheet containing checklist data
const METADATA_SHEET_NAME = 'Metadata'; // Name of the sheet containing metadata
const RESOURCES_SHEET_NAME = 'Resources'; // Name of the sheet containing resources
const SECURITY_TOKEN = 'nclouds-map-2024'; // Security token for API access

function debugSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  console.log('=== CHECKING SHEETS ===');
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    console.log(`Sheet name: "${sheet.getName()}"`);
  });
  
  console.log('\n=== METADATA SHEET ===');
  const metadataSheet = ss.getSheetByName(METADATA_SHEET_NAME);
  if (metadataSheet) {
    console.log('Found! Data:');
    const data = metadataSheet.getDataRange().getValues();
    data.forEach((row, i) => console.log(`Row ${i}:`, row));
  } else {
    console.log('NOT FOUND - Looking for:', METADATA_SHEET_NAME);
  }
  
  console.log('\n=== RESOURCES SHEET ===');
  const resourcesSheet = ss.getSheetByName(RESOURCES_SHEET_NAME);
  if (resourcesSheet) {
    console.log('Found! Data:');
    const data = resourcesSheet.getDataRange().getValues();
    data.forEach((row, i) => console.log(`Row ${i}:`, row));
  } else {
    console.log('NOT FOUND - Looking for:', RESOURCES_SHEET_NAME);
  }
}

function testDirectSheetRead() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Test metadata
  console.log('=== METADATA TEST ===');
  const metadataSheet = ss.getSheetByName('Metadata'); // Use exact name
  if (metadataSheet) {
    const data = metadataSheet.getDataRange().getValues();
    console.log('Raw metadata data:');
    data.forEach((row, i) => console.log(`Row ${i}:`, row));
  } else {
    console.log('No Metadata sheet found');
  }
  
  // Test resources  
  console.log('\n=== RESOURCES TEST ===');
  const resourcesSheet = ss.getSheetByName('Resources'); // Use exact name
  if (resourcesSheet) {
    const data = resourcesSheet.getDataRange().getValues();
    console.log('Raw resources data:');
    data.forEach((row, i) => console.log(`Row ${i}:`, row));
  } else {
    console.log('No Resources sheet found');
  }
}

/**
 * Debug function to test if metadata and resources sheets are being read
 * Run this in the Apps Script editor to see what's happening
 */
function debugMetadataAndResources() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // List all sheets
    console.log('Available sheets in spreadsheet:');
    const allSheets = ss.getSheets();
    allSheets.forEach(sheet => {
      console.log(`- "${sheet.getName()}"`);
    });
    
    // Test Metadata
    console.log('\n--- TESTING METADATA SHEET ---');
    const metadataSheet = ss.getSheetByName(METADATA_SHEET_NAME);
    if (metadataSheet) {
      console.log(`Found metadata sheet: "${METADATA_SHEET_NAME}"`);
      const metadataData = metadataSheet.getDataRange().getValues();
      console.log('Metadata data:');
      metadataData.forEach((row, index) => {
        console.log(`Row ${index}: [${row.join(', ')}]`);
      });
      
      const metadata = getMetadata(ss);
      console.log('Processed metadata:', JSON.stringify(metadata, null, 2));
    } else {
      console.log(`Metadata sheet "${METADATA_SHEET_NAME}" NOT FOUND`);
    }
    
    // Test Resources
    console.log('\n--- TESTING RESOURCES SHEET ---');
    const resourcesSheet = ss.getSheetByName(RESOURCES_SHEET_NAME);
    if (resourcesSheet) {
      console.log(`Found resources sheet: "${RESOURCES_SHEET_NAME}"`);
      const resourcesData = resourcesSheet.getDataRange().getValues();
      console.log('Resources data:');
      resourcesData.forEach((row, index) => {
        console.log(`Row ${index}: [${row.join(', ')}]`);
      });
      
      const resources = getResources(ss);
      console.log('Processed resources:', JSON.stringify(resources, null, 2));
    } else {
      console.log(`Resources sheet "${RESOURCES_SHEET_NAME}" NOT FOUND`);
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

/**
 * Test the complete doGet response
 */
function testCompleteResponse() {
  try {
    // Simulate the doGet request
    const e = {
      parameter: {
        token: SECURITY_TOKEN,
        callback: 'testCallback'
      }
    };
    
    const response = doGet(e);
    const content = response.getContent();
    
    // Remove the callback wrapper to see the JSON
    const jsonStart = content.indexOf('(') + 1;
    const jsonEnd = content.lastIndexOf(')');
    const jsonData = content.substring(jsonStart, jsonEnd);
    
    const data = JSON.parse(jsonData);
    
    console.log('Complete response structure:');
    console.log('- Number of phases:', data.phases ? data.phases.length : 0);
    console.log('- Metadata:', JSON.stringify(data.metadata, null, 2));
    console.log('- Resources:', JSON.stringify(data.resources, null, 2));
    
    return data;
    
  } catch (error) {
    console.error('Test complete response error:', error);
  }
}

/**
 * MAP Migration Checklist - Google Apps Script
 * Auto-calculates phase_id, phase_title, and item_id from spreadsheet data
 * Reads metadata and resources from separate sheets
 * 
 * This script serves checklist data from a Google Sheet via a web app endpoint
 * with JSONP support for cross-origin requests from Google Sites
 */



/**
 * Web app entry point - serves checklist data as JSON or JSONP
 */
function doGet(e) {
  // Version 3.1 - Force redeployment - ${new Date().toISOString()}
  // Simple test that always works
  console.log('Version 4');
  if (!e.parameter.token) {
    return ContentService
      .createTextOutput('Test response - no token needed')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Add version check for debugging - NO TOKEN REQUIRED
  if (e.parameter.version === 'check') {
    return ContentService
      .createTextOutput('Version 3.0 - Reading from Metadata and Resources sheets')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Debug endpoint - NO TOKEN REQUIRED
  if (e.parameter.debug === 'true') {
    const debugInfo = {
      scriptVersion: '3.0',
      timestamp: new Date().toISOString(),
      securityTokenConfigured: typeof SECURITY_TOKEN !== 'undefined',
      spreadsheetIdConfigured: typeof SPREADSHEET_ID !== 'undefined',
      metadataSheetName: METADATA_SHEET_NAME,
      resourcesSheetName: RESOURCES_SHEET_NAME,
      receivedParameters: Object.keys(e.parameter || {})
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(debugInfo, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    // Security check - verify token
    const token = e.parameter.token;
    if (token !== SECURITY_TOKEN) {
      const errorResponse = { 
        error: 'Unauthorized access',
        debug: {
          receivedToken: token ? 'Token provided but incorrect' : 'No token provided',
          expectedToken: 'nclouds-map-2024'
        }
      };
      return ContentService
        .createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get the main checklist sheet
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Checklist sheet not found');
    }
    
    // Get the phases using the auto-calculate function
    const phases = getPhases(sheet);
    
    // Get metadata - ADD LOGGING
    console.log('Getting metadata...');
    const metadata = getMetadata(ss);
    console.log('Metadata result:', JSON.stringify(metadata));
    
    // Get resources - ADD LOGGING
    console.log('Getting resources...');
    const resources = getResources(ss);
    console.log('Resources result:', JSON.stringify(resources));
    
    // Build response
    const response = {
      phases: phases,
      metadata: metadata,
      resources: resources,
      debug: {
        scriptVersion: '3.0',
        timestamp: new Date().toISOString(),
        metadataSheetName: METADATA_SHEET_NAME,
        resourcesSheetName: RESOURCES_SHEET_NAME
      }
    };
    
    // Check if JSONP callback is requested
    const callback = e.parameter.callback;
    
    if (callback) {
      // Return JSONP response
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Return regular JSON
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('Error in doGet:', error);
    
    const errorResponse = {
      error: error.toString(),
      message: 'Failed to load checklist data'
    };
    
    const callback = e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(errorResponse) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

/**
 * Get metadata from the Metadata sheet
 * Expected format: Two columns - Key and Value
 */
function getMetadata(spreadsheet) {
  try {
    const metadataSheet = spreadsheet.getSheetByName(METADATA_SHEET_NAME);
    if (!metadataSheet) {
      console.log('Metadata sheet not found, using defaults');
      return {
        version: '1.0',
        lastUpdated: new Date().toISOString()
      };
    }
    
    const data = metadataSheet.getDataRange().getValues();
    const metadata = {};
    
    // Skip header row, process key-value pairs
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0] || '').trim();
      const value = String(data[i][1] || '').trim();
      
      if (key) {
        // Special handling for certain keys
        if (key === 'lastUpdated' && value) {
          // Try to parse as date
          try {
            metadata[key] = new Date(value).toISOString();
          } catch (e) {
            metadata[key] = value;
          }
        } else {
          metadata[key] = value;
        }
      }
    }
    
    // Add calculated metadata
    const checklistSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (checklistSheet) {
      const phases = getPhases(checklistSheet);
      metadata.totalPhases = phases.length;
      metadata.totalItems = phases.reduce((total, phase) => 
        total + phase.sections.reduce((sectionTotal, section) => 
          sectionTotal + section.items.length, 0), 0);
    }
    
    // Ensure we have at least version and lastUpdated
    if (!metadata.version) metadata.version = '1.0';
    if (!metadata.lastUpdated) metadata.lastUpdated = new Date().toISOString();
    
    return metadata;
    
  } catch (error) {
    console.error('Error reading metadata:', error);
    return {
      version: '1.0',
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get resources from the Resources sheet
 * Expected format: Two columns - Title and URL
 */
function getResources(spreadsheet) {
  try {
    const resourcesSheet = spreadsheet.getSheetByName(RESOURCES_SHEET_NAME);
    if (!resourcesSheet) {
      console.log('Resources sheet not found, using defaults');
      return [
        {
          title: 'AWS Migration Best Practices',
          url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-guide/welcome.html'
        },
        {
          title: 'MAP Program Overview',
          url: 'https://aws.amazon.com/migration-acceleration-program/'
        },
        {
          title: 'nClouds MAP Resources',
          url: 'https://www.nclouds.com/aws-map/'
        }
      ];
    }
    
    const data = resourcesSheet.getDataRange().getValues();
    const resources = [];
    
    // Skip header row, process resources
    for (let i = 1; i < data.length; i++) {
      const title = String(data[i][0] || '').trim();
      const url = String(data[i][1] || '').trim();
      
      if (title && url) {
        resources.push({
          title: title,
          url: url
        });
      }
    }
    
    return resources.length > 0 ? resources : [
      {
        title: 'AWS Migration Best Practices',
        url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-guide/welcome.html'
      }
    ];
    
  } catch (error) {
    console.error('Error reading resources:', error);
    return [];
  }
}

/**
 * Get phases using column headers with AUTO-CALCULATED values
 * Updated to read Phase column if it exists
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
  
  // Required columns
  const requiredColumns = [
    'ID', 'section_title', 'applicability', 
    'item_text', 'tooltip', 'required', 'link_text', 'link_url'
  ];
  
  // Optional columns (added 'Phase')
  const optionalColumns = [
    'Phase',  // NEW: Optional Phase column
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
  
  // Track current ID and item counter
  let currentID = '';
  let itemCounter = 0;
  let currentPhaseTitle = ''; // Track the phase title for each ID
  
  // Process data rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Read values using column headers
    const id = String(row[colIndex.ID] || '');
    const sectionTitle = String(row[colIndex.section_title] || '');
    const applicability = String(row[colIndex.applicability] || '');
    const itemText = String(row[colIndex.item_text] || '');
    const tooltip = String(row[colIndex.tooltip] || '');
    const required = row[colIndex.required];
    const responsible = colIndex.responsible !== undefined ? String(row[colIndex.responsible] || '') : '';
    
    // NEW: Read Phase column if it exists
    const phaseColumn = colIndex.Phase !== undefined ? String(row[colIndex.Phase] || '') : '';
    
    // Skip empty rows
    if (!id || !sectionTitle || !itemText) continue;
    
    // Check if this is a new ID (new phase)
    if (id !== currentID) {
      currentID = id;
      itemCounter = 0; // Reset item counter for new phase
      
      // Set the phase title for this ID
      if (phaseColumn) {
        // If Phase column exists and has a value, use it
        currentPhaseTitle = phaseColumn;
      } else {
        // Otherwise, derive from section title
        currentPhaseTitle = getPhaseNameFromSection(sectionTitle);
      }
    }
    
    // AUTO-CALCULATE: Increment item counter
    itemCounter++;
    
    // AUTO-CALCULATE: Generate IDs based on ID field
    const phaseId = `Phase-${id}`;
    const itemId = `${id}-${itemCounter}`;
    const phaseTitle = `Phase ${id}: ${currentPhaseTitle}`;
    
    // Create phase if it doesn't exist
    if (!phaseMap[phaseId]) {
      phaseMap[phaseId] = {
        id: phaseId,
        title: phaseTitle,
        sections: {}
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
    
    // Create item object
    const itemData = {
      id: itemId,
      text: itemText,
      tooltip: tooltip,
      links: []
    };
    
    // Add responsible if provided
    if (responsible) {
      itemData.responsible = responsible;
    }
    
    // Add required flag if true
    if (required === true || required === 'TRUE' || required === 'Yes' || required === 'YES' || required === 'yes') {
      itemData.required = true;
    }
    
    // Add primary link if provided
    const linkText = String(row[colIndex.link_text] || '');
    const linkUrl = String(row[colIndex.link_url] || '');
    if (linkText && linkUrl) {
      itemData.links.push({
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
          itemData.links.push({
            text: additionalLinkText,
            url: additionalLinkUrl
          });
        }
      }
    }
    
    // Add item to section
    phaseMap[phaseId].sections[sectionKey].items.push(itemData);
  }
  
  // Convert sections object to array
  phases.forEach(phase => {
    phase.sections = Object.values(phase.sections);
  });
  
  return phases;
}

/**
 * Helper function to derive phase name from section title or ID
 * For the first section of each phase
 */
function getPhaseNameFromSection(sectionTitle) {
  // Define mappings based on common patterns in your data
  const mappings = {
    // Project phases
    'Project Initiation': 'Project Initiation',
    'Both MAP & MAP Lite': 'Project Initiation',
    'MAP Only': 'MAP Specific Requirements',
    'MAP Lite Specific': 'MAP Lite Requirements',
    
    // Main phases
    'Assess': 'Assessment',
    'Mobilize': 'Mobilization',
    'Migrate': 'Migration',
    'Modernize': 'Modernization',
    
    // OLA/Blueprint phases
    'Blueprint': 'Blueprint Optimization (OLA)',
    'OLA': 'Blueprint Optimization (OLA)',
    'Optimization': 'Blueprint Optimization (OLA)',
    
    // Financial phases
    'Fund Request': 'Fund Request',
    'Fund Claim': 'Fund Claim',
    
    // Closeout
    'Closeout': 'Project Closeout',
    'Project Closeout': 'Project Closeout',
    
    // Add more mappings as needed based on your data
  };
  
  // Check for exact matches first
  if (mappings[sectionTitle]) {
    return mappings[sectionTitle];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(mappings)) {
    if (sectionTitle.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Default: use the section title as is
  return sectionTitle;
}

/**
 * Test function to verify the script is working
 * Run this in the Apps Script editor to test
 */
function testGetPhases() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const phases = getPhases(sheet);
    
    console.log('Total phases:', phases.length);
    
    phases.forEach(phase => {
      console.log(`\nPhase: ${phase.title} (${phase.id})`);
      phase.sections.forEach(section => {
        console.log(`  Section: ${section.title}`);
        console.log(`  Items: ${section.items.length}`);
      });
    });
    
    // Test metadata
    const metadata = getMetadata(ss);
    console.log('\nMetadata:', metadata);
    
    // Test resources
    const resources = getResources(ss);
    console.log('\nResources:', resources);
    
    return { phases, metadata, resources };
  } catch (error) {
    console.error('Test error:', error);
    throw error;
  }
}

/**
 * Helper function to get current deployment URL
 * Run this after deploying to get the URL for your HTML
 */
function getDeploymentUrl() {
  const url = ScriptApp.getService().getUrl();
  console.log('Deployment URL:', url);
  return url;
}