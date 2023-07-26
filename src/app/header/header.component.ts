import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from '../shared/dropdown.directive';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { logout } from '../auth/store/auth.actions';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  collapsed: boolean = true;

  constructor(
    private dataStorageService: DataStorageService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.select('auth').subscribe((user) => {
      this.loggedIn = !!user.user;
    });
  }

  onSaveData() {
    this.dataStorageService.saveData();
  }

  onFetchData() {
    this.dataStorageService.fetchData();
  }

  onLogout() {
    this.store.dispatch(logout({}));
  }

  onManageClick() {
    if (this.loggedIn) return;

    this.router.navigate(['auth']);
  }
}
