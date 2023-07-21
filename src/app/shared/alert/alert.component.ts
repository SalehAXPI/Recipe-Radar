import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  hasError: string | undefined;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.hasError = undefined;

    this.loadingService.error.subscribe((errorMessage) => {
      this.hasError = errorMessage;
    });
  }

  onClose() {
    this.hasError = undefined;
  }
}
