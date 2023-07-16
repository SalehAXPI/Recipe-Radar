import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  fetching: boolean = true;
  hasError: string | undefined;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.hasError = undefined;

    this.loadingService.isFetching.subscribe((value) => {
      this.fetching = value;
    });

    this.loadingService.error.subscribe((value) => {
      this.fetching = false;
      this.hasError = value;
    });
  }
}
