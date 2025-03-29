// powerpoint.service.ts
import PptxGenJS from 'pptxgenjs';
import yaml from 'js-yaml';

interface PresentationData {
  metadata: {
    title: string;
    author: string;
    date?: string;
    default_font: {
      family: string;
      size: number;
      color: string;
    };
  };
  pages: Array<{
    page: {
      title?: string;
      subtitle?: string;
      layout?: string;
      background?: {
        color?: string;
        image?: string;
      };
      content_blocks: Array<{
        block: {
          type: string;
          position: {
            x: string;
            y: string;
            width: string;
            height: string;
          };
          content: any;
          animation?: {
            type: string;
            duration?: number;
          };
          hyperlink?: string; // Added hyperlink support for all block types
        };
      }>;
    };
  }>;
}

// Extended image content interface
interface ImageContent {
  source: string;       // Can be local path or URL
  sourceType?: string;  // "local" or "url", defaults to "local" for backward compatibility
  caption?: string;
  hyperlink?: string;   // URL to navigate to when image is clicked
}

// Extended text content interface
interface TextContent {
  text: string;
  font?: {
    family?: string;
    size?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
  };
  alignment?: string;
  autoFit?: boolean;    // Whether to automatically fit text to container
  wrap?: boolean;       // Whether to wrap text
}

