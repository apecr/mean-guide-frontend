import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  createUser(authData: AuthData) {
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => console.log(response))
  }

  login(authData: AuthData){
    console.log('login')
    console.log(authData)
    this.httpClient.post('http://localhost:3000/api/user/login', authData)
    .subscribe(response => console.log(response))
  }
}
