import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  constructor(private authService: AuthService){}

  private authListenerSubscription: Subscription
  userAuthenticated: boolean = false

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe()
  }
  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated()
    this.authListenerSubscription = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated
    })
  }

  onLogout(){
    console.log('logout')
    this.authService.logout()
  }

}
