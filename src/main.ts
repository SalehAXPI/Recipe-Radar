import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from './app/shared/loading-interceptor.service';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { shoppingListReducer } from './app/shopping-list/store/shopping-list.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
    importProvidersFrom(AppRoutingModule, HttpClientModule),
    provideStore({ addIng: shoppingListReducer }),
    provideEffects(),
  ],
}).catch((err) => err);
