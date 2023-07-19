import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  fetching: boolean = true;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.isFetching.subscribe((value) => {
      this.fetching = value;
    });

    this.loadingService.error.subscribe(() => {
      this.fetching = false;
    });
  }
}
