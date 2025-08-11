<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAP Migration Project Checklist</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #232f3e;
            border-bottom: 3px solid #ff9900;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        /* Security Status Banner */
        .security-status {
            padding: 12px 20px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        }
        
        .security-status.secure {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .security-status.fallback {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
        }
        
        .security-status.error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .security-icon {
            font-size: 18px;
        }
        
        /* Loading and Error States */
        .loading, .error {
            text-align: center;
            padding: 60px 20px;
        }
        
        .loading h2, .error h2 {
            color: #232f3e;
            margin-bottom: 20px;
        }
        
        .loading p, .error p {
            color: #666;
            margin: 10px 0;
        }
        
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff9900;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Controls */
        .controls {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .control-group label {
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }
        
        select, input[type="text"] {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background: white;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }
        
        button, .button {
            background: #232f3e;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.2s;
        }
        
        button:hover, .button:hover {
            background: #131a22;
        }
        
        .button-small {
            padding: 6px 12px;
            font-size: 13px;
        }
        
        /* Resources */
        .resources {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
        }
        
        .resources h2 {
            color: #232f3e;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 20px;
        }
        
        .resource-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
        }
        
        .resource-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #0073bb;
            text-decoration: none;
            padding: 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .resource-link:hover {
            background: rgba(0, 115, 187, 0.1);
        }
        
        /* Phases */
        .phase {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .phase-header {
            background: #232f3e;
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s;
        }
        
        .phase-header:hover {
            background: #131a22;
        }
        
        .phase-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        
        .chevron {
            transition: transform 0.3s;
            font-size: 14px;
        }
        
        .chevron.rotated {
            transform: rotate(90deg);
        }
        
        .phase-content {
            padding: 20px;
            background: #fafafa;
            display: none;
        }
        
        .phase-content.expanded {
            display: block;
        }
        
        /* Sections */
        .section {
            background: white;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        
        .section-title {
            font-weight: 600;
            margin-bottom: 15px;
            color: #232f3e;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .applicability-badge {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: normal;
        }
        
        .applicability-badge.map-only {
            background: #e8e0ff;
            color: #6633cc;
        }
        
        .applicability-badge.map-lite-only {
            background: #d4f4dd;
            color: #00875a;
        }
        
        /* Items */
        .item {
            display: flex;
            align-items: start;
            gap: 12px;
            padding: 10px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .item:hover {
            background: #f5f5f5;
        }
        
        .item input[type="checkbox"] {
            margin-top: 2px;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        
        .item-content {
            flex: 1;
        }
        
        .item-text {
            display: inline;
        }
        
        .item-text.completed {
            text-decoration: line-through;
            color: #666;
        }
        
        .tooltip {
            display: inline-block;
            margin-left: 5px;
            color: #666;
            cursor: help;
            font-size: 14px;
            position: relative;
        }
        
        .tooltip:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 20px;
            top: -5px;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            white-space: normal;
            width: 250px;
            z-index: 10;
            font-size: 13px;
            line-height: 1.4;
        }
        
        .required-badge {
            display: inline-block;
            background: #fee;
            color: #c00;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 5px;
        }
        
        .responsible-badge {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 5px;
        }
        
        .item-links {
            margin-top: 5px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .item-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #0073bb;
            text-decoration: none;
            font-size: 13px;
        }
        
        .item-link:hover {
            text-decoration: underline;
        }
        
        /* Progress */
        .progress-info {
            text-align: right;
            color: #666;
            font-size: 14px;
        }
        
        /* No results */
        .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        /* Fallback mode notice */
        .fallback-notice {
            margin-top: 10px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 13px;
            color: #666;
        }
        
        .fallback-notice a {
            color: #0073bb;
            text-decoration: none;
        }
        
        .fallback-notice a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MAP Migration Project Checklist</h1>
        <div id="security-status"></div>
        <div id="app">
            <div class="loading">
                <h2>Loading MAP Checklist...</h2>
                <div class="spinner"></div>
                <p>Authenticating with nclouds.com...</p>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        let guideData = null;
        let expandedPhases = {};
        let projectType = 'both';
        let searchTerm = '';
        let responsibleFilter = '';
        let allResponsibleParties = [];
        let dataSource = 'none'; // 'api', 'local', or 'none'

        // Apps Script Web App URL
        const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/nclouds.com/s/AKfycbxNoeVM3t0WNZmp1KKJQxpeem7J3q_ATpvrozVicxnlIZ5pZvMaemc6bG_nFzlNHdaTFQ/exec';
        
        // Define all handler functions in global scope
        window.togglePhase = function(phaseId) {
            expandedPhases[phaseId] = !expandedPhases[phaseId];
            renderPhases();
        }

        window.handleProjectTypeChange = function(e) {
            projectType = e.target.value;
            renderPhases();
        }

        window.handleSearchInput = function(e) {
            searchTerm = e.target.value;
            renderPhases();
        }

        window.handleResponsibleChange = function(e) {
            responsibleFilter = e.target.value;
            renderPhases();
        }

        window.expandAll = function() {
            guideData.phases.forEach(phase => {
                expandedPhases[phase.id] = true;
            });
            renderPhases();
        }

        window.collapseAll = function() {
            guideData.phases.forEach(phase => {
                expandedPhases[phase.id] = false;
            });
            renderPhases();
        }

        // Load guide data with fallback
        async function loadGuideData() {
            // Update loading message
            document.querySelector('.loading p').textContent = 'Connecting to secure API...';
            
            try {
                // First try the secure API
                console.log('Attempting to load from secure API...');
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'GET',
                    credentials: 'include', // Important for authentication
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                const responseText = await response.text();
                console.log('API Response status:', response.status);
                
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Failed to parse API response:', responseText);
                    throw new Error('Invalid response from API');
                }
                
                if (!response.ok || !result.success) {
                    throw new Error(result.error || `API error: ${response.status}`);
                }
                
                // Success! Use the API data
                guideData = result.data;
                dataSource = 'api';
                
                // Show secure status
                showSecurityStatus('secure', `Connected securely as ${result.user}`);
                
            } catch (apiError) {
                console.error('API Error:', apiError);
                
                // Check if it's an authentication error
                if (apiError.message.includes('Access denied') || apiError.message.includes('Authentication required')) {
                    // Show authentication error
                    showAuthenticationError(apiError.message);
                    return;
                }
                
                // For other errors, try fallback to local JSON
                console.log('Falling back to local JSON file...');
                document.querySelector('.loading p').textContent = 'Loading from local file...';
                
                try {
                    const localResponse = await fetch('checklist-data.json');
                    if (!localResponse.ok) {
                        throw new Error(`Failed to load local file: ${localResponse.status}`);
                    }
                    
                    guideData = await localResponse.json();
                    dataSource = 'local';
                    
                    // Show fallback status
                    showSecurityStatus('fallback', 'Using local data file (not authenticated)');
                    
                } catch (localError) {
                    console.error('Local file error:', localError);
                    showLoadingError(apiError, localError);
                    return;
                }
            }
            
            // Initialize the app with the loaded data
            if (guideData) {
                // Initialize all phases as collapsed
                guideData.phases.forEach(phase => {
                    expandedPhases[phase.id] = false;
                });
                
                initializeApp();
            }
        }

        // Show security status banner
        function showSecurityStatus(type, message) {
            const statusDiv = document.getElementById('security-status');
            statusDiv.className = `security-status ${type}`;
            
            const icons = {
                secure: '🔒',
                fallback: '⚠️',
                error: '❌'
            };
            
            statusDiv.innerHTML = `
                <span class="security-icon">${icons[type]}</span>
                <span>${message}</span>
            `;
            
            if (type === 'fallback') {
                statusDiv.innerHTML += `
                    <div class="fallback-notice">
                        To enable secure access with authentication, please ensure:
                        <ol style="margin: 5px 0 0 20px; padding: 0;">
                            <li>You're logged in with your nclouds.com Google account</li>
                            <li>The Apps Script is properly deployed with "Anyone within nclouds.com" access</li>
                            <li>You're accessing this page from a secure context</li>
                        </ol>
                        <a href="${APPS_SCRIPT_URL}" target="_blank">Test API access directly</a>
                    </div>
                `;
            }
        }

        // Show authentication error
        function showAuthenticationError(errorMessage) {
            document.getElementById('app').innerHTML = `
                <div class="error">
                    <h2>🔒 Authentication Required</h2>
                    <p>${errorMessage}</p>
                    <p>This checklist is restricted to nclouds.com employees only.</p>
                    <p>Please ensure you are:</p>
                    <ul style="text-align: left; max-width: 400px; margin: 20px auto;">
                        <li>Logged in with your @nclouds.com Google account</li>
                        <li>Accessing from an authorized network</li>
                        <li>Using a supported browser</li>
                    </ul>
                    <p style="margin-top: 30px;">
                        <a href="https://accounts.google.com/signin" target="_blank" class="button">Sign in to Google</a>
                    </p>
                    <p style="margin-top: 20px; font-size: 14px; color: #666;">
                        If you continue to have issues, please contact IT support.
                    </p>
                </div>
            `;
            showSecurityStatus('error', 'Access denied - Authentication required');
        }

        // Show loading error
        function showLoadingError(apiError, localError) {
            document.getElementById('app').innerHTML = `
                <div class="error">
                    <h2>❌ Unable to Load Checklist</h2>
                    <p>Failed to load checklist data from both secure API and local file.</p>
                    <div style="text-align: left; max-width: 600px; margin: 20px auto;">
                        <h3>API Error:</h3>
                        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${apiError.message}</pre>
                        <h3>Local File Error:</h3>
                        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${localError.message}</pre>
                    </div>
                    <p>Please contact support for assistance.</p>
                </div>
            `;
            showSecurityStatus('error', 'Failed to load checklist data');
        }

        // Initialize the application
        function initializeApp() {
            // Extract all unique responsible parties
            extractResponsibleParties();
            renderApp();
        }
        
        // Extract unique responsible parties from the data
        function extractResponsibleParties() {
            const parties = new Set();
            
            guideData.phases.forEach(phase => {
                phase.sections.forEach(section => {
                    section.items.forEach(item => {
                        if (item.responsible) {
                            // Split by comma and trim
                            const responsibleList = item.responsible.split(',').map(r => r.trim());
                            responsibleList.forEach(r => {
                                if (r) parties.add(r);
                            });
                        }
                    });
                });
            });
            
            allResponsibleParties = Array.from(parties).sort();
        }
        
        // Check if section should be shown based on project type
        function shouldShowSection(section) {
            if (projectType === 'both') return true;
            return section.applicability.includes(projectType);
        }
        
        // Check if item should be shown based on filters
        function shouldShowItem(item) {
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const textMatch = item.text.toLowerCase().includes(searchLower);
                const tooltipMatch = item.tooltip && item.tooltip.toLowerCase().includes(searchLower);
                const linkMatch = item.links && item.links.some(link => 
                    link.text.toLowerCase().includes(searchLower)
                );
                
                if (!textMatch && !tooltipMatch && !linkMatch) {
                    return false;
                }
            }
            
            // Responsible party filter
            if (responsibleFilter && item.responsible) {
                const responsibleList = item.responsible.split(',').map(r => r.trim());
                if (!responsibleList.includes(responsibleFilter)) {
                    return false;
                }
            } else if (responsibleFilter && !item.responsible) {
                return false;
            }
            
            return true;
        }
        
        // Render the entire app
        function renderApp() {
            const metadata = guideData.metadata || {};
            const html = `
                <div class="header">
                    <div class="metadata">
                        ${metadata.version ? `<div>Version: ${metadata.version}</div>` : ''}
                        ${metadata.lastUpdated ? `<div>Last Updated: ${new Date(metadata.lastUpdated).toLocaleDateString()}</div>` : ''}
                    </div>
                </div>
                
                <div class="controls">
                    <div class="control-group">
                        <label for="project-type">Project Type:</label>
                        <select id="project-type" onchange="handleProjectTypeChange(event)">
                            <option value="both">All Projects</option>
                            <option value="map">MAP Only</option>
                            <option value="map-lite">MAP Lite Only</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label for="search">Search:</label>
                        <input type="text" id="search" placeholder="Search items..." oninput="handleSearchInput(event)">
                    </div>
                    
                    ${allResponsibleParties.length > 0 ? `
                        <div class="control-group">
                            <label for="responsible">Filter by Responsible:</label>
                            <select id="responsible" onchange="handleResponsibleChange(event)">
                                <option value="">All</option>
                                ${allResponsibleParties.map(party => 
                                    `<option value="${party}">${party}</option>`
                                ).join('')}
                            </select>
                        </div>
                    ` : ''}
                    
                    <div class="button-group">
                        <button class="button-small" onclick="expandAll()">Expand All</button>
                        <button class="button-small" onclick="collapseAll()">Collapse All</button>
                    </div>
                </div>

                <!-- Resources -->
                ${guideData.resources && guideData.resources.length > 0 ? `
                    <div class="resources">
                        <h2>📚 Important Resources</h2>
                        <div class="resource-links">
                            ${guideData.resources.map(resource => `
                                <a href="${resource.url}" target="_blank" class="resource-link">
                                    <span>🔗</span>
                                    <span>${resource.title}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Phases -->
                <div id="phases-container"></div>
            `;
            
            document.getElementById('app').innerHTML = html;
            
            // Restore control values
            document.getElementById('project-type').value = projectType;
            document.getElementById('search').value = searchTerm;
            const responsibleSelect = document.getElementById('responsible');
            if (responsibleSelect) {
                responsibleSelect.value = responsibleFilter;
            }
            
            // Render phases
            renderPhases();
        }

        // Render phases
        function renderPhases() {
            const container = document.getElementById('phases-container');
            if (!container) return;
            
            let hasResults = false;
            
            const phasesHtml = guideData.phases.map(phase => {
                const isExpanded = expandedPhases[phase.id];
                const hasVisibleSections = phase.sections.some(section => {
                    if (!shouldShowSection(section)) return false;
                    return section.items.some(item => shouldShowItem(item));
                });
                
                if (!hasVisibleSections) return '';
                hasResults = true;
                
                return `
                    <div class="phase">
                        <div class="phase-header" onclick="togglePhase('${phase.id}')">
                            <h2 class="phase-title">${phase.title}</h2>
                            <span class="chevron ${isExpanded ? 'rotated' : ''}">▶</span>
                        </div>
                        <div class="phase-content ${isExpanded ? 'expanded' : ''}">
                            ${phase.sections.map(section => {
                                if (!shouldShowSection(section)) return '';
                                
                                const visibleItems = section.items.filter(item => shouldShowItem(item));
                                if (visibleItems.length === 0) return '';
                                
                                const applicabilityBadge = getApplicabilityBadge(section.applicability);
                                
                                return `
                                    <div class="section">
                                        <h3 class="section-title">
                                            ${section.title}
                                            ${applicabilityBadge}
                                        </h3>
                                        <div class="items">
                                            ${visibleItems.map(item => renderItem(item)).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');
            
            if (!hasResults) {
                container.innerHTML = '<div class="no-results">No items match your current filters.</div>';
            } else {
                container.innerHTML = phasesHtml;
            }
        }
        
        // Get applicability badge HTML
        function getApplicabilityBadge(applicability) {
            if (applicability.includes('map') && !applicability.includes('map-lite')) {
                return '<span class="applicability-badge map-only">MAP Only</span>';
            } else if (!applicability.includes('map') && applicability.includes('map-lite')) {
                return '<span class="applicability-badge map-lite-only">MAP Lite Only</span>';
            }
            return '';
        }
        
        // Render individual item
        function renderItem(item) {
            const itemId = `item-${item.id}`;
            const isChecked = localStorage.getItem(itemId) === 'true';
            
            return `
                <div class="item">
                    <input type="checkbox" 
                           id="${itemId}" 
                           ${isChecked ? 'checked' : ''} 
                           onchange="toggleItem('${itemId}')">
                    <div class="item-content">
                        <label for="${itemId}" class="item-text ${isChecked ? 'completed' : ''}">
                            ${item.text}
                        </label>
                        ${item.tooltip ? `<span class="tooltip" data-tooltip="${item.tooltip}">ℹ️</span>` : ''}
                        ${item.required ? '<span class="required-badge">Required</span>' : ''}
                        ${item.responsible ? `<span class="responsible-badge">${item.responsible}</span>` : ''}
                        ${item.links && item.links.length > 0 ? `
                            <div class="item-links">
                                ${item.links.map(link => `
                                    <a href="${link.url}" target="_blank" class="item-link">
                                        <span>🔗</span>
                                        <span>${link.text}</span>
                                    </a>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // Toggle item completion
        window.toggleItem = function(itemId) {
            const checkbox = document.getElementById(itemId);
            const label = checkbox.nextElementSibling.querySelector('.item-text');
            
            if (checkbox.checked) {
                localStorage.setItem(itemId, 'true');
                label.classList.add('completed');
            } else {
                localStorage.removeItem(itemId);
                label.classList.remove('completed');
            }
        }
        
        // Start loading when page loads
        window.addEventListener('DOMContentLoaded', loadGuideData);
    </script>
</body>
</html>