import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings-tags-edit',
  templateUrl: './edit.component.html',
})
export class SettingsTagsEditComponent implements OnInit {
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
    },
    required: ['name'],
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
    this.http.request(method, `/api/tags${url}`, { body: value }).subscribe((res: any) => {
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
