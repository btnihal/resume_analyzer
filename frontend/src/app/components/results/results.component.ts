import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  @Input() result: any = null;

  getVerdictColor(): string {
    const colors: any = {
      'Strong Match': '#4ade80',
      'Good Match': '#a78bfa',
      'Partial Match': '#fb923c',
      'Weak Match': '#f87171'
    };
    return colors[this.result?.verdict] || '#888';
  }

  getScoreGradient(): string {
    return `conic-gradient(#a78bfa ${this.result?.ats_score}%, #2a2a4a 0)`;
  }
}