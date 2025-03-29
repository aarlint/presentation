import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Snackbar, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { uploadYaml } from '../services/api';
import { generatePresentation } from '../services/presentationService';
import type { Presentation, PresentationPage, PresentationContent } from '../services/presentationService';
import PresentationView from '../components/PresentationView';
import VisibilityIcon from '@mui/icons-material/Visibility';

// JSON Schema for the PowerPoint definition
const jsonSchema = {
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
              "color": { "type": "string" },
              "icon": { "type": "string" }
            }
          }
        },
        "pages": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["content"],
            "properties": {
              "title": { "type": "string" },
              "subtitle": { "type": "string" },
              "layout": { 
                "type": "string", 
                "enum": [
                  "title",
                  "content",
                  "section",
                  "two-column",
                  "comparison",
                  "timeline",
                  "grid",
                  "quote",
                  "image-focus",
                  "process"
                ]
              },
              "section": { "type": "string" },
              "background": {
                "type": "object",
                "properties": {
                  "color": { "type": "string" },
                  "image": { "type": "string" },
                  "gradient": { "type": "string" }
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
                        "comparison"
                      ]
                    },
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
                        "fontSize": { "type": "string" },
                        "fontWeight": { "type": "string" },
                        "color": { "type": "string" },
                        "backgroundColor": { "type": "string" },
                        "alignment": { "type": "string" },
                        "padding": { "type": "string" },
                        "margin": { "type": "string" }
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

const defaultJson = `{
  "presentation": {
    "metadata": {
      "title": "Comprehensive Presentation Example",
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
        "color": "#4CAF50",
        "icon": "home"
      },
      {
        "title": "Features",
        "description": "Key features and capabilities",
        "color": "#2196F3",
        "icon": "star"
      },
      {
        "title": "Technical Details",
        "description": "In-depth technical information",
        "color": "#FF9800",
        "icon": "code"
      }
    ],
    "pages": [
      {
        "title": "Welcome",
        "layout": "title",
        "background": {
          "gradient": "linear-gradient(45deg, #2196F3, #4CAF50)"
        },
        "animation": {
          "type": "fade",
          "duration": 0.5
        },
        "content": [
          {
            "type": "text",
            "content": {
              "text": "Welcome to our Enhanced Presentation"
            },
            "style": {
              "fontSize": "48px",
              "color": "#FFFFFF",
              "textAlign": "center"
            }
          }
        ]
      },
      {
        "title": "Feature Overview",
        "layout": "grid",
        "section": "Features",
        "content": [
          {
            "type": "list",
            "content": {
              "listItems": [
                "Rich content types",
                "Custom layouts",
                "Animations",
                "Styling options",
                "Section organization"
              ],
              "listType": "check"
            },
            "style": {
              "fontSize": "24px",
              "color": "#333333"
            }
          }
        ]
      },
      {
        "title": "Data Visualization",
        "layout": "two-column",
        "content": [
          {
            "type": "chart",
            "content": {
              "chartData": {
                "type": "bar",
                "labels": ["Q1", "Q2", "Q3", "Q4"],
                "values": [65, 59, 80, 81]
              }
            }
          },
          {
            "type": "text",
            "content": {
              "text": "Our quarterly performance shows consistent growth across all metrics."
            }
          }
        ]
      },
      {
        "title": "Code Example",
        "layout": "content",
        "section": "Technical Details",
        "background": {
          "color": "#1E1E1E"
        },
        "content": [
          {
            "type": "code",
            "content": {
              "code": "function generatePresentation(data) {\\n  const pptx = new pptxgen();\\n  // ... implementation\\n}",
              "codeLanguage": "javascript"
            },
            "style": {
              "fontSize": "16px",
              "color": "#FFFFFF"
            }
          }
        ]
      },
      {
        "title": "Inspirational Quote",
        "layout": "quote",
        "content": [
          {
            "type": "quote",
            "content": {
              "quoteText": "The best way to predict the future is to create it.",
              "quoteAuthor": "Peter Drucker"
            },
            "style": {
              "fontSize": "32px",
              "color": "#2196F3"
            }
          }
        ]
      },
      {
        "title": "Process Overview",
        "layout": "process",
        "section": "Features",
        "content": [
          {
            "type": "process",
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
          }
        ]
      },
      {
        "title": "Timeline",
        "layout": "timeline",
        "content": [
          {
            "type": "timeline",
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
          }
        ]
      },
      {
        "title": "Comparison",
        "layout": "comparison",
        "content": [
          {
            "type": "comparison",
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
        ]
      },
      {
        "title": "Media Integration",
        "layout": "image-focus",
        "content": [
          {
            "type": "image",
            "content": {
              "imageUrl": "https://example.com/sample-image.jpg",
              "imageCaption": "Sample image with caption"
            }
          }
        ]
      },
      {
        "title": "Video Content",
        "layout": "content",
        "content": [
          {
            "type": "video",
            "content": {
              "videoUrl": "https://www.youtube.com/watch?v=example",
              "videoType": "youtube"
            }
          }
        ]
      },
      {
        "title": "Shapes and Icons",
        "layout": "grid",
        "content": [
          {
            "type": "shape",
            "content": {
              "shape": "arrow"
            }
          },
          {
            "type": "icon",
            "content": {
              "icon": "star"
            }
          }
        ]
      },
      {
        "title": "Table Example",
        "layout": "content",
        "content": [
          {
            "type": "table",
            "content": {
              "tableData": [
                ["Feature", "Status", "Priority"],
                ["Rich Content", "Complete", "High"],
                ["Animations", "In Progress", "Medium"],
                ["Custom Themes", "Planned", "Low"]
              ]
            },
            "style": {
              "fontSize": "14px",
              "color": "#333333"
            }
          }
        ]
      }
    ]
  }
}`;

// Preview component to show a simplified version of the slides
const PreviewComponent: React.FC<{ yamlContent: string }> = ({ yamlContent }) => {
  try {
    const data = JSON.parse(yamlContent) as { presentation: Presentation };
    return (
      <Box>
        {/* Metadata Preview */}
        <Paper className="neoglass-card" sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Presentation Info
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Title</Typography>
              <Typography variant="body1">{data.presentation.metadata.title}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Author</Typography>
              <Typography variant="body1">{data.presentation.metadata.author}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Theme</Typography>
              <Typography variant="body1">{data.presentation.metadata.theme}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Company</Typography>
              <Typography variant="body1">{data.presentation.metadata.company}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Sections Preview */}
        {data.presentation.sections && data.presentation.sections.length > 0 && (
          <Paper className="neoglass-card" sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sections
            </Typography>
            <Grid container spacing={2}>
              {data.presentation.sections.map((section, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: section.color + '20',
                    border: `1px solid ${section.color}`
                  }}>
                    <Typography variant="subtitle1" sx={{ color: section.color }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Pages Preview */}
        {data.presentation.pages.map((page: PresentationPage, index: number) => (
          <Paper 
            key={index} 
            className="neoglass-card" 
            sx={{ 
              mb: 2, 
              p: 2,
              background: page.background?.gradient || page.background?.color || 'inherit'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: page.background?.gradient || page.background?.color ? '#FFFFFF' : 'inherit' }}>
                {page.title || `Slide ${index + 1}`}
              </Typography>
              {page.layout && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    color: page.background?.gradient || page.background?.color ? '#FFFFFF' : 'inherit'
                  }}
                >
                  {page.layout}
                </Typography>
              )}
            </Box>
            
            {page.subtitle && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                gutterBottom
                sx={{ color: page.background?.gradient || page.background?.color ? '#FFFFFF' : 'inherit' }}
              >
                {page.subtitle}
              </Typography>
            )}

            {page.content.map((block: PresentationContent, blockIndex: number) => (
              <Box 
                key={blockIndex} 
                sx={{ 
                  mt: 1,
                  ...block.style,
                  color: page.background?.gradient || page.background?.color ? '#FFFFFF' : 'inherit'
                }}
              >
                {block.type === 'text' && block.content.text && (
                  <Typography variant="body1">{block.content.text}</Typography>
                )}
                
                {block.type === 'image' && block.content.imageUrl && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      [Image: {block.content.imageUrl}]
                    </Typography>
                    {block.content.imageCaption && (
                      <Typography variant="caption" color="text.secondary">
                        {block.content.imageCaption}
                      </Typography>
                    )}
                  </Box>
                )}
                
                {block.type === 'table' && block.content.tableData && (
                  <Typography variant="body2" color="text.secondary">
                    [Table with {block.content.tableData.length} rows]
                  </Typography>
                )}
                
                {block.type === 'chart' && block.content.chartData && (
                  <Typography variant="body2" color="text.secondary">
                    [Chart: {block.content.chartData.type}]
                  </Typography>
                )}
                
                {block.type === 'list' && block.content.listItems && (
                  <Box component="ul" sx={{ pl: 2 }}>
                    {block.content.listItems.map((item, i) => (
                      <Typography component="li" key={i} variant="body1">
                        {item}
                      </Typography>
                    ))}
                  </Box>
                )}
                
                {block.type === 'quote' && block.content.quoteText && (
                  <Box sx={{ pl: 2, borderLeft: '4px solid currentColor' }}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{block.content.quoteText}"
                    </Typography>
                    {block.content.quoteAuthor && (
                      <Typography variant="subtitle2" color="text.secondary">
                        - {block.content.quoteAuthor}
                      </Typography>
                    )}
                  </Box>
                )}
                
                {block.type === 'code' && block.content.code && (
                  <Box sx={{ 
                    bgcolor: 'rgba(0,0,0,0.1)', 
                    p: 1, 
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  }}>
                    <Typography variant="body2">
                      [{block.content.codeLanguage || 'code'}]
                    </Typography>
                  </Box>
                )}
                
                {block.type === 'video' && block.content.videoUrl && (
                  <Typography variant="body2" color="text.secondary">
                    [Video: {block.content.videoType} - {block.content.videoUrl}]
                  </Typography>
                )}
                
                {block.type === 'shape' && block.content.shape && (
                  <Typography variant="body2" color="text.secondary">
                    [Shape: {block.content.shape}]
                  </Typography>
                )}
                
                {block.type === 'icon' && block.content.icon && (
                  <Typography variant="body2" color="text.secondary">
                    [Icon: {block.content.icon}]
                  </Typography>
                )}
                
                {block.type === 'timeline' && block.content.timelineEvents && (
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      [Timeline with {block.content.timelineEvents.length} events]
                    </Typography>
                  </Box>
                )}
                
                {block.type === 'process' && block.content.processSteps && (
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      [Process with {block.content.processSteps.length} steps]
                    </Typography>
                  </Box>
                )}
                
                {block.type === 'comparison' && block.content.comparisonItems && (
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      [Comparison with {block.content.comparisonItems.length} items]
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        ))}
      </Box>
    );
  } catch (error) {
    return (
      <Typography color="error">
        Invalid JSON format
      </Typography>
    );
  }
};

const HomePage: React.FC = () => {
  const [editorContent, setEditorContent] = useState(defaultJson);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isFirstValidation, setIsFirstValidation] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleCopySchema = () => {
    try {
      const schemaString = JSON.stringify(jsonSchema, null, 2);
      navigator.clipboard.writeText(schemaString);
      setSnackbarMessage('Schema copied to clipboard!');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to copy schema. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorContent(value);
    }
  };

  const validateJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      // Basic validation against schema
      if (!parsed.presentation || !parsed.presentation.metadata || !parsed.presentation.pages) {
        throw new Error('Invalid presentation structure');
      }
      return true;
    } catch (error) {
      setError('Invalid JSON format or structure');
      setShowError(true);
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditorContent(content);
      validateJson(content);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('active');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('active');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('active');
    
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditorContent(content);
      validateJson(content);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!validateJson(editorContent)) return;

    setLoading(true);
    try {
      await generatePresentation(JSON.parse(editorContent));
      setSnackbarOpen(true);
    } catch (error) {
      setError('Failed to generate presentation');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setShowError(false);
  };

  const handleViewPresentation = () => {
    try {
      const data = JSON.parse(editorContent) as { presentation: Presentation };
      setCurrentPresentation(data.presentation);
      setShowPresentation(true);
    } catch (error) {
      setError('Invalid JSON format');
      setShowError(true);
    }
  };

  const handleClosePresentation = () => {
    setShowPresentation(false);
    setCurrentPresentation(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Presentation Generator
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Create beautiful presentations using a simple JSON schema
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="neoglass-card" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Presentation Schema
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Tooltip title="Copy schema to clipboard">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCopySchema}
                    sx={{ textTransform: 'none', mr: 1 }}
                  >
                    Copy Schema
                  </Button>
                </Tooltip>
                <Tooltip title="View presentation">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleViewPresentation}
                    startIcon={<VisibilityIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    View Presentation
                  </Button>
                </Tooltip>
              </Box>
              <Editor
                height="500px"
                defaultLanguage="json"
                value={editorContent}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="neoglass-card" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box sx={{ height: '500px', overflow: 'auto' }}>
                <PreviewComponent yamlContent={editorContent} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading}
            className="neoglass-button"
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Presentation'}
          </Button>
        </Box>
      </Box>

      <Dialog open={showError} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Presentation generated successfully!"
      />

      {showPresentation && currentPresentation && (
        <PresentationView
          presentation={currentPresentation}
          onClose={handleClosePresentation}
        />
      )}
    </motion.div>
  );
};

export default HomePage;