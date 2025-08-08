import React, { useState, useEffect } from 'react';
import { Info, ExternalLink, ChevronDown, ChevronRight, Search, Download, Upload, Check } from 'lucide-react';

// Complete checklist data structure
const checklistData = {
  metadata: {
    title: "MAP Migration Project Checklist",
    version: "1.0",
    lastUpdated: "2024-01-15"
  },
  resources: [
    {
      title: "AWS Partner Funding Portal (APFP)",
      url: "#",
      description: "Primary portal for fund requests and claims"
    },
    {
      title: "MAP Terms & Conditions",
      url: "https://aws.amazon.com/migration-acceleration-program/terms",
      description: "Official program terms"
    },
    {
      title: "Migration Readiness Assessment Guide",
      url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-readiness/welcome.html",
      description: "Complete MRA documentation"
    }
  ],
  phases: [
    {
      id: "phase-1",
      title: "Phase 1: Project Initiation",
      sections: [
        {
          title: "Both MAP & MAP Lite",
          applicability: ["map", "map-lite"],
          items: [
            {
              id: "1-1",
              text: "Determine migration eligibility for MAP funding",
              tooltip: "Verify that your migration project meets AWS MAP requirements including minimum ARR thresholds and partner eligibility criteria",
              links: []
            },
            {
              id: "1-2",
              text: "Confirm partner eligibility requirements are met",
              tooltip: "Must have AWS Migration Competency or qualifying AWS Competencies/Service Delivery designations",
              links: [
                {
                  text: "Partner Eligibility",
                  url: "#"
                }
              ]
            },
            {
              id: "1-3",
              text: "Identify customer's anticipated post-migration Annual Run Rate (ARR)",
              tooltip: "Calculate expected AWS spend after migration completion. This determines MAP vs MAP Lite eligibility",
              links: []
            }
          ]
        },
        {
          title: "MAP Only ($500K-$10M ARR)",
          applicability: ["map"],
          items: [
            {
              id: "1-4",
              text: "Complete Migration Readiness Assessment (MRA) [REQUIRED]",
              tooltip: "The MRA evaluates your organization's readiness across people, process, and technology. Must be completed before receiving any MAP Credits",
              required: true,
              links: [
                {
                  text: "MRA Guide",
                  url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-readiness/welcome.html"
                }
              ]
            },
            {
              id: "1-5",
              text: "Obtain customer consent for MAP migration tagging",
              tooltip: "Customer must agree to implement MAP tags on migrated workloads for tracking and payment processing",
              links: []
            }
          ]
        }
      ]
    },
    {
      id: "phase-2",
      title: "Phase 2: Fund Request Preparation",
      sections: [
        {
          title: "Both MAP & MAP Lite",
          applicability: ["map", "map-lite"],
          items: [
            {
              id: "2-1",
              text: "Access AWS Partner Funding Portal (APFP)",
              tooltip: "Log into APFP with your partner credentials to begin fund request process",
              links: []
            },
            {
              id: "2-2",
              text: "Create AWS Pricing Calculator link",
              tooltip: "Include all AWS services that will be used in the migration. ARR must match this calculation",
              links: [
                {
                  text: "AWS Calculator",
                  url: "https://calculator.aws/"
                }
              ]
            },
            {
              id: "2-3",
              text: "Complete MAP Partner Scope Checklist",
              tooltip: "Download template from Partner Central. Fill all green cells, indicate effort in days (1 day = 8 hours)",
              links: []
            }
          ]
        }
      ]
    },
    {
      id: "phase-6",
      title: "Phase 6: Project Closeout",
      sections: [
        {
          title: "Customer Sign-off Process",
          applicability: ["map", "map-lite"],
          items: [
            {
              id: "6-1",
              text: "Download MAP Customer Sign-off Template",
              tooltip: "Use only the official template from Partner Central. Do not modify the template structure",
              links: []
            },
            {
              id: "6-2",
              text: "Complete partner acknowledgment section",
              tooltip: "Include project name, fund request ID, actual dates, and total pre-approved funding amount",
              links: []
            },
            {
              id: "6-3",
              text: "Obtain customer signature",
              tooltip: "Acceptable: Wet signature (scanned), DocuSign, electronic signature. NOT acceptable: Email acknowledgment",
              links: []
            }
          ]
        },
        {
          title: "MAP Lite Specific",
          applicability: ["map-lite"],
          items: [
            {
              id: "6-4",
              text: "Customer confirms FULL migration completion",
              tooltip: "For MAP Lite Mobilize payments, customer must confirm the entire migration is complete, not just the Mobilize phase",
              required: true,
              links: []
            }
          ]
        }
      ]
    }
  ]
};

