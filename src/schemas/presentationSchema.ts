export const presentationSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["presentation"],
  "properties": {
    "presentation": {
      "type": "object",
      "required": ["metadata", "pages"],
      "properties": {
        "metadata": {
          "type": "object",
          "required": ["title", "author"],
          "properties": {
            "title": { "type": "string" },
            "author": { "type": "string" },
            "date": { "type": "string" },
            "theme": { 
              "type": "string",
              "enum": ["light", "dark", "corporate", "academic", "creative"]
            },
            "language": { "type": "string" },
            "company": { "type": "string" },
            "department": { "type": "string" }
          }
        },
        "sections": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["title"],
            "properties": {
              "title": { "type": "string" },
              "description": { "type": "string" },
              "icon": { "type": "string" }
            }
          }
        },
        "components": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "type", "content"],
            "properties": {
              "id": { "type": "string" },
              "type": { 
                "type": "string",
                "enum": [
                  "text",
                  "image",
                  "table",
                  "chart",
                  "list",
                  "quote",
                  "code",
                  "video",
                  "shape",
                  "icon",
                  "timeline",
                  "process",
                  "comparison"
                ]
              },
              "title": { "type": "string" },
              "description": { "type": "string" },
              "content": {
                "type": "object",
                "properties": {
                  "text": { "type": "string" },
                  "imageUrl": { "type": "string" },
                  "imageCaption": { "type": "string" },
                  "tableData": { "type": "array" },
                  "chartData": { "type": "object" },
                  "listItems": { "type": "array", "items": { "type": "string" } },
                  "listType": { "type": "string", "enum": ["bullet", "numbered", "check"] },
                  "quoteText": { "type": "string" },
                  "quoteAuthor": { "type": "string" },
                  "code": { "type": "string" },
                  "codeLanguage": { "type": "string" },
                  "videoUrl": { "type": "string" },
                  "videoType": { "type": "string", "enum": ["youtube", "vimeo", "mp4"] },
                  "shape": { 
                    "type": "string",
                    "enum": ["rectangle", "circle", "triangle", "arrow", "star", "cloud"]
                  },
                  "icon": { "type": "string" },
                  "timelineEvents": { "type": "array" },
                  "processSteps": { "type": "array" },
                  "comparisonItems": { "type": "array" }
                }
              },
              "style": {
                "type": "object",
                "properties": {
                  "fontWeight": { "type": "string" },
                  "alignment": { "type": "string" },
                  "padding": { "type": "string" },
                  "margin": { "type": "string" },
                  "width": { "type": "string" },
                  "height": { "type": "string" },
                  "position": { "type": "string" }
                }
              }
            }
          }
        },
        "pages": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["title", "content"],
            "properties": {
              "title": { 
                "type": "string",
                "description": "The title of the slide"
              },
              "subtitle": { "type": "string" },
              "layout": { 
                "type": "string", 
                "enum": [
                  "grid",
                  "component-grid",
                  "two-column",
                  "three-column",
                  "full-width"
                ],
                "default": "grid"
              },
              "gridConfig": {
                "type": "object",
                "properties": {
                  "columns": { 
                    "type": "number",
                    "minimum": 1,
                    "maximum": 12,
                    "default": 2
                  },
                  "gap": { 
                    "type": "number",
                    "minimum": 0,
                    "default": 2
                  },
                  "columnDefinitions": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "width": {
                          "type": "string",
                          "enum": ["auto", "1fr", "2fr", "3fr", "4fr", "5fr", "6fr", "7fr", "8fr", "9fr", "10fr", "11fr", "12fr"],
                          "default": "1fr"
                        },
                        "minWidth": { "type": "string" },
                        "maxWidth": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "section": { "type": "string" },
              "background": {
                "type": "object",
                "properties": {
                  "image": { "type": "string" }
                }
              },
              "animation": {
                "type": "object",
                "properties": {
                  "type": { 
                    "type": "string",
                    "enum": ["fade", "slide", "zoom", "bounce", "none"]
                  },
                  "duration": { "type": "number" }
                }
              },
              "content": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "type": "object",
                  "required": ["type", "content"],
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "text",
                        "image",
                        "table",
                        "chart",
                        "list",
                        "quote",
                        "code",
                        "video",
                        "shape",
                        "icon",
                        "timeline",
                        "process",
                        "comparison",
                        "component"
                      ]
                    },
                    "content": {
                      "type": "object",
                      "properties": {
                        "componentId": { "type": "string" },
                        "gridArea": {
                          "type": "object",
                          "properties": {
                            "columnStart": { 
                              "type": "number",
                              "minimum": 1,
                              "description": "Starting column position (1-based)"
                            },
                            "columnEnd": { 
                              "type": "number",
                              "minimum": 1,
                              "description": "Ending column position (1-based)"
                            },
                            "rowStart": { 
                              "type": "number",
                              "minimum": 1,
                              "description": "Starting row position (1-based)"
                            },
                            "rowEnd": { 
                              "type": "number",
                              "minimum": 1,
                              "description": "Ending row position (1-based)"
                            }
                          }
                        },
                        "alignment": {
                          "type": "object",
                          "properties": {
                            "horizontal": { 
                              "type": "string",
                              "enum": ["start", "center", "end", "stretch"],
                              "default": "stretch"
                            },
                            "vertical": { 
                              "type": "string",
                              "enum": ["start", "center", "end", "stretch"],
                              "default": "stretch"
                            }
                          }
                        },
                        "span": {
                          "type": "number",
                          "minimum": 1,
                          "maximum": 12,
                          "default": 1,
                          "description": "Number of grid columns this component should span"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 