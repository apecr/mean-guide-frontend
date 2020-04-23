import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  createUser(email: String, password: String) {
    const authData: AuthData = {
      email, password
    }
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => console.log(response))
  }
}
