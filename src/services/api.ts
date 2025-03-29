import { v4 as uuidv4 } from 'uuid';
import { storageService } from './storage.service';
import { powerPointService } from './powerpoint.service';

export interface PresentationResponse {
  id: string;
  title: string;
  createdAt: string;
  downloadUrl: string;
}

/**
 * Upload YAML content to generate a PowerPoint presentation
 * @param yamlContent The YAML content to upload
 * @returns Promise with the presentation data
 */
export const uploadYaml = async (yamlContent: string): Promise<PresentationResponse> => {
  try {
    // Generate a unique ID
    const id = uuidv4();
    
    // Extract title from YAML
    const title = powerPointService.extractTitle(yamlContent);
    
    // Generate PowerPoint
    const pptxBlob = await powerPointService.generatePowerPoint(yamlContent);
    
    // Create presentation metadata
    const presentation = {
      id,
      title,
      createdAt: new Date(),
      yamlContent
    };
    
    // Store in local storage
    storageService.addPresentation(presentation);
    
    // Store the PowerPoint blob
    await storageService.storePresentation(id, pptxBlob);
    
    // Create a temporary URL for the blob
    const downloadUrl = URL.createObjectURL(pptxBlob);
    
    return {
      id: presentation.id,
      title: presentation.title,
      createdAt: presentation.createdAt.toISOString(),
      downloadUrl
    };
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('Failed to generate presentation');
  }
};

/**
 * Upload a YAML file to generate a PowerPoint presentation
 * @param file The YAML file to upload
 * @returns Promise with the presentation data
 */
export const uploadYamlFile = async (file: File): Promise<PresentationResponse> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const response = await uploadYaml(content);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get all presentations
 * @returns Promise with an array of presentations
 */
export const getPresentations = async (): Promise<PresentationResponse[]> => {
  const presentations = storageService.getPresentations();
  
  return presentations.map(p => ({
    id: p.id,
    title: p.title,
    createdAt: p.createdAt.toISOString(),
    downloadUrl: `#/presentations/${p.id}/download` // This is a placeholder
  }));
};

/**
 * Get a presentation by ID
 * @param id The presentation ID
 * @returns Promise with the presentation data
 */
export const getPresentation = async (id: string): Promise<PresentationResponse> => {
  const presentation = storageService.getPresentation(id);
  
  if (!presentation) {
    throw new Error('Presentation not found');
  }
  
  return {
    id: presentation.id,
    title: presentation.title,
    createdAt: presentation.createdAt.toISOString(),
    downloadUrl: `#/presentations/${presentation.id}/download` // This is a placeholder
  };
};

/**
 * Delete a presentation
 * @param id The presentation ID
 * @returns Promise with the deletion result
 */
export const deletePresentation = async (id: string): Promise<{ message: string }> => {
  const success = storageService.deletePresentation(id);
  
  if (!success) {
    throw new Error('Presentation not found');
  }
  
  // Also remove from sessionStorage if exists
  sessionStorage.removeItem(`pptx-${id}`);
  
  return { message: 'Presentation deleted successfully' };
};

/**
 * Get the download URL for a presentation
 * @param id The presentation ID
 * @returns The download URL
 */
export const getDownloadUrl = (id: string): string => {
  return `#/presentations/${id}/download`; // This is a placeholder
};

/**
 * Download a presentation
 * @param id The presentation ID
 */
export const downloadPresentation = async (id: string): Promise<void> => {
  const presentation = storageService.getPresentation(id);
  
  if (!presentation) {
    throw new Error('Presentation not found');
  }
  
  try {
    // Try to get the stored blob first
    let pptxBlob = await storageService.getPresentationBlob(id);
    
    // If not found, regenerate it
    if (!pptxBlob) {
      pptxBlob = await powerPointService.generatePowerPoint(presentation.yamlContent);
      // Store for future use
      await storageService.storePresentation(id, pptxBlob);
    }
    
    // Create a download link
    const url = URL.createObjectURL(pptxBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${presentation.title}.pptx`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading presentation:', error);
    throw new Error('Failed to download presentation');
  }
};