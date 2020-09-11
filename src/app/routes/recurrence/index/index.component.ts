import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecurrenceFormComponent } from '../form/form.component';

@Component({
  selector: 'app-recurrence-index',
  templateUrl: './index.component.html',
})
export class RecurrenceIndexComponent implements OnInit {
  loading = true;
  list: any[] = [];
  q = {
    page: 1,
    name: '',
  };

  url = `/api/recurrences`;
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
    { title: '频率', index: 'frequency_text' },
    { title: '时间值', index: 'schedule' },
    { title: '开始时间', type: 'date', index: 'started_at', dateFormat: 'yyyy-MM-dd' },
    { title: '下次执行时间', type: 'date', index: 'execution_date', dateFormat: 'yyyy-MM-dd' },
    {
      title: '状态',
      type: 'badge',
      index: 'status',
      badge: {
        active: { text: 'active', color: 'success' },
        unactivated: { text: 'unactivated', color: 'default' },
      },
    },
    { title: '更新时间', type: 'date', index: 'updated_at' },
    {
      title: '',
      buttons: [
        { text: '编辑', click: (item: any) => this.form(item) },
        // { text: '复制', click: (item: any) => this.copy(item) },
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
            title: '确定要删除吗？',
            okType: 'danger',
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
    this.http.get(this.url, this.q).subscribe((res) => {
      this.list = res.data.items;
      this.loading = false;
    });
  }

  form(record: { id?: number } = {}): void {
    this.modal.create(RecurrenceFormComponent, { record }, { size: 'md' }).subscribe((res) => {
      this.getData();
    });
  }

  copy(record: any): void {
    this.http.post(`${this.url}/${record.id}/copy`).subscribe((res) => {
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
    this.http.delete(`${this.url}/${record.id}`).subscribe((res) => {
      if (res?.code !== 0) {
        this.message.warning(res?.message);
        return;
      }
      // this.getData();
      this.message.success('删除成功');
    });
  }

  updateStatus(record: any, status: string): void {
    this.http.put(`${this.url}/${record.id}/status`, { status }).subscribe((res) => {
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
