import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from './app/shared/loading-interceptor.service';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducer } from './app/store/app.reducer';
import { AuthEffects } from './app/auth/store/auth.effects';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
    importProvidersFrom(AppRoutingModule, HttpClientModule),
    provideStore(appReducer),
    provideEffects(AuthEffects),
  ],
}).catch((err) => err);
