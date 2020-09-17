import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings-categories-edit',
  templateUrl: './edit.component.html',
})
export class SettingsCategoriesEditComponent implements OnInit {
  record: any = {};
  form = {
    name: '',
    transaction_type: 'expense',
    sort: 99,
    icon_name: '',
  };
  icons: [];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadIcons();
    if (this.record.id) {
      this.form = this.record;
    }
  }

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

  loadIcons(): void {
    this.http.get('/api/icons').subscribe((res: any) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.icons = res.data;
      this.cdr.detectChanges();
    });
  }

  close() {
    this.modal.destroy();
  }
}
