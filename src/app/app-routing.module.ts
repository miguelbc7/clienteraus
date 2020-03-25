import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{	
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
  	{	
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
	},
  	{
		path: 'welcome',
		loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
	},
  	{
		path: 'register1',
		loadChildren: () => import('./pages/register/register1/register1.module').then( m => m.Register1PageModule)
	},
  	{ 
		path: 'register2',
		loadChildren: () => import('./pages/register/register2/register2.module').then( m => m.Register2PageModule)
	},
	{
		path: 'register3',
		loadChildren: () => import('./pages/register/register3/register3.module').then( m => m.Register3PageModule)
	},
  	{
		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
	},
  	{ 
		path: 'calculate',
		loadChildren: () => import('./pages/modals/calculate/calculate.module').then( m => m.CalculatePageModule)
	},
  	{ 
		path: 'tipopago',
		loadChildren: () => import('./pages/modals/tipo-pago/tipo-pago.module').then( m => m.TipoPagoPageModule)
	},
  	{ 
		path: 'success',
		loadChildren: () => import('./pages/modals/success/success.module').then( m => m.SuccessPageModule)
	},
	{ 
		path: 'confirmation',
		loadChildren: () => import('./pages/modals/confirmation/confirmation.module').then( m => m.ConfirmationPageModule)
	},
	{ 
		path: 'politicas',
		loadChildren: () => import('./pages/modals/politicas/politicas.module').then( m => m.PoliticasPageModule)
	},
	{ 
		path: 'terminos',
		loadChildren: () => import('./pages/modals/terminos/terminos.module').then( m => m.TerminosPageModule)
	},
  	{ 
		path: 'options',
		loadChildren: () => import('./pages/options/options.module').then( m => m.OptionsPageModule)
	},
  	{ 
		path: 'beneficios',
		loadChildren: () => import('./modals/beneficios/beneficios.module').then( m => m.BeneficiosPageModule)
	},
  	{ 
		path: 'agregarsaldo',
		loadChildren: () => import('./modals/agregar-saldo/agregar-saldo.module').then( m => m.AgregarSaldoPageModule)
	},
  	{ 
		path: 'agregartarjeta',
		loadChildren: () => import('./modals/agregar-tarjeta/agregar-tarjeta.module').then( m => m.AgregarTarjetaPageModule)
	},
  	{ 
		path: 'eliminar',
		loadChildren: () => import('./modals/eliminar/eliminar.module').then( m => m.EliminarPageModule)
	},
  	{ 
		path: 'recargar',
		loadChildren: () => import('./modals/recargar/recargar.module').then( m => m.RecargarPageModule)
	},
	{ 
		path: 'map',
		loadChildren: () => import('./pages/modals/map/map.module').then( m => m.MapPageModule)
	},
	{ 
		path: 'map/:data',
		loadChildren: () => import('./pages/modals/map/map.module').then( m => m.MapPageModule)
	},
	{
		path: 'notifications',
		loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
	},
	{
		path: 'detailsnotifications/:id',
		loadChildren: () => import('./pages/detalles-notificaciones/detalles-notificaciones.module').then( m => m.DetallesNotificacionesPageModule)
	},
	{
		path: 'detailsrestaurant/:id',
		loadChildren: () => import('./pages/detalles-restaurantes/detalles-restaurantes.module').then( m => m.DetallesRestaurantesPageModule)
	},
	{
		path: 'detailsproduct/:id/:restaurant',
		loadChildren: () => import('./pages/detalles-productos/detalles-productos.module').then( m => m.DetallesProductosPageModule)
	},
	{
		path: 'agregarentrega',
		loadChildren: () => import('./modals/agregar-entrega/agregar-entrega.module').then( m => m.AgregarEntregaPageModule)
	},
	{
		path: 'agregarfamilia',
		loadChildren: () => import('./pages/modals/agregar-familia/agregar-familia.module').then( m => m.AgregarFamiliaPageModule)
	},
	{
		path: 'basesuccess',
		loadChildren: () => import('./pages/modals/base-success/base-success.module').then( m => m.BaseSuccessPageModule)
	},
	{
		path: 'saldofamilia',
		loadChildren: () => import('./pages/saldo-familia/saldo-familia.module').then( m => m.SaldoFamiliaPageModule)
	},
	{
		path: 'cart',
		loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
	},
	{ 	
		path: 'factura',
		loadChildren: () => import('./pages/factura/factura.module').then( m => m.FacturaPageModule)
	},
  	{
	   path: 'explorar', 
		loadChildren: () => import('./pages/modals/explorar/explorar.module').then( m => m.ExplorarPageModule)
	},
	{
		path: 'recovery', 
		loadChildren: () => import('./pages/recovery/recovery.module').then( m => m.RecoveryPageModule)
	},
	{
		path: 'history', 
		loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
	}
];

@NgModule({
	imports: [
    	RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  	],
  	exports: [RouterModule]
})

export class AppRoutingModule { }
