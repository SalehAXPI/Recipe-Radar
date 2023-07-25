import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AlertComponent } from './shared/alert/alert.component';
import { RouterModule } from '@angular/router';
import { AppState } from './store/app.reducer';
import { Store } from '@ngrx/store';
import { initLogin } from './auth/store/auth.actions';

@Component({
  standalone: true,
  imports: [HeaderComponent, LoadingComponent, AlertComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(initLogin());
  }
}
