import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  registerService(registerObj: any) {
    return this.http.post<any>(`${apiUrls.authServiceApi}register`, registerObj);
  }
  loginService(loginObj: any) {
    return this.http.post<any>(`${apiUrls.authServiceApi}login`, loginObj, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const jwtHelper = new JwtHelperService();
  
    if (!token) return false;
  
    return !jwtHelper.isTokenExpired(token);
  }
  

  logout(): void {
    this.http.post<any>(`${apiUrls.authServiceApi}logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('roles');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
        }
      });
  }  
}
