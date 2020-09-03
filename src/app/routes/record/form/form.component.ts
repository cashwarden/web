import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SFComponent, SFRadioWidgetSchema, SFSchema, SFSelectWidgetSchema, SFTextareaWidgetSchema, SFValue } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { toDate } from '@delon/util';
import format from 'date-fns/format';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-record-form',
  templateUrl: './form.component.html',
})
export class RecordFormComponent implements OnInit {
  record: any = {};
  selectRawData: any = {};

  form = {
    type: 'expense',
    from_account_id: '',
    to_account_id: '',
    currency_amount: '',
    currency_code: 'CNY',
    category_id: '',
    tags: [],
    remark: '',
    date: new Date(),
    reimbursement_status: 'none',
    status: 'done',
  };

  constructor(private http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.record) {
      this.form = this.record;
      this.form.date = toDate(this.record.date);
    }
    this.changeCategroy(this.form.type, false);
  }

  save(value: any) {
    const url = this.record?.id ? `/${this.record.id}` : '';
    const method = this.record?.id ? 'put' : 'post';
    value.date = format(new Date(value.date), 'yyyy-MM-dd HH:mm');

    this.http.request(method, `/api/transactions${url}`, { body: value }).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  changeCategroy(type: string, cleanCity = true) {
    this.http.get('/api/categories', { transaction_type: type }).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.selectRawData.category_id = res.data.items.map((item: any) => ({ id: item.id, name: item.name, value: false }));
      this.cdr.detectChanges();
    });
  }

  close() {
    this.modal.destroy();
  }
}
