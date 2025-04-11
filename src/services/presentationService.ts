import pptxgen from 'pptxgenjs';

// Remove the custom ShapeType object and use the one from pptxgenjs directly
// The enum is available from the pptxgen import as shown in usage below

export interface PresentationMetadata {
  title: string;
  author: string;
  date?: string;
  theme?: 'light' | 'dark' | 'corporate' | 'academic' | 'creative';
  language?: string;
  company?: string;
  department?: string;
}

export interface PresentationSection {
  title: string;
  description?: string;
  icon?: string;
}

export interface PresentationContent {
  type: 'text' | 'image' | 'table' | 'chart' | 'list' | 'quote' | 'code' | 'video' | 'shape' | 'icon' | 'timeline' | 'process' | 'comparison' | 'component';
  content: {
    text?: string;
    imageUrl?: string;
    imageCaption?: string;
    tableData?: any[][];
    chartData?: {
      type: string;
      labels: string[];
      values: number[];
    };
    listItems?: string[];
    listType?: 'bullet' | 'numbered' | 'check';
    quoteText?: string;
    quoteAuthor?: string;
    code?: string;
    codeLanguage?: string;
    videoUrl?: string;
    videoType?: 'youtube' | 'vimeo' | 'mp4';
    shape?: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'star' | 'cloud';
    icon?: string;
    timelineEvents?: any[];
    processSteps?: any[];
    comparisonItems?: any[];
    componentId?: string;
    position?: 'left' | 'center' | 'right';
    gridArea?: {
      columnStart: number;
      columnEnd: number;
      rowStart: number;
      rowEnd: number;
    };
    alignment?: {
      horizontal?: 'start' | 'center' | 'end' | 'stretch';
      vertical?: 'start' | 'center' | 'end' | 'stretch';
    };
    span?: number;
  };
  style?: {
    fontSize?: string;
    fontWeight?: string;
    alignment?: string;
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    position?: string;
  };
}

export interface PresentationPage {
  title?: string;
  subtitle?: string;
  layout: 'title' | 'content' | 'section' | 'two-column' | 'comparison' | 'timeline' | 'grid' | 'quote' | 'image-focus' | 'process' | 'component-grid' | string;
  section?: string;
  background?: {
    image?: string;
  };
  animation?: {
    type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
    duration?: number;
  };
  gridConfig?: {
    columns: number;
    gap: number;
    columnDefinitions?: Array<{
      width: string;
      minWidth?: string;
      maxWidth?: string;
    }>;
  };
  content: PresentationContent[];
}

export interface PresentationComponent {
  id: string;
  type: 'text' | 'image' | 'table' | 'chart' | 'list' | 'quote' | 'code' | 'video' | 'shape' | 'icon' | 'timeline' | 'process' | 'comparison';
  title?: string;
  description?: string;
  content: {
    text?: string;
    imageUrl?: string;
    imageCaption?: string;
    tableData?: any[][];
    chartData?: {
      type: string;
      labels: string[];
      values: number[];
    };
    listItems?: string[];
    listType?: 'bullet' | 'numbered' | 'check';
    quoteText?: string;
    quoteAuthor?: string;
    code?: string;
    codeLanguage?: string;
    videoUrl?: string;
    videoType?: 'youtube' | 'vimeo' | 'mp4';
    shape?: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'star' | 'cloud';
    icon?: string;
    timelineEvents?: any[];
    processSteps?: any[];
    comparisonItems?: any[];
  };
  style?: {
    fontSize?: string;
    fontWeight?: string;
    alignment?: string;
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    position?: string;
  };
}

export interface Presentation {
  metadata: PresentationMetadata;
  sections?: PresentationSection[];
  components?: PresentationComponent[];
  pages: PresentationPage[];
}

