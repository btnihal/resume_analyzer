import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './components/upload/upload.component';
import { ResultsComponent } from './components/results/results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UploadComponent, ResultsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  analysisResult: any = null;

  onAnalysisComplete(result: any): void {
    this.analysisResult = result;
  }
}