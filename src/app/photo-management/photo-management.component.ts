import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.scss'
})
export class PhotoManagementComponent {
  selectedFile: File | null = null;
  photoName: string = '';
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;
  uploadError: string | null = null;
  uploading: boolean = false;

  constructor(private photoService: PhotoService) { }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.uploadProgress = null;
      this.uploadError = null;
      this.uploadMessage = null;
    } else {
      this.selectedFile = null;
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file first.';
      return;
    }
    if (!this.photoName.trim()) {
      this.uploadError = 'Please provide a name for the photo.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.uploadMessage = null;

    this.photoService.uploadPhoto(this.selectedFile, this.photoName.trim()).subscribe({
      next: (progressOrUrl) => {
        if (typeof progressOrUrl === 'number') {
          this.uploadProgress = progressOrUrl;
        } else if (typeof progressOrUrl === 'string') {
          // This case might not be hit if the observable completes after emitting the URL
          // Handled in complete for now
        }
      },
      error: (err) => {
        console.error(err);
        this.uploadError = 'Upload failed. See console for details.';
        this.uploadProgress = null;
        this.uploading = false;
      },
      complete: () => {
        // Assuming the last emission before complete (if it was a URL) means success
        // The service currently emits the URL then completes.
        this.uploadMessage = 'Upload and metadata save successful!';
        this.uploadProgress = 100; // Show full bar on completion
        this.selectedFile = null;
        this.photoName = '';
        this.uploading = false;
        // Keep uploadMessage for a bit, then clear?
        // setTimeout(() => this.uploadMessage = null, 5000);
      }
    });
  }
}
