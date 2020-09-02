import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RecordRoutingModule } from './record-routing.module';
import { RecordIndexComponent } from './index/index.component';
import { RecordFormComponent } from './form/form.component';
import { RecordCreateByDescComponent } from './create-by-desc/create-by-desc.component';

const COMPONENTS = [RecordIndexComponent];
const COMPONENTS_NOROUNT = [RecordFormComponent, RecordCreateByDescComponent];

@NgModule({
  imports: [SharedModule, RecordRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RecordModule {}
