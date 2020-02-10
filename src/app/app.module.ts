import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { CalculatePageModule } from './pages/modals/calculate/calculate.module';
import { TipoPagoPageModule } from './pages/modals/tipo-pago/tipo-pago.module';
import { SuccessPageModule } from './pages/modals/success/success.module';
import { BeneficiosPageModule } from './modals/beneficios/beneficios.module';
import { RecargarPageModule } from './modals/recargar/recargar.module';
import { AgregarSaldoPageModule } from './modals/agregar-saldo/agregar-saldo.module';
import { AgregarTarjetaPageModule } from './modals/agregar-tarjeta/agregar-tarjeta.module';
import { EliminarPageModule } from './modals/eliminar/eliminar.module';
import { AgregarFamiliaPageModule } from './pages/modals/agregar-familia/agregar-familia.module';
import { BaseSuccessPageModule } from './pages/modals/base-success/base-success.module';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    CalculatePageModule,
    TipoPagoPageModule,
    SuccessPageModule,
    BeneficiosPageModule,
    RecargarPageModule,
    AgregarSaldoPageModule,
    AgregarTarjetaPageModule,
    EliminarPageModule,
    AgregarFamiliaPageModule,
    BaseSuccessPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    LocationAccuracy,
    GoogleMaps,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