export const generatePresentation = async (data: { presentation: Presentation }): Promise<void> => {
  // Helper function to convert string percentages to numeric values for pptxgenjs
  function convertPosition(pos: {x: string, y: string, w: string, h: string}) {
    // Convert percentage strings (e.g., '10%') to numbers (e.g., 0.1)
    const parsePercent = (value: string): number => {
      if (typeof value === 'string' && value.endsWith('%')) {
        return parseFloat(value) / 100;
      }
      return parseFloat(value);
    };

    return {
      x: parsePercent(pos.x),
      y: parsePercent(pos.y),
      w: parsePercent(pos.w),
      h: parsePercent(pos.h)
    };
  }
  
  // Helper function to get PPT shape types
  function getShapeType() {
    return pptxgen.ShapeType;
  }

  const pptx = new pptxgen();
  const { presentation } = data;
  const ShapeType = getShapeType();

  try {
    // Set presentation metadata
    pptx.author = presentation.metadata.author;
    pptx.title = presentation.metadata.title;
    if (presentation.metadata.company) {
      pptx.company = presentation.metadata.company;
    }

    // Create a map of components for easy access
    const componentsMap = new Map<string, PresentationComponent>();
    if (presentation.components) {
      presentation.components.forEach(component => {
        componentsMap.set(component.id, component);
      });
    }

    // Generate slides
    for (const page of presentation.pages) {
      try {
        const slide = pptx.addSlide();

        // Apply theme based on metadata
        const theme = presentation.metadata.theme || 'light';
        const themeColors = {
          'light': { bg: 'FFFFFF', text: '333333', accent: '3F97F6' },
          'dark': { bg: '2D2D2D', text: 'F5F5F5', accent: '3F97F6' },
          'corporate': { bg: 'F5F7FA', text: '2C3E50', accent: '3498DB' },
          'academic': { bg: 'FFF9F0', text: '34495E', accent: 'E67E22' },
          'creative': { bg: 'F0F6FF', text: '2E4053', accent: '9B59B6' }
        };
        
        const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

        // Set slide background
        if (page.background && page.background.image) {
          try {
            slide.background = { path: page.background.image };
          } catch (error) {
            console.warn(`Failed to set background image: ${page.background.image}`, error);
            slide.background = { color: colors.bg };
          }
        } else {
          slide.background = { color: colors.bg };
        }

        // Set slide title with improved styling
        if (page.title) {
          slide.addText(page.title, {
            x: 0.05,
            y: 0.05,
            w: 0.9,
            h: 0.1,
            fontSize: 28,
            bold: true,
            color: colors.text,
            align: 'center',
          });
        }

        // Add subtitle if present with improved styling
        if (page.subtitle) {
          slide.addText(page.subtitle, {
            x: 0.05,
            y: 0.15,
            w: 0.9,
            h: 0.05,
            fontSize: 20,
            color: colors.text,
            align: 'center',
            italic: true,
          });
        }

        // Calculate layout positions based on the layout type
        let layoutConfig = {
          startY: page.subtitle ? 0.22 : 0.17,
          contentHeight: 0.75,
        };

        // Handle different layout types
        switch (page.layout) {
          case 'grid':
            // Grid layout will be handled per content element using gridArea
            break;
          case 'component-grid':
            // Component-grid layout will be handled based on position property
            break;
          case 'two-column':
            // Set up a two-column layout
            layoutConfig = {
              startY: page.subtitle ? 0.22 : 0.17,
              contentHeight: 0.75,
            };
            break;
          // Additional layout types can be implemented here
        }

        // Add content based on type
        for (const content of page.content) {
          try {
            const style = content.style || {};
            const alignment = (style.alignment as 'left' | 'center' | 'right') || 'left';

            // Calculate default position - centered on slide with appropriate margins
            let position = {
              x: '10%',  // Increased from 5% to provide better margins
              y: `${layoutConfig.startY * 100}%`,
              w: '80%',  // Reduced from 90% to provide better margins
              h: `${layoutConfig.contentHeight * 100}%`,
            };

            // Adjust positions for grid layouts
            if (page.layout === 'grid' && page.gridConfig && content.content.gridArea) {
              const { columnStart, columnEnd, rowStart, rowEnd } = content.content.gridArea;
              const totalColumns = page.gridConfig.columns || 12;
              
              // Better grid calculations with margins
              const availableWidth = 80; // 80% of slide width (10% margins on each side)
              const colWidth = availableWidth / totalColumns;
              const x = 10 + (columnStart - 1) * colWidth; // Start at 10% (left margin)
              const w = (columnEnd - columnStart + 1) * colWidth;
              
              // Better row calculation with proper spacing
              const totalRows = Math.max(4, Math.ceil(page.content.length / totalColumns)); // Estimate row count based on content
              const availableHeight = 70; // 70% of slide height for content
              const rowHeight = availableHeight / totalRows;
              
              const y = layoutConfig.startY * 100 + (rowStart - 1) * rowHeight;
              const h = (rowEnd - rowStart + 1) * rowHeight;
              
              position = {
                x: `${x}%`,
                y: `${y}%`,
                w: `${w}%`,
                h: `${h}%`,
              };
            }
            
            // Adjust positions for component-grid layouts with better spacing
            if (page.layout === 'component-grid' && content.content.position) {
              switch(content.content.position) {
                case 'left':
                  position = { x: '10%', y: `${layoutConfig.startY * 100}%`, w: '38%', h: `${layoutConfig.contentHeight * 100}%` };
                  break;
                case 'center':
                  position = { x: '25%', y: `${layoutConfig.startY * 100}%`, w: '50%', h: `${layoutConfig.contentHeight * 100}%` };
                  break;
                case 'right':
                  position = { x: '52%', y: `${layoutConfig.startY * 100}%`, w: '38%', h: `${layoutConfig.contentHeight * 100}%` };
                  break;
              }
            }

            // Convert string percentages to numbers for pptxgenjs
            const pptxPosition = convertPosition(position);

            // Special handling for component type
            if (content.type === 'component' && content.content.componentId) {
              const component = componentsMap.get(content.content.componentId);
              if (component) {
                addComponentToSlide(slide, component, pptxPosition, style, colors);
                continue;
              } else {
                // If component not found, add placeholder
                slide.addText(`[Component not found: ${content.content.componentId}]`, {
                  ...pptxPosition,
                  fontSize: 14,
                  align: 'center',
                  valign: 'middle',
                  color: '999999',
                });
                continue;
              }
            }

            // Process content based on type
            switch (content.type) {
              case 'text':
                if (content.content.text) {
                  slide.addText(content.content.text, {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '16'),
                    align: alignment,
                    bold: style.fontWeight === 'bold',
                    wrap: true,
                    valign: 'top',
                    margin: 5,
                    color: colors.text,
                  });
                }
                break;

              case 'image':
                if (content.content.imageUrl) {
                  try {
                    // Add image with border and shadow for better presentation
                    slide.addImage({
                      path: content.content.imageUrl,
                      ...pptxPosition,
                      sizing: { type: 'contain', w: pptxPosition.w, h: pptxPosition.h },
                    });
                  } catch (error) {
                    // If image loading fails, add a placeholder
                    console.warn(`Failed to load image: ${content.content.imageUrl}`, error);
                    slide.addShape(ShapeType.rect, {
                      ...pptxPosition,
                      fill: { color: 'F0F0F0' },
                      line: { color: 'CCCCCC', width: 1 },
                    });
                    slide.addText('Image not available', {
                      ...pptxPosition,
                      fontSize: 14,
                      align: 'center',
                      valign: 'middle',
                      color: '999999',
                    });
                  }
                  
                  if (content.content.imageCaption) {
                    const captionY = pptxPosition.y + pptxPosition.h;
                    slide.addText(content.content.imageCaption, {
                      x: pptxPosition.x,
                      y: captionY,
                      w: pptxPosition.w,
                      h: 0.05,
                      fontSize: 12,
                      align: 'center',
                      color: colors.text,
                      italic: true,
                    });
                  }
                }
                break;

              case 'table':
                if (content.content.tableData) {
                  slide.addTable(content.content.tableData, {
                    ...pptxPosition,
                    border: { pt: 1, color: '000000' },
                    fontSize: parseInt(style.fontSize || '14'),
                    color: colors.text,
                    align: alignment,
                    rowH: 0.3, // Set consistent row height
                    autoPage: true, // Auto paginate large tables
                    colW: Array(content.content.tableData[0]?.length || 1).fill(pptxPosition.w / (content.content.tableData[0]?.length || 1)),
                  });
                }
                break;

              case 'chart':
                if (content.content.chartData) {
                  const { labels, values, type } = content.content.chartData;
                  const chartData = labels.map((label, index) => ({
                    name: label,
                    labels: [label],
                    values: [values[index]],
                  }));
                  
                  // Map custom chart types to pptxgenjs supported types
                  const chartTypeMap: Record<string, string> = {
                    'bar': 'bar',
                    'line': 'line',
                    'pie': 'pie',
                    'doughnut': 'doughnut',
                    'radar': 'radar',
                    'scatter': 'scatter',
                    'bubble': 'bubble'
                  };
                  
                  const pptxChartType = chartTypeMap[type] || 'bar';
                  
                  // Enhanced chart styling with theme colors
                  slide.addChart(pptxChartType as any, chartData, {
                    ...pptxPosition,
                    chartColors: ['3F97F6', '8AC2FF', '96A5D9', '2E75B5', '5B9BD5', '6DAEDB'],
                    border: { pt: 1, color: 'DDDDDD' },
                    shadow: { type: 'outer', angle: 45, blur: 2, offset: 2, color: 'CCCCCC' },
                    dataLabelColor: colors.text,
                    dataLabelFontSize: 10,
                    legendPos: 'b', // Bottom legend position
                    showTitle: true,
                    title: content.content.chartData.type.charAt(0).toUpperCase() + content.content.chartData.type.slice(1) + ' Chart',
                    chartColorsOpacity: 80,
                  });
                }
                break;

              case 'list':
                if (content.content.listItems) {
                  const listItems = content.content.listItems.map((item, index) => {
                    const prefix = content.content.listType === 'numbered' 
                      ? `${index + 1}. ` 
                      : content.content.listType === 'check'
                      ? '✓ '
                      : '• ';
                    return prefix + item;
                  }).join('\n');

                  slide.addText(listItems, {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '16'),
                    align: alignment,
                    wrap: true,
                    valign: 'top',
                    margin: 5,
                    lineSpacing: 1.2, // Add some line spacing for readability
                    color: colors.text,
                  });
                }
                break;

              case 'quote':
                if (content.content.quoteText) {
                  // Add a decorative quote background
                  slide.addShape(ShapeType.rect, {
                    ...pptxPosition,
                    fill: { color: 'F5F5F5' },
                    line: { color: 'DDDDDD', width: 1 },
                    shadow: { type: 'outer', blur: 3, offset: 2, color: 'CCCCCC', angle: 45 }
                  });
                  
                  const quoteY = pptxPosition.y + 0.05; // Add some top padding
                  const quoteH = pptxPosition.h - 0.15; // Reduce height to make room for author
                  
                  slide.addText(`"${content.content.quoteText}"`, {
                    x: pptxPosition.x + 0.03,
                    y: quoteY,
                    w: pptxPosition.w - 0.06,
                    h: quoteH,
                    fontSize: parseInt(style.fontSize || '20'),
                    align: 'center',
                    italic: true,
                    valign: 'middle',
                    margin: 10,
                    wrap: true,
                    color: '333333',
                  });
                  
                  if (content.content.quoteAuthor) {
                    const authorY = pptxPosition.y + pptxPosition.h - 0.08;
                    slide.addText(`- ${content.content.quoteAuthor}`, {
                      x: pptxPosition.x,
                      y: authorY,
                      w: pptxPosition.w,
                      h: 0.08,
                      fontSize: parseInt(style.fontSize || '16'),
                      align: 'right',
                      color: '666666',
                      margin: [0, 10, 0, 0], // Right margin
                    });
                  }
                }
                break;

              case 'code':
                if (content.content.code) {
                  // Add a background for code with border
                  slide.addShape(ShapeType.rect, {
                    ...pptxPosition,
                    fill: { color: 'F8F8F8' },
                    line: { color: 'E0E0E0', width: 1 },
                  });
                  
                  slide.addText(content.content.code, {
                    x: pptxPosition.x + 0.02,
                    y: pptxPosition.y + 0.02,
                    w: pptxPosition.w - 0.04,
                    h: pptxPosition.h - 0.04,
                    fontSize: parseInt(style.fontSize || '14'),
                    align: alignment,
                    fontFace: 'Courier New',
                    wrap: true,
                    valign: 'top',
                    margin: 5,
                    lineSpacing: 1.1,
                    color: '333333',
                  });
                }
                break;

              case 'video':
                if (content.content.videoUrl) {
                  // Add a visual container for video
                  slide.addShape(ShapeType.rect, {
                    ...pptxPosition,
                    fill: { color: '000000' },
                    line: { color: 'DDDDDD', width: 2 },
                  });
                  
                  // Add play button icon in center
                  slide.addShape(ShapeType.triangle, {
                    x: pptxPosition.x + pptxPosition.w/2 - 0.1,
                    y: pptxPosition.y + pptxPosition.h/2 - 0.1,
                    w: 0.2,
                    h: 0.2,
                    fill: { color: 'FFFFFF' },
                    rotate: 90,
                  });
                  
                  slide.addText(`[Video: ${content.content.videoType} - ${content.content.videoUrl}]`, {
                    x: pptxPosition.x,
                    y: pptxPosition.y + pptxPosition.h - 0.1,
                    w: pptxPosition.w,
                    h: 0.1,
                    fontSize: parseInt(style.fontSize || '14'),
                    align: 'center',
                    wrap: true,
                    valign: 'middle',
                    color: 'FFFFFF',
                  });
                }
                break;

              case 'shape':
                if (content.content.shape) {
                  // Actually draw the shape instead of just text
                  let shapeType;
                  switch(content.content.shape) {
                    case 'rectangle': shapeType = ShapeType.rect; break;
                    case 'circle': shapeType = ShapeType.ellipse; break;
                    case 'triangle': shapeType = ShapeType.triangle; break;
                    case 'arrow': shapeType = ShapeType.rightArrow; break;
                    case 'star': shapeType = ShapeType.star5; break;
                    case 'cloud': shapeType = ShapeType.cloud; break;
                    default: shapeType = ShapeType.rect;
                  }
                  
                  slide.addShape(shapeType, {
                    ...pptxPosition,
                    fill: { color: colors.accent },
                    line: { color: 'FFFFFF', width: 1 },
                  });
                }
                break;

              case 'icon':
                if (content.content.icon) {
                  // Draw a placeholder for icon
                  slide.addShape(ShapeType.rect, {
                    ...pptxPosition,
                    fill: { color: 'F5F5F5' },
                    line: { color: 'DDDDDD', width: 1 },
                  });
                  
                  slide.addText(content.content.icon, {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '36'),
                    align: 'center',
                    wrap: true,
                    valign: 'middle',
                    color: colors.accent,
                    bold: true,
                  });
                }
                break;

              case 'timeline':
                if (content.content.timelineEvents) {
                  // Create a better formatted representation of timeline events
                  const timelineText = content.content.timelineEvents
                    .map((event, index) => `${index + 1}. ${event.date}: ${event.event}`)
                    .join('\n\n');
                  
                  slide.addText(timelineText, {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '16'),
                    align: 'left',
                    wrap: true,
                    valign: 'top',
                    margin: 5,
                    lineSpacing: 1.3,
                    color: colors.text,
                  });
                }
                break;

              case 'process':
                if (content.content.processSteps) {
                  // Create a text representation of process steps with better spacing
                  const processText = content.content.processSteps
                    .map((step, index) => `${index+1}. ${step.title}: ${step.description}`)
                    .join('\n\n');
                  
                  slide.addText(processText, {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '16'),
                    align: 'left',
                    wrap: true,
                    valign: 'top',
                    margin: 5,
                    lineSpacing: 1.3,
                    color: colors.text,
                  });
                }
                break;

              case 'comparison':
                if (content.content.comparisonItems) {
                  // Create a two-column comparison text
                  const comparisonItem1 = content.content.comparisonItems[0];
                  const comparisonItem2 = content.content.comparisonItems.length > 1 ? 
                    content.content.comparisonItems[1] : null;
                  
                  if (comparisonItem1 && comparisonItem2) {
                    const leftX = pptxPosition.x;
                    const width = pptxPosition.w / 2;
                    
                    // Left side
                    slide.addText(comparisonItem1.title, {
                      x: leftX,
                      y: pptxPosition.y,
                      w: width,
                      h: 0.1,
                      fontSize: parseInt(style.fontSize || '18'),
                      align: 'center',
                      bold: true,
                      color: colors.text,
                    });
                    
                    const featuresText1 = comparisonItem1.features.map((f: string) => `• ${f}`).join('\n');
                    slide.addText(featuresText1, {
                      x: leftX,
                      y: pptxPosition.y + 0.1,
                      w: width,
                      h: pptxPosition.h - 0.1,
                      fontSize: parseInt(style.fontSize || '16'),
                      align: 'left',
                      wrap: true,
                      valign: 'top',
                      margin: 5,
                      lineSpacing: 1.2,
                      color: colors.text,
                    });
                    
                    // Right side
                    slide.addText(comparisonItem2.title, {
                      x: leftX + width,
                      y: pptxPosition.y,
                      w: width,
                      h: 0.1,
                      fontSize: parseInt(style.fontSize || '18'),
                      align: 'center',
                      bold: true,
                      color: colors.text,
                    });
                    
                    const featuresText2 = comparisonItem2.features.map((f: string) => `• ${f}`).join('\n');
                    slide.addText(featuresText2, {
                      x: leftX + width,
                      y: pptxPosition.y + 0.1,
                      w: width,
                      h: pptxPosition.h - 0.1,
                      fontSize: parseInt(style.fontSize || '16'),
                      align: 'left',
                      wrap: true,
                      valign: 'top',
                      margin: 5,
                      lineSpacing: 1.2,
                      color: colors.text,
                    });
                  }
                }
                break;
                
              default:
                // For unknown types, add placeholder
                slide.addText(`[Unknown content type: ${content.type}]`, {
                  ...pptxPosition,
                  fontSize: 14,
                  align: 'center',
                  valign: 'middle',
                  color: '999999',
                });
                break;
            }
          } catch (error) {
            console.warn(`Error rendering content item: ${content.type}`, error);
            
            // Add error placeholder for the content
            const pptxPosition = convertPosition({
              x: '10%',
              y: `${layoutConfig.startY * 100}%`,
              w: '80%',
              h: '10%',
            });
            
            slide.addText(`[Error rendering ${content.type}]`, {
              ...pptxPosition,
              fontSize: 14,
              align: 'center',
              valign: 'middle',
              color: 'FF0000',
            });
          }
        }
      } catch (pageError) {
        console.error(`Error processing slide with title: ${page.title || 'Untitled'}`, pageError);
        // Add an error slide
        const errorSlide = pptx.addSlide();
        errorSlide.addText(`Error creating slide: ${page.title || 'Untitled'}`, {
          x: 0.1,
          y: 0.4,
          w: 0.8,
          h: 0.2,
          fontSize: 24,
          color: 'FF0000',
          align: 'center',
          bold: true,
        });
      }
    }

    // Save the presentation
    await pptx.writeFile({ fileName: `${presentation.metadata.title}.pptx` });
  } catch (error: any) {
    console.error('Error generating presentation:', error);
    
    // Clear any existing slides to start fresh
    const slides = (pptx as any).getSlides();
    const slideCount = slides.length;
    for (let i = 0; i < slideCount; i++) {
      (pptx as any).removeSlide(0);
    }
    
    // Add a title slide with error information
    const errorSlide = pptx.addSlide();
    
    // Add a title with error message
    errorSlide.addText('Error Generating Presentation', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 1,
      align: 'center',
      fontSize: 44,
      color: '666666',
      bold: true
    });
    
    // Add error details
    errorSlide.addText(`An error occurred while generating your presentation:\n${error.message || 'Unknown error'}`, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 2,
      align: 'center',
      fontSize: 20,
      color: 'CC0000'
    });
    
    // Add instruction text
    errorSlide.addText('Please check your presentation data and try again. If this error persists, contact support.', {
      x: 0.5,
      y: 5,
      w: 9,
      h: 1,
      align: 'center',
      fontSize: 16,
      color: '333333'
    });
  }
  
  // Save the presentation to file
  await pptx.writeFile({ fileName: `${presentation.metadata.title || 'Presentation'}.pptx` });
};

