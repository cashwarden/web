import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, SettingsService, TitleService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-settings-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBaseComponent implements OnInit {
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

  constructor(
    private http: _HttpClient,
    private settings: SettingsService,
    private titleSrv: TitleService,
    private msg: NzMessageService,
  ) {}

  ngOnInit() {
    this.titleSrv.setTitle('基本设置');
    this.user = this.settings.user;
  }

  submit(value: any) {
    this.msg.success('暂未开发');
  }
}
