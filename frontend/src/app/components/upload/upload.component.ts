import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  @Output() analysisComplete = new EventEmitter<any>();

  selectedFile: File | null = null;
  jobDescription: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  fileName: string = 'Click to upload or drag & drop';
  hasFile: boolean = false;

  constructor(private resumeService: ResumeService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = '✅ ' + this.selectedFile.name;
      this.hasFile = true;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files[0]) {
      this.selectedFile = event.dataTransfer.files[0];
      this.fileName = '✅ ' + this.selectedFile.name;
      this.hasFile = true;
    }
  }

  analyze(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please upload a resume.';
      return;
    }
    if (!this.jobDescription.trim()) {
      this.errorMessage = 'Please enter a job description.';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;

    this.resumeService.analyzeResume(this.selectedFile, this.jobDescription)
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          this.analysisComplete.emit(result);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Analysis failed. Try again.';
        }
      });
  }
}