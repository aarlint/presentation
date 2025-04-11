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

export const generatePresentation = async (data: { presentation: Presentation }): Promise<any> => {
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

        // Set slide title with improved styling and proper centering
        if (page.title) {
          slide.addText(page.title, {
            x: 0.5,          // Start at center of slide
            y: 0.5,          // Start at top of slide
            w: 9,           // Width in inches (standard slide is ~10 inches wide)
            h: 1,           // Height in inches
            fontSize: 28,
            bold: true,
            color: colors.text,
            align: 'center',  // Center text horizontally
            valign: 'middle', // Center text vertically
          });
        }

        // Add subtitle if present with improved styling and proper centering
        if (page.subtitle) {
          slide.addText(page.subtitle, {
            x: 0.5,          // Center of slide
            y: page.title ? 1.5 : 0.5, // Below title if present
            w: 9,           // Width in inches
            h: 0.6,          // Height in inches
            fontSize: 20,
            color: colors.text,
            align: 'center',  // Center text horizontally
            valign: 'middle', // Center text vertically
            italic: true,
          });
        }

        // Calculate layout positions based on slide size (standard PPT slide is 10x7.5 inches)
        const slideWidth = 10;  // 10 inches standard width
        const slideHeight = 7.5; // 7.5 inches standard height
        
        let layoutConfig = {
          startY: page.subtitle ? 2.2 : page.title ? 1.6 : 0.5, // Start below title/subtitle
          contentHeight: 5,    // Content height in inches
          contentWidth: 9,     // Content width in inches
          leftMargin: 0.5,     // Left margin in inches
          rightMargin: 0.5,    // Right margin in inches
          bottomMargin: 0.5,   // Bottom margin in inches
          spacing: 0.3,        // Space between elements in inches
        };

        // Handle different layout types with proper measurements
        switch (page.layout) {
          case 'grid':
            // Grid layout with fixed measurements
            layoutConfig = {
              startY: page.subtitle ? 2.2 : page.title ? 1.6 : 0.5,
              contentHeight: 5,
              contentWidth: 9,
              leftMargin: 0.5,
              rightMargin: 0.5,
              bottomMargin: 0.5,
              spacing: 0.2, // Grid spacing in inches
            };
            break;
          case 'component-grid':
            // Component-grid layout with fixed measurements
            layoutConfig = {
              startY: page.subtitle ? 2.2 : page.title ? 1.6 : 0.5,
              contentHeight: 5,
              contentWidth: 9,
              leftMargin: 0.5,
              rightMargin: 0.5,
              bottomMargin: 0.5,
              spacing: 0.3,
            };
            break;
          case 'two-column':
            // Two-column layout with fixed measurements
            layoutConfig = {
              startY: page.subtitle ? 2.2 : page.title ? 1.6 : 0.5,
              contentHeight: 5,
              contentWidth: 9,
              leftMargin: 0.5,
              rightMargin: 0.5,
              bottomMargin: 0.5, 
              spacing: 0.5, // Column spacing in inches
            };
            break;
          // Additional layout types can be implemented here
        }

        // Add content based on type
        for (const content of page.content) {
          try {
            const style = content.style || {};
            const alignment = (style.alignment as 'left' | 'center' | 'right') || 'left';

            // Calculate default position - centered on slide with appropriate measurements
            let position = {
              x: layoutConfig.leftMargin,  // Left margin in inches
              y: layoutConfig.startY,      // Start position in inches
              w: layoutConfig.contentWidth, // Width in inches
              h: layoutConfig.contentHeight, // Height in inches
            };

            // Adjust positions for different content types
            switch (content.type) {
              case 'text':
                position = {
                  x: layoutConfig.leftMargin,
                  y: layoutConfig.startY,
                  w: layoutConfig.contentWidth,
                  h: Math.min(3, layoutConfig.contentHeight), // Limit text height for better presentation
                };
                break;
              case 'image':
                position = {
                  x: (slideWidth - 6) / 2, // Center image horizontally (6 inches width)
                  y: layoutConfig.startY,
                  w: 6, // Fixed width in inches
                  h: 4, // Fixed height in inches
                };
                break;
              // Default positions for other types can be specified here
            }

            // Adjust positions for grid layouts with fixed measurements
            if (page.layout === 'grid' && page.gridConfig && content.content.gridArea) {
              const { columnStart, columnEnd, rowStart, rowEnd } = content.content.gridArea;
              const totalColumns = page.gridConfig.columns || 12;
              
              // Grid calculations using fixed dimensions in inches
              const availableWidth = layoutConfig.contentWidth;
              const colSpacing = layoutConfig.spacing / totalColumns;
              const effectiveColSpace = (availableWidth - (colSpacing * (totalColumns - 1))) / totalColumns;
              
              const x = layoutConfig.leftMargin + (columnStart - 1) * (effectiveColSpace + colSpacing);
              const w = (columnEnd - columnStart + 1) * effectiveColSpace + (columnEnd - columnStart) * colSpacing;
              
              // Row calculation with fixed dimensions
              const totalRows = Math.max(4, Math.ceil(page.content.length / totalColumns));
              const rowSpacing = layoutConfig.spacing / 4; // Smaller row spacing
              const effectiveRowHeight = (layoutConfig.contentHeight - (rowSpacing * (totalRows - 1))) / totalRows;
              
              const y = layoutConfig.startY + (rowStart - 1) * (effectiveRowHeight + rowSpacing);
              const h = (rowEnd - rowStart + 1) * effectiveRowHeight + (rowEnd - rowStart) * rowSpacing;
              
              position = { x, y, w, h };
            }
            
            // Adjust positions for component-grid layouts with fixed measurements
            if (page.layout === 'component-grid' && content.content.position) {
              const halfWidth = (layoutConfig.contentWidth - layoutConfig.spacing) / 2;
              
              switch(content.content.position) {
                case 'left':
                  position = { 
                    x: layoutConfig.leftMargin, 
                    y: layoutConfig.startY, 
                    w: halfWidth, 
                    h: layoutConfig.contentHeight 
                  };
                  break;
                case 'center':
                  position = { 
                    x: (slideWidth - layoutConfig.contentWidth) / 2, 
                    y: layoutConfig.startY, 
                    w: layoutConfig.contentWidth, 
                    h: layoutConfig.contentHeight 
                  };
                  break;
                case 'right':
                  position = { 
                    x: slideWidth - layoutConfig.rightMargin - halfWidth, 
                    y: layoutConfig.startY, 
                    w: halfWidth, 
                    h: layoutConfig.contentHeight 
                  };
                  break;
              }
            }

            // For two-column layout
            if (page.layout === 'two-column') {
              const contentIndex = page.content.indexOf(content);
              const isLeftColumn = contentIndex % 2 === 0;
              const halfWidth = (layoutConfig.contentWidth - layoutConfig.spacing) / 2;
              
              if (isLeftColumn) {
                position = { 
                  x: layoutConfig.leftMargin, 
                  y: layoutConfig.startY, 
                  w: halfWidth, 
                  h: layoutConfig.contentHeight 
                };
              } else {
                position = { 
                  x: layoutConfig.leftMargin + halfWidth + layoutConfig.spacing, 
                  y: layoutConfig.startY, 
                  w: halfWidth, 
                  h: layoutConfig.contentHeight 
                };
              }
            }

            // Convert from inch-based position to the expected format
            const pptxPosition = position;

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
                  // Improved text rendering with better position calculation
                  const textOptions: any = {
                    ...pptxPosition,
                    fontSize: parseInt(style.fontSize || '16'),
                    align: alignment,
                    bold: style.fontWeight === 'bold',
                    wrap: true,
                    valign: 'middle',
                    margin: [12, 15, 12, 15] as [number, number, number, number], // Increased margins
                    color: colors.text,
                    breakLine: true,
                    charSpacing: 0.5, // Slightly increase character spacing
                    lineSpacing: 1.5, // Significantly increase line spacing
                    paraSpaceBefore: 5, // More space before paragraphs
                    paraSpaceAfter: 5, // More space after paragraphs
                    indentLevel: 0 // No indentation by default
                  };
                  
                  // Adjust text position based on content length
                  if (content.content.text.length > 500) {
                    textOptions.valign = 'top';
                    textOptions.paraSpaceBefore = 8;
                    textOptions.paraSpaceAfter = 8;
                  }
                  
                  // Handle paragraphs better - replace single newlines with spaces, keep double newlines
                  let formattedText = content.content.text
                    .replace(/([^\n])\n([^\n])/g, '$1 $2')  // Replace single newlines with spaces
                    .replace(/\n\n/g, '\n \n');  // Keep double newlines with extra spacing
                  
                  slide.addText(formattedText, textOptions);
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

              case 'list':
                if (content.content.listItems) {
                  // Create slide bullets instead of formatting the text manually
                  if (content.content.listItems.length > 0) {
                    // Create a placeholder for the list with proper padding
                    slide.addText('', {
                      ...pptxPosition,
                      h: 0.01, // Very small height placeholder
                    });
                    
                    // Add each list item as a separate text object with bullet formatting
                    content.content.listItems.forEach((item, idx) => {
                      slide.addText(item, {
                        x: pptxPosition.x + 0.2, // Indent for bullet
                        y: pptxPosition.y + (idx * 0.4), // Space items vertically
                        w: pptxPosition.w - 0.4,
                        h: 0.35,
                        fontSize: parseInt(style.fontSize || '16'),
                        bullet: true,
                        align: alignment,
                        color: colors.text,
                        valign: 'middle',
                        margin: [5, 5, 5, 10] as [number, number, number, number],
                        paraSpaceBefore: 5,
                        paraSpaceAfter: 5,
                        charSpacing: 0.3,
                        lineSpacing: 1.3,
                      });
                    });
                  }
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
                  
                  // Better positioning for quote text with increased padding
                  const quoteY = pptxPosition.y + 0.08; // Further increased top padding
                  const quoteH = pptxPosition.h - 0.22; // Better height adjustment for author
                  
                  // Format the quote text for better readability
                  let formattedQuoteText = content.content.quoteText
                    .replace(/([^\n])\n([^\n])/g, '$1 $2')  // Replace single newlines with spaces
                    .replace(/\n\n/g, '\n \n');  // Keep double newlines with extra spacing
                  
                  slide.addText(`"${formattedQuoteText}"`, {
                    x: pptxPosition.x + 0.08, // Increased left padding
                    y: quoteY,
                    w: pptxPosition.w - 0.16, // Increased horizontal padding
                    h: quoteH,
                    fontSize: parseInt(style.fontSize || '20'),
                    align: 'center',
                    italic: true,
                    valign: 'middle',
                    margin: [20, 20, 20, 20] as [number, number, number, number], // Better margins for quote
                    wrap: true,
                    color: '333333',
                    lineSpacing: 1.8, // Better line spacing for quotes
                    charSpacing: 0.5, // Add character spacing
                  });
                  
                  if (content.content.quoteAuthor) {
                    const authorY = pptxPosition.y + pptxPosition.h - 0.12; // Better author positioning
                    slide.addText(`- ${content.content.quoteAuthor}`, {
                      x: pptxPosition.x + 0.08, // Align with quote content
                      y: authorY,
                      w: pptxPosition.w - 0.16, // Match width with quote content
                      h: 0.1,
                      fontSize: parseInt(style.fontSize || '16'),
                      align: 'right',
                      color: '666666',
                      margin: [0, 25, 0, 0] as [number, number, number, number], // Right margin
                    });
                  }
                }
                break;

              case 'code':
                if (content.content.code) {
                  // Add a background for code with border and better padding
                  slide.addShape(ShapeType.rect, {
                    ...pptxPosition,
                    fill: { color: 'F8F8F8' },
                    line: { color: 'E0E0E0', width: 1 },
                  });
                  
                  // Better code text placement with improved padding and mono font
                  slide.addText(content.content.code, {
                    x: pptxPosition.x + 0.05, // Further increased padding
                    y: pptxPosition.y + 0.05, // Further increased padding
                    w: pptxPosition.w - 0.1, // Further increased padding
                    h: pptxPosition.h - 0.1, // Further increased padding
                    fontSize: parseInt(style.fontSize || '14'),
                    align: 'left', // Code is always left-aligned
                    fontFace: 'Courier New',
                    wrap: true,
                    valign: 'top',
                    margin: [12, 12, 12, 12] as [number, number, number, number], // Better margins for code
                    lineSpacing: 1.4, // Increased line spacing for code readability
                    charSpacing: 0.4, // Add some character spacing for code readability
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
            const pptxPosition = {
              x: layoutConfig.leftMargin,
              y: layoutConfig.startY,
              w: layoutConfig.contentWidth,
              h: 1 // 1 inch height for error message
            };
            
            slide.addText(`[Error rendering ${content.type}]`, {
              ...pptxPosition,
              fontSize: 14,
              align: 'center',
              valign: 'middle',
              color: 'FF0000',
            });
          }
        }
      } catch (error) {
        console.warn(`Error rendering slide: ${page.layout}`, error);
      }
    }
  } catch (error) {
    console.warn('Error generating presentation', error);
    throw error; // Rethrow error so the UI can handle it
  }
  
  // Save the presentation to file - fix the download issue
  // In browser context, pptxgenjs has a different API for file downloads
  return new Promise<Blob>((resolve, reject) => {
    // @ts-ignore - TypeScript definitions might not match the actual browser API
    pptx.write('blob').then((blob: Blob) => {
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `${presentation.metadata.title || 'Presentation'}.pptx`;
      
      // Append to body, click and remove to trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      resolve(blob);
    }).catch((error: any) => {
      console.error('Error writing presentation file:', error);
      reject(error);
    });
  });
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
        // Improved component text rendering
        const textOptions: any = {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: alignment,
          bold: style.fontWeight === 'bold',
          wrap: true,
          valign: 'middle',
          margin: [12, 15, 12, 15] as [number, number, number, number], // Increased margins
          color: textColor,
          breakLine: true,
          charSpacing: 0.5, // Slightly increase character spacing
          lineSpacing: 1.5, // Significantly increase line spacing
          paraSpaceBefore: 5, // More space before paragraphs
          paraSpaceAfter: 5, // More space after paragraphs
          indentLevel: 0 // No indentation by default
        };
        
        // Adjust text position based on content length
        if (component.content.text.length > 500) {
          textOptions.valign = 'top';
          textOptions.paraSpaceBefore = 8;
          textOptions.paraSpaceAfter = 8;
        }
        
        // Handle paragraphs better - replace single newlines with spaces, keep double newlines
        let formattedText = component.content.text
          .replace(/([^\n])\n([^\n])/g, '$1 $2')  // Replace single newlines with spaces
          .replace(/\n\n/g, '\n \n');  // Keep double newlines with extra spacing
        
        slide.addText(formattedText, textOptions);
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

    case 'list':
      if (component.content.listItems) {
        const listItems = component.content.listItems.map((item, index) => {
          const prefix = component.content.listType === 'numbered' 
            ? `${index + 1}. ` 
            : component.content.listType === 'check'
            ? '✓ '
            : '• ';
          return prefix + item;
        }).join('\n\n'); // Double newline for better spacing between items

        slide.addText(listItems, {
          ...position,
          fontSize: parseInt(style.fontSize || '16'),
          align: alignment,
          wrap: true,
          valign: 'top',
          margin: [15, 20, 15, 20] as [number, number, number, number], // Further increased margins for lists
          lineSpacing: 1.6, // Better line spacing for list readability
          color: textColor,
          paraSpaceBefore: 8, // More space before paragraphs
          paraSpaceAfter: 8, // More space after paragraphs
          indentLevel: 1, // Add indentation for better list appearance
          bullet: { type: component.content.listType === 'bullet' ? 'bullet' : 'number' }
        });
      }
      break;

    // Add other component type handlers here
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