import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFRadioWidgetSchema, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of, pipe } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-settings-rules-form',
  templateUrl: './form.component.html',
})
export class SettingsRulesFormComponent {
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  record: any = {};
  selectRawData: any = {};
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
        ui: {
          widget: 'radio',
          styleType: 'button',
          buttonStyle: 'solid',
          asyncData: () =>
            of([
              { value: 'expense', label: '支出' },
              { value: 'income', label: '收入' },
              { value: 'transfer', label: '转账' },
            ]).pipe(
              delay(100),
              tap(() => this.updateCategories(this.record.then_transaction_type || 'expense', this.record.then_category_id)),
            ),
          change: (i) => this.updateCategories(i, ''),
        } as SFRadioWidgetSchema,
        default: 'expense',
      },
      then_from_account_id: {
        type: 'string',
        title: '分配支付帐户',
        ui: {
          widget: 'select',
          visibleIf: { then_transaction_type: ['expense', 'transfer'] },
          asyncData: () => of(this.selectRawData.account_id).pipe(delay(200)),
        } as SFSelectWidgetSchema,
      },
      then_to_account_id: {
        type: 'string',
        title: '分配收款帐户',
        ui: {
          widget: 'select',
          visibleIf: { then_transaction_type: ['income', 'transfer'] },
          asyncData: () => of(this.selectRawData.account_id).pipe(delay(200)),
        } as SFSelectWidgetSchema,
      },
      then_category_id: {
        type: 'string',
        title: '分配类别',
        ui: {
          widget: 'select',
        } as SFSelectWidgetSchema,
      },
      then_tags: {
        type: 'string',
        title: '分配标签',
        default: null,
        ui: {
          widget: 'select',
          mode: 'tags',
          visibleIf: { then_transaction_type: ['income', 'expense'] },
          asyncData: () => of(this.selectRawData.tags).pipe(delay(200)),
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

  updateCategories(type: string, category_id: number): void {
    const property = this.sf.getProperty('/then_category_id');
    const items = this.selectRawData.category_id.filter((item: any) => item.transaction_type === type);
    property.schema.enum = items;
    property.widget.reset(category_id || items[0]);
  }

  close() {
    this.modal.destroy();
  }
}
