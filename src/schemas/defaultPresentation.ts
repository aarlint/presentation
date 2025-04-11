export const defaultPresentation = `{
  "presentation": {
    "metadata": {
      "title": "Modern Presentation Example",
      "author": "John Doe",
      "date": "2024-03-29",
      "theme": "corporate",
      "language": "English",
      "company": "TechCorp Inc.",
      "department": "Product Development"
    },
    "sections": [
      {
        "title": "Introduction",
        "description": "Getting started with our presentation",
        "icon": "home"
      },
      {
        "title": "Features",
        "description": "Key features and capabilities",
        "icon": "star"
      },
      {
        "title": "Technical Details",
        "description": "In-depth technical information",
        "icon": "code"
      }
    ],
    "components": [
      {
        "id": "header-text",
        "type": "text",
        "title": "Welcome Message",
        "description": "Main introduction text for the presentation",
        "content": {
          "text": "Welcome to our Enhanced Presentation"
        },
        "style": {
          "textAlign": "center"
        }
      },
      {
        "id": "feature-list",
        "type": "list",
        "title": "Key Features",
        "description": "Overview of main presentation capabilities",
        "content": {
          "listItems": [
            "Rich content types",
            "Custom layouts",
            "Animations",
            "Styling options",
            "Section organization"
          ],
          "listType": "check"
        }
      },
      {
        "id": "performance-chart",
        "type": "chart",
        "title": "Quarterly Performance",
        "description": "Visual representation of quarterly metrics",
        "content": {
          "chartData": {
            "type": "bar",
            "labels": ["Q1", "Q2", "Q3", "Q4"],
            "values": [65, 59, 80, 81]
          }
        },
        "style": {
          "width": "100%",
          "height": "300px"
        }
      },
      {
        "id": "code-example",
        "type": "code",
        "title": "Implementation Example",
        "description": "Sample code showing presentation generation",
        "content": {
          "code": "function generatePresentation(data) {\\n  const pptx = new pptxgen();\\n  // ... implementation\\n}",
          "codeLanguage": "javascript"
        },
        "style": {
          "padding": "16px"
        }
      },
      {
        "id": "inspirational-quote",
        "type": "quote",
        "title": "Words of Wisdom",
        "description": "Motivational quote to inspire the audience",
        "content": {
          "quoteText": "The best way to predict the future is to create it.",
          "quoteAuthor": "Peter Drucker"
        }
      },
      {
        "id": "process-steps",
        "type": "process",
        "title": "Development Workflow",
        "description": "Step-by-step guide to our development process",
        "content": {
          "processSteps": [
            {
              "title": "Design",
              "description": "Create presentation structure"
            },
            {
              "title": "Develop",
              "description": "Implement features"
            },
            {
              "title": "Deploy",
              "description": "Release to production"
            }
          ]
        }
      },
      {
        "id": "timeline-events",
        "type": "timeline",
        "title": "Project Milestones",
        "description": "Key dates and achievements in our timeline",
        "content": {
          "timelineEvents": [
            {
              "date": "2024 Q1",
              "event": "Initial Release"
            },
            {
              "date": "2024 Q2",
              "event": "Feature Expansion"
            },
            {
              "date": "2024 Q3",
              "event": "Performance Optimization"
            }
          ]
        }
      },
      {
        "id": "comparison-view",
        "type": "comparison",
        "title": "Feature Evolution",
        "description": "Comparison of old and new features",
        "content": {
          "comparisonItems": [
            {
              "title": "Before",
              "features": ["Basic slides", "Limited styling", "No animations"]
            },
            {
              "title": "After",
              "features": ["Rich content", "Custom themes", "Interactive elements"]
            }
          ]
        }
      }
    ],
    "pages": [
      {
        "title": "Welcome",
        "layout": "grid",
        "gridConfig": {
          "columns": 12,
          "gap": 2,
          "columnDefinitions": [
            { "width": "2fr" },
            { "width": "1fr" },
            { "width": "1fr" },
            { "width": "2fr" },
            { "width": "2fr" },
            { "width": "2fr" },
            { "width": "2fr" }
          ]
        },
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "header-text",
              "gridArea": {
                "columnStart": 1,
                "columnEnd": 7,
                "rowStart": 1,
                "rowEnd": 2
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "feature-list",
              "gridArea": {
                "columnStart": 1,
                "columnEnd": 3,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "start",
                "vertical": "start"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "performance-chart",
              "gridArea": {
                "columnStart": 3,
                "columnEnd": 5,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "code-example",
              "gridArea": {
                "columnStart": 5,
                "columnEnd": 7,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "end",
                "vertical": "stretch"
              }
            }
          }
        ]
      },
      {
        "title": "Technical Implementation",
        "layout": "grid",
        "gridConfig": {
          "columns": 6,
          "gap": 2,
          "columnDefinitions": [
            { "width": "1fr" },
            { "width": "2fr" },
            { "width": "2fr" },
            { "width": "1fr" }
          ]
        },
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "code-example",
              "gridArea": {
                "columnStart": 1,
                "columnEnd": 5,
                "rowStart": 1,
                "rowEnd": 2
              },
              "alignment": {
                "horizontal": "stretch",
                "vertical": "stretch"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "feature-list",
              "gridArea": {
                "columnStart": 1,
                "columnEnd": 2,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "start",
                "vertical": "start"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "performance-chart",
              "gridArea": {
                "columnStart": 2,
                "columnEnd": 4,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "header-text",
              "gridArea": {
                "columnStart": 4,
                "columnEnd": 5,
                "rowStart": 2,
                "rowEnd": 3
              },
              "alignment": {
                "horizontal": "end",
                "vertical": "end"
              }
            }
          }
        ]
      },
      {
        "title": "Feature Overview",
        "layout": "component-grid",
        "section": "Features",
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "feature-list",
              "position": "left"
            }
          },
          {
            "type": "component",
            "content": {
              "componentId": "performance-chart",
              "position": "right"
            }
          }
        ]
      },
      {
        "title": "Inspiration",
        "layout": "component-grid",
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "inspirational-quote",
              "position": "center"
            }
          }
        ]
      },
      {
        "title": "Development Process",
        "layout": "component-grid",
        "section": "Technical Details",
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "process-steps",
              "position": "center"
            }
          }
        ]
      },
      {
        "title": "Project Timeline",
        "layout": "component-grid",
        "section": "Features",
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "timeline-events",
              "position": "center"
            }
          }
        ]
      },
      {
        "title": "Feature Comparison",
        "layout": "component-grid",
        "section": "Features",
        "content": [
          {
            "type": "component",
            "content": {
              "componentId": "comparison-view",
              "position": "center"
            }
          }
        ]
      }
    ]
  }
}`; 