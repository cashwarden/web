import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisIndexComponent } from './index/index.component';

const routes: Routes = [{ path: 'index', component: AnalysisIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisRoutingModule {}
