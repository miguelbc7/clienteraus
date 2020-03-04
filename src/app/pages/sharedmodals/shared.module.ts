import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponetsPoliticasComponent } from '../../components/componets-politicas/componets-politicas.component';
import { ComponentTerminosComponent } from '../../components/component-terminos/component-terminos.component';
import { NavbarComponent} from '../../components/navbar/navbar.component';
import { MaskPipe } from '../../pipes/mask.pipe';
import { SatinizerPipe } from '../../pipes/satinizer.pipe';

@NgModule ({
    declarations: [
        ComponetsPoliticasComponent,
        ComponentTerminosComponent,
        NavbarComponent,
        MaskPipe,
        SatinizerPipe
    ],
    exports: [
        ComponetsPoliticasComponent,
        ComponentTerminosComponent,
        NavbarComponent,
        MaskPipe,
        SatinizerPipe
    ],
    imports: [
        IonicModule
    ]
})

export class SharedModule {}