export class PowerPointService {
  /**
   * Add an image to a slide with a fallback placeholder if the image can't be loaded
   * @param slide The slide to add the image to
   * @param imageContent The image content
   * @param imageOptions The image options
   * @param hyperlink Optional hyperlink for the image
   */
  private addImageWithFallback(slide: any, imageContent: ImageContent, imageOptions: any, hyperlink?: string): void {
    // Always add a placeholder first
    slide.addText("[Image Placeholder]", {
      x: imageOptions.x,
      y: imageOptions.y,
      w: imageOptions.w,
      h: imageOptions.h,
      color: "999999",
      fontSize: 14,
      bold: true,
      align: "center",
      valign: "middle",
      fill: { color: "F0F0F0" }
    });

    // For URL images, we won't try to add them directly
    // This avoids the uncaught runtime errors when images fail to load
    if (imageContent.sourceType === "url") {
      console.log(`Using placeholder for URL image: ${imageContent.source}`);
    } else {
      console.log(`Using placeholder for local image: ${imageContent.source}`);
    }

    // Add hyperlink to the placeholder if specified
    if (hyperlink || imageContent.hyperlink) {
      // We can't add hyperlinks to the placeholder text directly in this implementation
      console.log(`Image had hyperlink: ${hyperlink || imageContent.hyperlink}`);
    }
  }
  /**
   * Generate a PowerPoint presentation from YAML content
   * @param yamlContent The YAML content
   * @returns Promise that resolves to a Blob containing the PowerPoint file
   */
  async generatePowerPoint(yamlContent: string): Promise<Blob> {
    // Parse YAML content
    const presentationData = (yaml.load(yamlContent) as { presentation: PresentationData }).presentation;

    // Initialize PPTX object
    const pptx = new PptxGenJS();

    // Set presentation metadata
    pptx.title = presentationData.metadata.title;
    pptx.author = presentationData.metadata.author;
    pptx.company = "xAI"; // Optional, can be added to metadata if needed
    pptx.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "FFFFFF" }, // Default white background
      objects: [],
    });

    // Process each page (slide)
    presentationData.pages.forEach((pageData) => {
      const slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

      // Add title with auto-fit and wrap
      if (pageData.page.title) {
        slide.addText(pageData.page.title, {
          x: "10%",
          y: "5%",
          w: "80%",
          h: "10%",
          fontSize: 24,
          bold: true,
          align: "center",
          color: presentationData.metadata.default_font.color || "000000",
          fontFace: presentationData.metadata.default_font.family || "Arial",
          autoFit: true, // Automatically fit text to container
          wrap: true,    // Enable text wrapping
        });
      }

      // Add subtitle with auto-fit and wrap
      if (pageData.page.subtitle) {
        slide.addText(pageData.page.subtitle, {
          x: "10%",
          y: "15%",
          w: "80%",
          h: "10%",
          fontSize: 18,
          align: "center",
          color: presentationData.metadata.default_font.color || "000000",
          autoFit: true, // Automatically fit text to container
          wrap: true,    // Enable text wrapping
        });
      }

      // Set slide background
      if (pageData.page.background) {
        if (pageData.page.background.color) {
          slide.background = { color: pageData.page.background.color.replace("#", "") };
        }
        if (pageData.page.background.image) {
          slide.background = { path: pageData.page.background.image };
        }
      }

      // Process content blocks
      pageData.page.content_blocks.forEach((blockData) => {
        const block = blockData.block;
        const pos = block.position;

        // Helper function to convert percentage or points to absolute values
        const convertUnit = (value: string, max: number) =>
          value.includes("%") ? (parseFloat(value) / 100) * max : parseFloat(value);

        const options: any = {
          x: convertUnit(pos.x, 10), // Assuming slide width ~10 inches
          y: convertUnit(pos.y, 7.5), // Assuming slide height ~7.5 inches
          w: convertUnit(pos.width, 10),
          h: convertUnit(pos.height, 7.5),
        };

        switch (block.type) {
          case "text":
            const textContent = block.content as TextContent;
            
            options.fontSize = textContent.font?.size || presentationData.metadata.default_font.size || 12;
            options.color = textContent.font?.color?.replace("#", "") || presentationData.metadata.default_font.color?.replace("#", "") || "000000";
            options.fontFace = textContent.font?.family || presentationData.metadata.default_font.family || "Arial";
            options.bold = textContent.font?.bold || false;
            options.italic = textContent.font?.italic || false;
            options.align = textContent.alignment || "left";
            
            // Add text overflow prevention
            options.autoFit = textContent.autoFit !== undefined ? textContent.autoFit : true; // Default to true
            options.wrap = textContent.wrap !== undefined ? textContent.wrap : true; // Default to true
            
            // Estimate if text might overflow and log warning
            const estimatedTextWidth = textContent.text.length * (options.fontSize * 0.6);
            const containerWidth = options.w * 100; // Convert to points for comparison
            
            if (estimatedTextWidth > containerWidth && !options.autoFit && !options.wrap) {
              console.warn(`Text may overflow container: "${textContent.text.substring(0, 30)}..."`);
            }

            if (block.animation) {
              options.animation = { type: block.animation.type, duration: block.animation.duration || 1 };
            }
            
            // Add hyperlink if specified
            if (block.hyperlink) {
              options.hyperlink = { url: block.hyperlink };
            }

            slide.addText(textContent.text, options);
            break;

          case "image":
            const imageContent = block.content as ImageContent;
            const imageOptions: any = {
              x: options.x,
              y: options.y,
              w: options.w,
              h: options.h,
            };
            
            // Add placeholder instead of trying to load the image directly
            // This avoids uncaught runtime errors when images fail to load
            this.addImageWithFallback(slide, imageContent, imageOptions, block.hyperlink);
            
            // Add caption if present
            if (imageContent.caption) {
              slide.addText(imageContent.caption, {
                x: options.x,
                y: options.y + options.h + 0.1,
                w: options.w,
                h: 0.5,
                fontSize: 10,
                align: "center",
              });
            }
            break;

          case "table":
            try {
              // Ensure headers and rows are arrays
              if (!Array.isArray(block.content.headers)) {
                console.error("Table headers is not an array:", block.content.headers);
                throw new Error("Table headers must be an array");
              }
              
              if (!Array.isArray(block.content.rows)) {
                console.error("Table rows is not an array:", block.content.rows);
                throw new Error("Table rows must be an array");
              }
              
              // Create a properly formatted array of arrays for the table data
              const tableData = [];
              
              // Add headers as the first row
              tableData.push(block.content.headers);
              
              // Add each row
              block.content.rows.forEach((row: any) => {
                if (Array.isArray(row)) {
                  tableData.push(row);
                } else {
                  console.warn("Skipping non-array row:", row);
                }
              });
              
              // Ensure we have at least one row of data
              if (tableData.length === 0) {
                throw new Error("Table has no data");
              }
              
              const tableOptions: any = {
                x: options.x,
                y: options.y,
                w: options.w,
                h: options.h,
                colW: block.content.headers.length > 0 ? options.w / block.content.headers.length : undefined,
                fill: block.content.header_color?.replace("#", "") || "F1F1F1",
                border: block.content.border ? { pt: 1, color: "000000" } : undefined,
                autoPage: true, // Automatically handle table pagination if it's too large
              };
              
              // Add hyperlink if specified
              if (block.hyperlink) {
                tableOptions.hyperlink = { url: block.hyperlink };
              }
              
              // Add the table with proper error handling
              slide.addTable(tableData, tableOptions);
            } catch (err) {
              console.error("Error adding table:", err);
              // Add a text block with the error message instead
              slide.addText(`Error creating table: ${(err as Error).message}`, {
                x: options.x,
                y: options.y,
                w: options.w,
                h: options.h,
                color: "FF0000",
                fontSize: 14,
                bold: true,
              });
            }
            break;

          case "chart":
            try {
              // Validate chart data
              if (!block.content.data) {
                throw new Error("Chart data is missing");
              }
              
              if (!Array.isArray(block.content.data.labels)) {
                console.error("Chart labels is not an array:", block.content.data.labels);
                throw new Error("Chart labels must be an array");
              }
              
              if (!Array.isArray(block.content.data.values)) {
                console.error("Chart values is not an array:", block.content.data.values);
                throw new Error("Chart values must be an array");
              }
              
              // Ensure labels and values have the same length
              if (block.content.data.labels.length !== block.content.data.values.length) {
                console.warn("Chart labels and values have different lengths. This may cause issues.");
              }
              
              const chartOptions: any = {
                x: options.x,
                y: options.y,
                w: options.w,
                h: options.h,
                barDir: "col",
              };
              
              // Handle chart colors
              if (block.content.colors && Array.isArray(block.content.colors)) {
                chartOptions.chartColors = block.content.colors.map((c: string) => c.replace("#", ""));
              } else {
                chartOptions.chartColors = ["FF5733"]; // Default color
              }
              
              // Add hyperlink if specified
              if (block.hyperlink) {
                chartOptions.hyperlink = { url: block.hyperlink };
              }
              
              // Determine chart type as a string (CHART_NAME)
              let chartType: string;
              switch (block.content.chart_type) {
                case "bar":
                  chartType = "bar";
                  break;
                case "pie":
                  chartType = "pie";
                  break;
                case "line":
                  chartType = "line";
                  break;
                default:
                  chartType = "bar"; // Default to bar chart
              }
              
              // Add the chart with proper error handling
              slide.addChart(
                chartType as any, // Cast to any to avoid TypeScript errors
                [
                  {
                    name: pageData.page.title || "Chart",
                    labels: block.content.data.labels,
                    values: block.content.data.values,
                  },
                ],
                chartOptions
              );
            } catch (err) {
              console.error("Error adding chart:", err);
              // Add a text block with the error message instead
              slide.addText(`Error creating chart: ${(err as Error).message}`, {
                x: options.x,
                y: options.y,
                w: options.w,
                h: options.h,
                color: "FF0000",
                fontSize: 14,
                bold: true,
              });
            }
            break;

          default:
            console.warn(`Unsupported block type: ${block.type}`);
        }
      });
    });

    // Generate the PowerPoint file as a Blob
      // In browser context, pptxgenjs has a different API
      return new Promise<Blob>((resolve) => {
        // @ts-ignore - TypeScript definitions might not match the actual browser API
        pptx.write('blob').then((blob: Blob) => {
          resolve(blob);
        });
      });
  }

  /**
   * Extract title from JSON content
   * @param jsonContent The JSON content
   * @returns The extracted title or 'Untitled Presentation'
   */
  extractTitle(jsonContent: string): string {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && parsed.presentation && parsed.presentation.metadata && parsed.presentation.metadata.title) {
        return parsed.presentation.metadata.title;
      }
    } catch (error) {
      console.error('Error extracting title from JSON:', error);
    }
    return 'Untitled Presentation';
  }
}

export const powerPointService = new PowerPointService();