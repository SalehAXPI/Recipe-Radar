import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AlertComponent } from './shared/alert/alert.component';
import { RouterModule } from '@angular/router';
import { AppState } from './store/app.reducer';
import { Store } from '@ngrx/store';
import { initLogin } from './auth/store/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  imports: [HeaderComponent, LoadingComponent, AlertComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.store.dispatch(initLogin());
  }
}
