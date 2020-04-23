import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string = undefined
  constructor(private httpClient: HttpClient) {}

  getToken() {
    return this.token
  }

  createUser(authData: AuthData) {
    this.httpClient.post<{token: string}>('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response)
      this.token = response.token
    })
  }

  login(authData: AuthData){
    console.log('login')
    console.log(authData)
    this.httpClient.post<{token: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      console.log(response)
      this.token = response.token
    })
  }
}
