import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'https://resume-analyzer-k2f6.onrender.com/';

  constructor(private http: HttpClient) {}

  analyzeResume(file: File, jobDescription: string): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);
    return this.http.post(this.apiUrl, formData);
  }
}