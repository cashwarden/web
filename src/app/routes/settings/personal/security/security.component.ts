import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from '@delon/form';
import { ModalHelper, SettingsService, _HttpClient, TitleService } from '@delon/theme';

@Component({
  selector: 'app-settings-security',
  templateUrl: './security.component.html',
})
export class SettingsSecurityComponent implements OnInit {
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名',
      },
      email: {
        type: 'string',
        format: 'email',
        title: '邮箱',
      },
      base_currency_code: {
        type: 'string',
        title: '基础货币',
        enum: [{ label: 'CNY', value: 'CNY' }],
        default: 'CNY',
      },
    },
    required: ['username', 'email', 'base_currency_code'],
  };
  user: any;

  constructor(private http: _HttpClient, private settings: SettingsService, private titleSrv: TitleService) {}

  ngOnInit() {
    this.titleSrv.setTitle('安全设置');
    this.user = this.settings.user;
  }
}
