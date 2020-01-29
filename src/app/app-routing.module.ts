import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
  	{ path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  	{ path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  	{ path: 'register1', loadChildren: './pages/register/register1/register1.module#Register1PageModule' },
  	{ path: 'register2', loadChildren: './pages/register/register2/register2.module#Register2PageModule' },
  	{ path: 'register3', loadChildren: './pages/register/register3/register3.module#Register3PageModule' },
  	{ path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  	{ path: 'calculate', loadChildren: './pages/modals/calculate/calculate.module#CalculatePageModule' },
  	{ path: 'tipopago', loadChildren: './pages/modals/tipo-pago/tipo-pago.module#TipoPagoPageModule' },
  	{ path: 'success', loadChildren: './pages/modals/success/success.module#SuccessPageModule' },
  	{ path: 'options', loadChildren: './pages/options/options.module#OptionsPageModule' },
  	{ path: 'beneficios', loadChildren: './modals/beneficios/beneficios.module#BeneficiosPageModule' },
  	{ path: 'agregarsaldo', loadChildren: './modals/beneficios/beneficios.module#BeneficiosPageModule' },
  	{ path: 'agregartarjeta', loadChildren: './modals/agregar-tarjeta/agregar-tarjeta.module#AgregarTarjetaPageModule' },
  	{ path: 'eliminar', loadChildren: './modals/eliminar/eliminar.module#EliminarPageModule' },
  	{ path: 'recargar', loadChildren: './modals/recargar/recargar.module#RecargarPageModule' },
	{
		path: 'notifications',
		loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
	},
	{
		path: 'detailsnotifications/:id',
		loadChildren: () => import('./pages/detalles-notificaciones/detalles-notificaciones.module').then( m => m.DetallesNotificacionesPageModule)
	}
];

@NgModule({
	imports: [
    	RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  	],
  	exports: [RouterModule]
})

export class AppRoutingModule { }
