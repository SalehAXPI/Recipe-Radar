import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from './shared/loading-interceptor.service';
import { appReducer } from './store/app.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RecipeEffects } from './recipes/store/recipe.effects';
import { provideRouterStore } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
    importProvidersFrom(HttpClientModule),
    provideStore(appReducer),
    provideEffects(AuthEffects, RecipeEffects),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideRouterStore(),
  ],
};
