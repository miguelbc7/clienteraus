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
		loadChildren: './pages/login/login.module#LoginPageModule'
	},
  	{
		path: 'welcome',
		loadChildren: './pages/welcome/welcome.module#WelcomePageModule'
	},
  	{
		path: 'register1',
		loadChildren: './pages/register/register1/register1.module#Register1PageModule'
	},
  	{ 
		path: 'register2',
		loadChildren: './pages/register/register2/register2.module#Register2PageModule'
	},
  	{
		path: 'register3',
		loadChildren: './pages/register/register3/register3.module#Register3PageModule' },
  	{
		path: 'home',
		loadChildren: './pages/home/home.module#HomePageModule'
	},
  	{ 
		path: 'calculate',
		loadChildren: './pages/modals/calculate/calculate.module#CalculatePageModule'
	},
  	{ 
		path: 'tipopago',
		loadChildren: './pages/modals/tipo-pago/tipo-pago.module#TipoPagoPageModule'
	},
  	{ 
		path: 'success',
		loadChildren: './pages/modals/success/success.module#SuccessPageModule'
	},
  	{ 
		path: 'options',
		loadChildren: './pages/options/options.module#OptionsPageModule'
	},
  	{ 
		path: 'beneficios',
		loadChildren: './modals/beneficios/beneficios.module#BeneficiosPageModule'
	},
  	{ 
		path: 'agregarsaldo',
		loadChildren: './modals/beneficios/beneficios.module#BeneficiosPageModule'
	},
  	{ 
		path: 'agregartarjeta',
		loadChildren: './modals/agregar-tarjeta/agregar-tarjeta.module#AgregarTarjetaPageModule'
	},
  	{ 
		path: 'eliminar',
		loadChildren: './modals/eliminar/eliminar.module#EliminarPageModule'
	},
  	{ 
		path: 'recargar',
		loadChildren: './modals/recargar/recargar.module#RecargarPageModule'
	},
	{ 
		path: 'map',
		loadChildren: './pages/modals/map/map.module#MapPageModule'
	},
	{ 
		path: 'map/:data',
		loadChildren: './pages/modals/map/map.module#MapPageModule'
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
		loadChildren: './modals/agregar-entrega/agregar-entrega.module#AgregarEntregaPageModule'
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
		loadChildren: './pages/factura/factura.module#FacturaPageModule' 
	},
  	{
	   path: 'explorar', 
	   loadChildren: './pages/modals/explorar/explorar.module#ExplorarPageModule' 
	}


];

@NgModule({
	imports: [
    	RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  	],
  	exports: [RouterModule]
})

export class AppRoutingModule { }
