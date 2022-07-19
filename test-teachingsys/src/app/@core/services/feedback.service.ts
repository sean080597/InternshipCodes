import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIs } from '../apis';
import { HttpClientService } from './http-client.service';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    currentLang = localStorage.getItem('language');
    headers = new HttpHeaders({
        accept: 'text/plain',
        LanguageType: this.currentLang === 'zh' ? '1' : '0'
    });

constructor(private httpService: HttpClientService) { }

public getAllAssignment(params?): Observable<any> {
    return this.httpService.get(APIs.assignment.teacher, { params })
}

public getAssignmentById(assignmentId): Observable<any> {
    return this.httpService.get(`${APIs.assignment.base}/${assignmentId}`,{
        headers: this.headers,
    })
}
    
}
