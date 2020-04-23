import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = undefined;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  private setTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private manageToken(response) {
    console.log(response);
    this.token = response.token;
    const expiresIn = response.expiresIn;
    if (this.token) {
      this.setTimer(expiresIn)
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresIn * 1000);
      console.log(expirationDate);
      this.saveAuthData(this.token, expirationDate);
      return this.router.navigate(['/']);
    }
    this.isAuthenticated = false;
  }

  createUser(authData: AuthData) {
    this.httpClient
      .post<{ token: string }>(
        'http://localhost:3000/api/user/signup',
        authData
      )
      .subscribe((response) => {
        this.manageToken(response);
      });
  }

  login(authData: AuthData) {
    this.httpClient
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        this.manageToken(response);
      });
  }

  logout() {
    console.log('logout');
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData()
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation && authInformation.expirationDate > new Date()) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      const expiresIn = authInformation.expirationDate.getTime() - (new Date()).getTime()
      this.setTimer(expiresIn/1000)
      this.authStatusListener.next(true);
      return true
    }
    return false
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return undefined;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}