// Helper function to add a component to a slide
function addComponentToSlide(
  slide: any, 
  component: PresentationComponent, 
  position: {x: number, y: number, w: number, h: number},
  overrideStyle?: any,
  colors?: {bg: string, text: string, accent: string}
) {
  const style = { ...component.style, ...overrideStyle };
  const alignment = (style.alignment as 'left' | 'center' | 'right') || 'left';
  const textColor = colors?.text || '333333';
  const ShapeType = pptxgen.ShapeType;
  
  switch (component.type) {
    case 'text':
      if (component.content.text) {
        slide.addText(component.content.text, {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: alignment,
          bold: style.fontWeight === 'bold',
          wrap: true,
          valign: 'top',
          margin: 5,
          color: textColor,
        });
      }
      break;

    case 'image':
      if (component.content.imageUrl) {
        try {
          slide.addImage({
            path: component.content.imageUrl,
            ...position,
            sizing: { type: 'contain', w: position.w, h: position.h },
          });
        } catch (error) {
          // If image loading fails, add a placeholder
          console.warn(`Failed to load component image: ${component.content.imageUrl}`, error);
          slide.addShape(ShapeType.rect, {
            ...position,
            fill: { color: 'F0F0F0' },
            line: { color: 'CCCCCC', width: 1 },
          });
          slide.addText('Image not available', {
            ...position,
            fontSize: 14,
            align: 'center',
            valign: 'middle',
            color: '999999',
          });
        }
        
        if (component.content.imageCaption) {
          const captionY = position.y + position.h;
          slide.addText(component.content.imageCaption, {
            x: position.x,
            y: captionY,
            w: position.w,
            h: 0.05,
            fontSize: 12,
            align: 'center',
            color: textColor,
            italic: true,
          });
        }
      }
      break;

    case 'table':
      if (component.content.tableData) {
        slide.addTable(component.content.tableData, {
          ...position,
          border: { pt: 1, color: '000000' },
          fontSize: parseInt(style.fontSize || '14'),
          color: textColor,
          align: alignment,
          rowH: 0.3, // Set consistent row height
          autoPage: true, // Auto paginate large tables
          colW: Array(component.content.tableData[0]?.length || 1).fill(position.w / (component.content.tableData[0]?.length || 1)),
        });
      }
      break;

    case 'chart':
      if (component.content.chartData) {
        const { labels, values, type } = component.content.chartData;
        const chartData = labels.map((label, index) => ({
          name: label,
          labels: [label],
          values: [values[index]],
        }));
        
        const chartTypeMap: Record<string, string> = {
          'bar': 'bar',
          'line': 'line',
          'pie': 'pie',
          'doughnut': 'doughnut',
          'radar': 'radar',
          'scatter': 'scatter',
          'bubble': 'bubble'
        };
        
        const pptxChartType = chartTypeMap[type] || 'bar';
        
        // Enhanced chart styling
        slide.addChart(pptxChartType as any, chartData, {
          ...position,
          chartColors: ['3F97F6', '8AC2FF', '96A5D9', '2E75B5', '5B9BD5', '6DAEDB'],
          border: { pt: 1, color: 'DDDDDD' },
          shadow: { type: 'outer', angle: 45, blur: 2, offset: 2, color: 'CCCCCC' },
          dataLabelColor: textColor,
          dataLabelFontSize: 10,
          legendPos: 'b', // Bottom legend position
          showTitle: true,
          title: component.content.chartData.type.charAt(0).toUpperCase() + component.content.chartData.type.slice(1) + ' Chart',
          chartColorsOpacity: 80,
        });
      }
      break;

    case 'list':
      if (component.content.listItems) {
        const listItems = component.content.listItems.map((item, index) => {
          const prefix = component.content.listType === 'numbered' 
            ? `${index + 1}. ` 
            : component.content.listType === 'check'
            ? '✓ '
            : '• ';
          return prefix + item;
        }).join('\n');

        slide.addText(listItems, {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: alignment,
          wrap: true,
          valign: 'top',
          margin: 5,
          lineSpacing: 1.2,
          color: textColor,
        });
      }
      break;

    case 'quote':
      if (component.content.quoteText) {
        // Add a decorative quote background
        slide.addShape(ShapeType.rect, {
          ...position,
          fill: { color: 'F5F5F5' },
          line: { color: 'DDDDDD', width: 1 },
          shadow: { type: 'outer', blur: 3, offset: 2, color: 'CCCCCC', angle: 45 }
        });
        
        const quoteY = position.y + 0.05; // Add some top padding
        const quoteH = position.h - 0.15; // Reduce height to make room for author
        
        slide.addText(`"${component.content.quoteText}"`, {
          x: position.x + 0.03,
          y: quoteY,
          w: position.w - 0.06,
          h: quoteH,
          fontSize: parseInt(style.fontSize || '20'),
          align: 'center',
          italic: true,
          valign: 'middle',
          margin: 10,
          wrap: true,
          color: textColor,
        });
        
        if (component.content.quoteAuthor) {
          const authorY = position.y + position.h - 0.08;
          slide.addText(`- ${component.content.quoteAuthor}`, {
            x: position.x,
            y: authorY,
            w: position.w,
            h: 0.08,
            fontSize: parseInt(style.fontSize || '16'),
            align: 'right',
            color: '666666',
            margin: [0, 10, 0, 0], // Right margin
          });
        }
      }
      break;

    case 'code':
      if (component.content.code) {
        slide.addText(component.content.code, {
          ...position,
          fontSize: parseInt(style.fontSize || '14'),
          align: alignment,
          fontFace: 'Courier New',
          wrap: true,
          valign: 'top',
          margin: 5,
          lineSpacing: 1.1,
          color: textColor,
        });
      }
      break;

    case 'timeline':
      if (component.content.timelineEvents) {
        // Create a better formatted representation of timeline events
        const timelineText = component.content.timelineEvents
          .map((event, index) => `${index + 1}. ${event.date}: ${event.event}`)
          .join('\n\n');
        
        slide.addText(timelineText, {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: 'left',
          wrap: true,
          valign: 'top',
          margin: 5,
          lineSpacing: 1.3,
          color: textColor,
        });
      }
      break;

    case 'process':
      if (component.content.processSteps) {
        // Create a text representation of process steps with better spacing
        const processText = component.content.processSteps
          .map((step, index) => `${index+1}. ${step.title}: ${step.description}`)
          .join('\n\n');
        
        slide.addText(processText, {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: 'left',
          wrap: true,
          valign: 'top',
          margin: 5,
          lineSpacing: 1.3,
          color: textColor,
        });
      }
      break;

    case 'comparison':
      if (component.content.comparisonItems) {
        // Create a two-column comparison text
        const comparisonItem1 = component.content.comparisonItems[0];
        const comparisonItem2 = component.content.comparisonItems.length > 1 ? 
          component.content.comparisonItems[1] : null;
        
        if (comparisonItem1 && comparisonItem2) {
          const leftX = position.x;
          const width = position.w / 2;
          
          // Left side
          slide.addText(comparisonItem1.title, {
            x: leftX,
            y: position.y,
            w: width,
            h: 0.1,
            fontSize: parseInt(style.fontSize || '18'),
            align: 'center',
            bold: true,
            color: textColor,
          });
          
          const featuresText1 = comparisonItem1.features.map((f: string) => `• ${f}`).join('\n');
          slide.addText(featuresText1, {
            x: leftX,
            y: position.y + 0.1,
            w: width,
            h: position.h - 0.1,
            fontSize: parseInt(style.fontSize || '16'),
            align: 'left',
            wrap: true,
            valign: 'top',
            margin: 5,
            lineSpacing: 1.2,
            color: textColor,
          });
          
          // Right side
          slide.addText(comparisonItem2.title, {
            x: leftX + width,
            y: position.y,
            w: width,
            h: 0.1,
            fontSize: parseInt(style.fontSize || '18'),
            align: 'center',
            bold: true,
            color: textColor,
          });
          
          const featuresText2 = comparisonItem2.features.map((f: string) => `• ${f}`).join('\n');
          slide.addText(featuresText2, {
            x: leftX + width,
            y: position.y + 0.1,
            w: width,
            h: position.h - 0.1,
            fontSize: parseInt(style.fontSize || '16'),
            align: 'left',
            wrap: true,
            valign: 'top',
            margin: 5,
            lineSpacing: 1.2,
            color: textColor,
          });
        }
      }
      break;

    // Handle other component types as needed
    default:
      // For unsupported types, add a placeholder text
      slide.addText(`[Component: ${component.id} - ${component.type}]`, {
        ...position,
        fontSize: 16,
        align: 'center',
        wrap: true,
        valign: 'middle',
        color: textColor,
      });
      break;
  }
}