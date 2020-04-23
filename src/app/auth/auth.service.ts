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

  private manageToken(response) {
    console.log(response);
    this.token = response.token;
    if (this.token) {
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      return this.router.navigate(['/'])
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

  logout(){
    console.log('logout')
    this.token = undefined
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.router.navigate(['/'])
  }
}
