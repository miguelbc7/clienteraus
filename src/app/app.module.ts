import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { CalculatePageModule } from './pages/modals/calculate/calculate.module';
import { TipoPagoPageModule } from './pages/modals/tipo-pago/tipo-pago.module';
import { SuccessPageModule } from './pages/modals/success/success.module';
import { BeneficiosPageModule } from './modals/beneficios/beneficios.module';
import { RecargarPageModule } from './modals/recargar/recargar.module';
import { AgregarSaldoPageModule } from './modals/agregar-saldo/agregar-saldo.module';
import { AgregarTarjetaPageModule } from './modals/agregar-tarjeta/agregar-tarjeta.module';
import { ConfirmationPageModule } from './pages/modals/confirmation/confirmation.module';
import { TerminosPageModule } from './pages/modals/terminos/terminos.module';
import { PoliticasPageModule } from './pages/modals/politicas/politicas.module';
import { EliminarPageModule } from './modals/eliminar/eliminar.module';
import { AgregarFamiliaPageModule } from './pages/modals/agregar-familia/agregar-familia.module';
import { BaseSuccessPageModule } from './pages/modals/base-success/base-success.module';
import { AgregarEntregaPageModule } from './modals/agregar-entrega/agregar-entrega.module';
import { ExplorarPageModule } from './pages/modals/explorar/explorar.module';
import { FacturaPageModule } from './pages/factura/factura.module';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';


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
    BaseSuccessPageModule,
    AgregarEntregaPageModule,
    ExplorarPageModule,
    ConfirmationPageModule,
    TerminosPageModule,
    PoliticasPageModule,
    FacturaPageModule
  ],
  providers: [
   
    StatusBar,
 
    SplashScreen,
    AndroidPermissions,
    LocationAccuracy,
    GoogleMaps,
    NativeGeocoder,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { MaskPipe }
