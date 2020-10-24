import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-account-form',
  templateUrl: './form.component.html',
})
export class AccountFormComponent implements OnInit {
  record: any = {};
  accountTypes: [];

  form = {
    name: '',
    type: 'general_account',
    currency_balance: '',
    currency_code: 'CNY',
    status: 'active',
    default: false,
    exclude_from_stats: false,
  };
  ngOnInit(): void {
    if (this.record.id) {
      this.form = this.record;
    }
  }

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
