import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RecurrenceRoutingModule } from './recurrence-routing.module';
import { RecurrenceIndexComponent } from './index/index.component';
import { RecurrenceFormComponent } from './form/form.component';

const COMPONENTS = [RecurrenceIndexComponent];
const COMPONENTS_NOROUNT = [RecurrenceFormComponent];

@NgModule({
  imports: [SharedModule, RecurrenceRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RecurrenceModule {}
