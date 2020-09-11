import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFDateWidgetSchema, SFRadioWidgetSchema, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recurrence-form',
  templateUrl: './form.component.html',
})
export class RecurrenceFormComponent implements OnInit {
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  record: any = {};
  transaction: any = {};
  url = `/api/recurrences`;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      frequency: {
        type: 'string',
        title: '频率',
        default: null,
        ui: {
          widget: 'select',
          asyncData: () => {
            return this.http.get('/api/recurrences/frequencies').pipe(
              map((res) => {
                return res.data.map((item: any) => {
                  return { value: item.type, label: item.name };
                });
              }),
              tap(() => this.updateSchedule(this.record.frequency, Number(this.record.schedule))),
            );
          },
          change: (i: string) => this.updateSchedule(i, 0),
        } as SFSelectWidgetSchema,
      },
      schedule: {
        type: 'string',
        title: '时间值',
        ui: {
          widget: 'select',
          visibleIf: { frequency: ['week', 'month', 'year'] },
        } as SFSelectWidgetSchema,
      },
      started_at: {
        type: 'string',
        title: '开始时间',
        format: 'date',
        default: new Date(),
        // ui: { widget: 'date' } as SFDateWidgetSchema,
      },
      status: {
        type: 'string',
        title: '状态',
        enum: [
          { value: 'active', label: '开启' },
          { value: 'unactivated', label: '停用' },
        ],
        ui: {
          widget: 'radio',
          styleType: 'button',
          buttonStyle: 'solid',
        } as SFRadioWidgetSchema,
        default: 'active',
      },
    },
    required: ['name', 'frequency', 'started_at'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getTransaction();
  }

  save(value: any) {
    const url = this.record.id ? `/${this.record.id}` : '';
    const method = this.record.id ? 'put' : 'post';
    this.http.request(method, `${this.url}${url}`, { body: value }).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.msgSrv.success('保存成功');
      this.modal.close(res.data);
    });
  }

  getTransaction(): void {
    this.http.get(`/api/transactions/${this.record.transaction_id}`, { expand: 'toAccount,category,fromAccount' }).subscribe((res) => {
      this.transaction = res.data;
      this.cdr.detectChanges();
    });
  }

  updateSchedule(frequency: string, schedule?: number): void {
    const property = this.sf.getProperty('/schedule');
    let items = [];
    switch (frequency) {
      case 'week':
        items = [...Array(7).keys()].map((x) => x + 1);
        break;
      case 'month':
        items = [...Array(31).keys()].map((x) => x + 1);
        break;
      case 'year':
        items = [];
        break;
      default:
        break;
    }

    property.schema.enum = items;
    if (schedule) {
      property.widget.reset(schedule || items[0]);
    }
  }

  close() {
    this.modal.destroy();
  }
}
