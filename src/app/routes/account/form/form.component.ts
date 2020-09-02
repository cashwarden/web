import { Component } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-form',
  templateUrl: './form.component.html',
})
export class AccountFormComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 50 },
      type: {
        type: 'string',
        title: '帐户类别',
        default: 'general_account',
        ui: {
          widget: 'select',
          asyncData: () => {
            return this.http.get('/api/accounts/types').pipe(
              map((res) => {
                return res.data.map((item: any) => {
                  return { value: item.type, label: item.name };
                });
              }),
            );
          },
        } as SFSelectWidgetSchema,
      },
      currency_balance: { type: 'number', title: '起始金额', default: 0, ui: { widgetWidth: 200 } },
      currency_code: {
        type: 'string',
        title: '货币',
        default: 'CNY',
        enum: [
          { value: 'CNY', label: 'CNY' },
          // { value: 'USD', label: 'USD' },
        ],
      },
      // exclude_from_stats: {
      //   type: 'boolean',
      //   title: '从统计中排除',
      // },
      default: {
        type: 'boolean',
        title: '默认账户',
      },
    },
    required: ['name', 'type', 'balance', 'currency_code'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService) {}

  save(value: any) {
    const url = this.record.id ? `/${this.record.id}` : '';
    const method = this.record.id ? 'put' : 'post';
    this.http.request(method, `/api/accounts${url}`, { body: value }).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.msgSrv.success('保存成功');
      this.modal.close(res.data);
    });
  }

  close() {
    this.modal.destroy();
  }
}
