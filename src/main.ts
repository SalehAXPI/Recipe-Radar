import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from './app/shared/loading-interceptor.service';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
    importProvidersFrom(AppRoutingModule, HttpClientModule),
  ],
}).catch((err) => err);
