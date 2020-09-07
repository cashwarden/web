import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFRadioWidgetSchema, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings-categories-edit',
  templateUrl: './edit.component.html',
})
export class SettingsCategoriesEditComponent implements OnInit {
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      transaction_type: {
        type: 'string',
        title: '交易类型',
        enum: [
          { value: 'expense', label: '支出' },
          { value: 'income', label: '收入' },
        ],
        ui: {
          widget: 'radio',
          styleType: 'button',
          buttonStyle: 'solid',
        } as SFRadioWidgetSchema,
        default: 'expense',
      },
      sort: { type: 'number', title: '排序', minimum: 0, maximum: 99, default: 99 },
    },
    required: ['name', 'transaction_type'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {}

  save(value: any) {
    const url = this.record.id ? `/${this.record.id}` : '';
    const method = this.record.id ? 'put' : 'post';
    this.http.request(method, `/api/categories${url}`, { body: value }).subscribe((res: any) => {
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
