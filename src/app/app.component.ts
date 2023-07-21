import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AlertComponent } from './shared/alert/alert.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [HeaderComponent, LoadingComponent, AlertComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }
}