// Tooltip component
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-full ml-2">
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-4"></div>
          {content}
        </div>
      )}
    </div>
  );
};

// Main Application Component
export default function MAPChecklist() {
  const [projectType, setProjectType] = useState('both');
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('mapChecklistProgress');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
    // Expand all phases by default
    const expanded = {};
    checklistData.phases.forEach(phase => {
      expanded[phase.id] = true;
    });
    setExpandedPhases(expanded);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('mapChecklistProgress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const calculateProgress = () => {
    let totalItems = 0;
    let checkedCount = 0;

    checklistData.phases.forEach(phase => {
      phase.sections.forEach(section => {
        if (shouldShowSection(section)) {
          section.items.forEach(item => {
            if (shouldShowItem(item)) {
              totalItems++;
              if (checkedItems[item.id]) checkedCount++;
            }
          });
        }
      });
    });

    return totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  };

  const shouldShowSection = (section) => {
    if (projectType === 'both') return true;
    return section.applicability.includes(projectType);
  };

  const shouldShowItem = (item) => {
    if (searchTerm && !item.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  };

  const exportProgress = () => {
    const data = {
      projectType,
      checkedItems,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map-checklist-progress.json';
    a.click();
  };

  const importProgress = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setProjectType(data.projectType || 'both');
          setCheckedItems(data.checkedItems || {});
        } catch (error) {
          alert('Invalid progress file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">MAP Migration Project Checklist</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Progress: {calculateProgress()}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Project Type Selector */}
            <select 
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">All Items</option>
              <option value="map">MAP Only ($500K-$10M)</option>
              <option value="map-lite">MAP Lite ($100K-$500K)</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Import/Export */}
            <button
              onClick={exportProgress}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" onChange={importProgress} className="hidden" accept=".json" />
            </label>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">Important Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {checklistData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">{resource.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Checklist Phases */}
        {checklistData.phases.map(phase => (
          <div key={phase.id} className="mb-6">
            <button
              onClick={() => togglePhase(phase.id)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900">{phase.title}</h2>
              {expandedPhases[phase.id] ? 
                <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                <ChevronRight className="w-5 h-5 text-gray-500" />
              }
            </button>

            {expandedPhases[phase.id] && (
              <div className="mt-2 space-y-4">
                {phase.sections.map((section, sectionIndex) => {
                  if (!shouldShowSection(section)) return null;

                  return (
                    <div key={sectionIndex} className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        {section.title}
                        {section.applicability.includes('map') && !section.applicability.includes('map-lite') && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">MAP Only</span>
                        )}
                        {!section.applicability.includes('map') && section.applicability.includes('map-lite') && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">MAP Lite Only</span>
                        )}
                      </h3>

                      <div className="space-y-2">
                        {section.items.map(item => {
                          if (!shouldShowItem(item)) return null;

                          return (
                            <div key={item.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                              <input
                                type="checkbox"
                                checked={checkedItems[item.id] || false}
                                onChange={() => toggleCheck(item.id)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`${checkedItems[item.id] ? 'line-through text-gray-500' : ''}`}>
                                    {item.text}
                                  </span>
                                  
                                  {item.required && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                                  )}
                                  
                                  {item.tooltip && (
                                    <Tooltip content={item.tooltip}>
                                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                                    </Tooltip>
                                  )}
                                  
                                  {item.links && item.links.map((link, linkIndex) => (
                                    <a
                                      key={linkIndex}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      {link.text}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
