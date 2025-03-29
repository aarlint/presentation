import pptxgen from 'pptxgenjs';

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
  color?: string;
  icon?: string;
}

export interface PresentationContent {
  type: 'text' | 'image' | 'table' | 'chart' | 'list' | 'quote' | 'code' | 'video' | 'shape' | 'icon' | 'timeline' | 'process' | 'comparison';
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
    color?: string;
    backgroundColor?: string;
    alignment?: string;
    padding?: string;
    margin?: string;
  };
}

export interface PresentationPage {
  title?: string;
  subtitle?: string;
  layout: 'title' | 'content' | 'section' | 'two-column' | 'comparison' | 'timeline' | 'grid' | 'quote' | 'image-focus' | 'process';
  section?: string;
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
  };
  animation?: {
    type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
    duration?: number;
  };
  content: PresentationContent[];
}

export interface Presentation {
  metadata: PresentationMetadata;
  sections?: PresentationSection[];
  pages: PresentationPage[];
}

export const generatePresentation = async (data: { presentation: Presentation }): Promise<void> => {
  const pptx = new pptxgen();
  const { presentation } = data;

  // Set presentation metadata
  pptx.author = presentation.metadata.author;
  pptx.title = presentation.metadata.title;
  if (presentation.metadata.company) {
    pptx.company = presentation.metadata.company;
  }

  // Generate slides
  for (const page of presentation.pages) {
    const slide = pptx.addSlide();

    // Set slide background
    if (page.background) {
      if (page.background.color) {
        slide.background = { color: page.background.color.replace('#', '') };
      } else if (page.background.gradient) {
        // Note: pptxgenjs has limited gradient support
        slide.background = { color: 'FFFFFF' };
      } else if (page.background.image) {
        slide.background = { path: page.background.image };
      }
    }

    // Set slide title
    if (page.title) {
      slide.addText(page.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '15%',
        fontSize: 24,
        bold: true,
        color: page.background?.gradient || page.background?.color ? 'FFFFFF' : '000000',
      });
    }

    // Add subtitle if present
    if (page.subtitle) {
      slide.addText(page.subtitle, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '10%',
        fontSize: 18,
        color: page.background?.gradient || page.background?.color ? 'FFFFFF' : '666666',
      });
    }

    // Add content based on type
    for (const content of page.content) {
      const style = content.style || {};
      const textColor = page.background?.gradient || page.background?.color ? 'FFFFFF' : '000000';
      const alignment = (style.alignment as 'left' | 'center' | 'right') || 'left';

      switch (content.type) {
        case 'text':
          if (content.content.text) {
            slide.addText(content.content.text, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: alignment,
              bold: style.fontWeight === 'bold',
            });
          }
          break;

        case 'image':
          if (content.content.imageUrl) {
            slide.addImage({
              path: content.content.imageUrl,
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
            });
            if (content.content.imageCaption) {
              slide.addText(content.content.imageCaption, {
                x: '5%',
                y: '90%',
                w: '90%',
                h: '10%',
                fontSize: 12,
                color: textColor,
                align: 'center' as const,
              });
            }
          }
          break;

        case 'table':
          if (content.content.tableData) {
            slide.addTable(content.content.tableData, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              border: { pt: 1, color: textColor },
              fontSize: parseInt(style.fontSize || '12'),
              color: style.color || textColor,
              align: alignment,
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
            slide.addChart(pptxChartType as any, chartData);
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
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: alignment,
            });
          }
          break;

        case 'quote':
          if (content.content.quoteText) {
            slide.addText(`"${content.content.quoteText}"`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '50%',
              fontSize: parseInt(style.fontSize || '20'),
              color: style.color || textColor,
              align: 'center' as const,
              italic: true,
            });
            if (content.content.quoteAuthor) {
              slide.addText(`- ${content.content.quoteAuthor}`, {
                x: '5%',
                y: '80%',
                w: '90%',
                h: '10%',
                fontSize: parseInt(style.fontSize || '16'),
                color: style.color || textColor,
                align: 'right' as const,
              });
            }
          }
          break;

        case 'code':
          if (content.content.code) {
            slide.addText(content.content.code, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '14'),
              color: style.color || textColor,
              align: alignment,
              fontFace: 'Courier New',
            });
          }
          break;

        // Note: video, shape, icon, timeline, process, and comparison types
        // are not directly supported by pptxgenjs, so we'll add placeholder text
        case 'video':
          if (content.content.videoUrl) {
            slide.addText(`[Video: ${content.content.videoType} - ${content.content.videoUrl}]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;

        case 'shape':
          if (content.content.shape) {
            slide.addText(`[Shape: ${content.content.shape}]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;

        case 'icon':
          if (content.content.icon) {
            slide.addText(`[Icon: ${content.content.icon}]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;

        case 'timeline':
          if (content.content.timelineEvents) {
            slide.addText(`[Timeline with ${content.content.timelineEvents.length} events]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;

        case 'process':
          if (content.content.processSteps) {
            slide.addText(`[Process with ${content.content.processSteps.length} steps]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;

        case 'comparison':
          if (content.content.comparisonItems) {
            slide.addText(`[Comparison with ${content.content.comparisonItems.length} items]`, {
              x: '5%',
              y: '30%',
              w: '90%',
              h: '60%',
              fontSize: parseInt(style.fontSize || '16'),
              color: style.color || textColor,
              align: 'center' as const,
            });
          }
          break;
      }
    }
  }

  // Save the presentation
  await pptx.writeFile({ fileName: `${presentation.metadata.title}.pptx` });
}; 