import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFRadioWidgetSchema, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings-rules-form',
  templateUrl: './form.component.html',
})
export class SettingsRulesFormComponent {
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      if_keywords: {
        type: 'string',
        title: '关键词',
        default: null,
        ui: {
          widget: 'select',
          mode: 'tags',
        } as SFSelectWidgetSchema,
      },
      then_transaction_type: {
        type: 'string',
        title: '分配交易类型',
        enum: [
          { value: 'expense', label: '支出' },
          { value: 'income', label: '收入' },
          { value: 'transfer', label: '转账' },
        ],
        ui: {
          widget: 'radio',
          styleType: 'button',
          buttonStyle: 'solid',
        } as SFRadioWidgetSchema,
        default: 'expense',
      },
      then_from_account_id: {
        type: 'string',
        title: '分配支付帐户',
        ui: {
          widget: 'select',
          asyncData: () => this.loadItems('/api/accounts', 'then_from_account_id'),
        } as SFSelectWidgetSchema,
      },
      then_to_account_id: {
        type: 'string',
        title: '分配收款帐户',
        ui: {
          widget: 'select',
          asyncData: () => this.loadItems('/api/accounts', 'then_to_account_id'),
        } as SFSelectWidgetSchema,
      },
      then_category_id: {
        type: 'string',
        title: '分配类别',
        ui: {
          widget: 'select',
          asyncData: () => this.loadItems('/api/categories', 'then_category_id'),
        } as SFSelectWidgetSchema,
      },
      then_tags: {
        type: 'string',
        title: '分配标签',
        default: null,
        ui: {
          widget: 'select',
          mode: 'tags',
          asyncData: () => this.loadItems('/api/tags', 'then_tags'),
        } as SFSelectWidgetSchema,
      },
      sort: { type: 'number', title: '排序', minimum: 0, maximum: 99, default: 99 },
      // then_reimbursement_status: {
      //   type: 'string',
      //   title: '分配报销状态',
      //   enum: [
      //     { value: 'none', label: '非报销' },
      //     { value: 'todo', label: '待报销' },
      //     { value: 'done', label: '已报销' },
      //   ],
      //   ui: {
      //     widget: 'radio',
      //     styleType: 'button',
      //     buttonStyle: 'solid',
      //   } as SFRadioWidgetSchema,
      //   default: 'none',
      // },
      // then_transaction_status: {
      //   type: 'string',
      //   title: '分配交易状态',
      //   enum: [
      //     { value: 'todo', label: '待入账' },
      //     { value: 'done', label: '已入账' },
      //   ],
      //   ui: {
      //     widget: 'radio',
      //     styleType: 'button',
      //     buttonStyle: 'solid',
      //   } as SFRadioWidgetSchema,
      //   default: 'done',
      // },
    },
    required: ['name', 'if_keywords'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  save(value: any) {
    const url = this.record.id ? `/${this.record.id}` : '';
    const method = this.record.id ? 'put' : 'post';
    this.http.request(method, `/api/rules${url}`, { body: value }).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.msgSrv.success('保存成功');
      this.modal.close(res.data);
    });
  }

  loadItems(url: string, key: string) {
    return this.http.get(url).pipe(
      map((res) => {
        if (res.code !== 0) {
          this.msgSrv.warning(res.message);
          return;
        }
        return res.data.items.map((item: any) => {
          if (key === 'then_tags') {
            return { value: item.name, label: item.name };
          }
          return { value: item.id, label: item.name };
        });
      }),
    );
  }

  close() {
    this.modal.destroy();
  }
}
