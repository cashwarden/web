import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisIndexComponent } from './index/index.component';

const COMPONENTS = [AnalysisIndexComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, AnalysisRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class AnalysisModule {}
