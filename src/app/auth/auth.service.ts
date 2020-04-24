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
  private userId: string;

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

  getUserId() {
    return this.userId;
  }

  private setTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private manageToken(response) {
    this.token = response.token;
    const expiresIn = response.expiresIn;
    if (this.token) {
      this.setTimer(expiresIn);
      this.isAuthenticated = true;
      this.userId = response.userId;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresIn * 1000);
      this.saveAuthData(this.token, expirationDate, this.userId);
      return this.router.navigate(['/']);
    }
    this.isAuthenticated = false;
  }

  createUser(authData: AuthData) {
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/signup',
        authData
      )
      .subscribe(
        (response) => {
          this.manageToken(response);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(authData: AuthData) {
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        (response) => {
          this.manageToken(response);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.userId = undefined;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation && authInformation.expirationDate > new Date()) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      const expiresIn =
        authInformation.expirationDate.getTime() - new Date().getTime();
      this.setTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      return true;
    }
    return false;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return undefined;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }
}
