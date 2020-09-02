import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsBaseComponent } from './personal/base/base.component';
import { SettingsBindingComponent } from './personal/binding/binding.component';
import { SettingsPersonalComponent } from './personal/personal.component';
import { SettingsSecurityComponent } from './personal/security/security.component';
import { SettingsRulesComponent } from './rules/rules.component';
import { SettingsTagsComponent } from './tags/tags.component';
import { SettingsCategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  { path: 'rules', component: SettingsRulesComponent },
  {
    path: 'personal',
    component: SettingsPersonalComponent,
    children: [
      { path: '', redirectTo: 'base', pathMatch: 'full' },
      { path: 'base', component: SettingsBaseComponent },
      { path: 'binding', component: SettingsBindingComponent },
      { path: 'security', component: SettingsSecurityComponent },
    ],
  },
  { path: 'tags', component: SettingsTagsComponent },
  ,
  { path: 'categories', component: SettingsCategoriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
