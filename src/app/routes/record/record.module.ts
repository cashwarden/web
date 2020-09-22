import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RecordCreateByDescComponent } from './create-by-desc/create-by-desc.component';
import { RecordFormComponent } from './form/form.component';
import { RecordImportComponent } from './import/import.component';
import { RecordIndexComponent } from './index/index.component';
import { RecordRoutingModule } from './record-routing.module';

const COMPONENTS = [RecordIndexComponent];
const COMPONENTS_NOROUNT = [RecordFormComponent, RecordCreateByDescComponent, RecordImportComponent];

@NgModule({
  imports: [SharedModule, RecordRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RecordModule {}
