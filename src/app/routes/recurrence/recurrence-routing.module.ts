import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecurrenceIndexComponent } from './index/index.component';

const routes: Routes = [{ path: 'index', component: RecurrenceIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecurrenceRoutingModule {}
