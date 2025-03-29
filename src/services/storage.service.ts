// storage.service.ts
interface PresentationMeta {
  id: string;
  title: string;
  createdAt: Date;
  yamlContent: string;
  pptxBlob?: Blob;
}

class StorageService {
  private readonly STORAGE_KEY = 'powerpoint-presentations';
  
  // Get all presentations from localStorage
  getPresentations(): PresentationMeta[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) return [];
    
    try {
      return JSON.parse(storedData, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing presentations from storage:', error);
      return [];
    }
  }
  
  // Save presentations to localStorage
  savePresentations(presentations: PresentationMeta[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presentations));
  }
  
  // Add a new presentation
  addPresentation(presentation: PresentationMeta): void {
    const presentations = this.getPresentations();
    presentations.push(presentation);
    this.savePresentations(presentations);
  }
  
  // Get a presentation by ID
  getPresentation(id: string): PresentationMeta | undefined {
    const presentations = this.getPresentations();
    return presentations.find(p => p.id === id);
  }
  
  // Delete a presentation by ID
  deletePresentation(id: string): boolean {
    const presentations = this.getPresentations();
    const index = presentations.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    presentations.splice(index, 1);
    this.savePresentations(presentations);
    return true;
  }
  
  // Store a PowerPoint blob
  async storePresentation(id: string, pptxBlob: Blob): Promise<void> {
    // For larger files, we could use IndexedDB instead of localStorage
    // This is a simplified implementation using localStorage and base64 encoding
    const presentations = this.getPresentations();
    const index = presentations.findIndex(p => p.id === id);
    
    if (index === -1) return;
    
    // Convert blob to base64 string
    const base64 = await this.blobToBase64(pptxBlob);
    
    // Store the base64 string in sessionStorage (not localStorage due to size limits)
    sessionStorage.setItem(`pptx-${id}`, base64);
  }
  
  // Get a PowerPoint blob
  async getPresentationBlob(id: string): Promise<Blob | null> {
    const base64 = sessionStorage.getItem(`pptx-${id}`);
    if (!base64) return null;
    
    return this.base64ToBlob(base64, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  }
  
  // Helper: Convert Blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  // Helper: Convert base64 to Blob
  private base64ToBlob(base64: string, type: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type });
  }
}

export const storageService = new StorageService();