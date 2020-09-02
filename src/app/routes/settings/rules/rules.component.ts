import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsRulesFormComponent } from './form/form.component';

@Component({
  selector: 'app-settings-rules',
  templateUrl: './rules.component.html',
})
export class SettingsRulesComponent implements OnInit {
  loading = true;
  pagination: {};
  list: any[] = [];
  q = {
    page: 1,
    name: '',
  };

  // url = `/api/records`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
      },
    },
  };

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称 ', index: 'name' },
    { title: '关键词', index: 'if_keywords' },
    { title: '分配交易类型', index: 'then_transaction_type' },
    { title: '排序', index: 'sort' },
    {
      title: '状态',
      type: 'badge',
      index: 'status',
      badge: {
        active: { text: 'active', color: 'success' },
        unactivated: { text: 'unactivated', color: 'default' },
      },
    },
    { title: '时间', type: 'date', index: 'updated_at' },
    {
      title: '',
      buttons: [
        { text: '编辑', click: (item: any) => this.form(item) },
        { text: '复制', click: (item: any) => this.copy(item) },
        {
          text: (record) => (record.status === 'active' ? `停用` : `启用`),
          click: (record) => {
            const status = record.status === 'active' ? `unactivated` : `active`;
            this.updateStatus(record, status);
          },
        },
        {
          text: '删除',
          pop: {
            title: 'Yar you sure?',
            okType: 'danger',
            icon: 'star',
          },
          click: (record, _modal, comp) => {
            this.delete(record);
            // tslint:disable-next-line: no-non-null-assertion
            comp!.removeRow(record);
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private message: NzMessageService) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    const data = this.http.get('/api/rules', this.q).subscribe((res) => {
      this.list = res.data.items;
      this.pagination = res.data._meta;
      this.loading = false;
    });
  }

  form(record: { id?: number } = {}): void {
    this.modal.create(SettingsRulesFormComponent, { record }, { size: 'md' }).subscribe((res) => {
      if (record.id) {
        // record = res;
        this.getData();
      } else {
        this.list.splice(0, 0, res);
        this.list = [...this.list];
      }
    });
  }

  copy(record: any): void {
    this.http.post(`/api/rules/${record.id}/copy`).subscribe((res) => {
      if (res?.code !== 0) {
        this.message.warning(res?.message);
        return;
      }
      this.list.splice(0, 0, res.data);
      this.list = [...this.list];
      this.message.success('复制成功');
    });
  }

  delete(record: any): void {
    this.http.delete(`/api/rules/${record.id}`).subscribe((res) => {
      if (res?.code !== 0) {
        this.message.warning(res?.message);
        return;
      }
      // this.getData();
      this.message.success('删除成功');
    });
  }

  updateStatus(record: any, status: string): void {
    this.http.put(`/api/rules/${record.id}/status`, { status }).subscribe((res) => {
      if (res?.code !== 0) {
        this.message.warning(res?.message);
        return;
      }
      this.getData();
      this.message.success('更新成功');
    });
  }

  submit(value: any): void {
    this.q.name = value.name;
    this.getData();
  }
}
