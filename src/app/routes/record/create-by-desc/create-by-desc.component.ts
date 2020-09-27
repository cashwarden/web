import { Component, EventEmitter, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-record-create-by-desc',
  templateUrl: './create-by-desc.component.html',
})
export class RecordCreateByDescComponent {
  @Output() created = new EventEmitter<{}>();

  i: { description?: string } = {};

  constructor(public msgSrv: NzMessageService, public http: _HttpClient) {}

  submit() {
    const data = { description: this.i.description };
    this.http.post('/api/transactions/by-description', data).subscribe((res) => {
      if (res.code !== 0) {
        this.msgSrv.warning(res.message);
        return;
      }
      this.msgSrv.success('添加成功');
      this.i.description = '';
      const q = { page: 1, pageSize: 50 };
      this.created.emit(q);
    });
  }
}
