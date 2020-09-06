import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsTagsEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-settings-tags',
  templateUrl: './tags.component.html',
})
export class SettingsTagsComponent implements OnInit {
  @ViewChild('st', { static: false }) st: STComponent;

  loading = true;
  pagination: {};
  list: any[] = [];
  q = {
    page: 1,
    name: '',
  };

  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
      },
    },
  };
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '次数', index: 'count' },
    { title: '时间', type: 'date', index: 'updated_at' },
    {
      title: '',
      buttons: [
        {
          text: '编辑',
          click: (item: any) => this.form(item),
        },
        {
          text: '删除',
          pop: {
            title: 'Yar you sure?',
            okType: 'danger',
            icon: 'star',
          },
          click: (record, _modal, comp) => {
            this.delete(record, comp);
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private cdr: ChangeDetectorRef, private msg: NzMessageService) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    const data = this.http.get('/api/tags', this.q).subscribe((res) => {
      this.list = res.data.items;
      this.pagination = res.data._meta;
      this.loading = false;
    });
  }

  form(record: { id?: number } = {}): void {
    this.modal.create(SettingsTagsEditComponent, { record }, { size: 'md' }).subscribe((res) => {
      if (record.id) {
        // record = res;
        this.getData();
      } else {
        this.list.splice(0, 0, res);
        this.list = [...this.list];
      }
    });
  }

  delete(record: any, comp): void {
    this.http.delete(`/api/tags/${record.id}`).subscribe((res) => {
      if (res?.code !== 0) {
        this.msg.warning(res?.message);
        return;
      }
      // tslint:disable-next-line: no-non-null-assertion
      comp!.removeRow(record);
      // this.getData();
      this.msg.success('删除成功');
    });
  }

  submit(value: any): void {
    this.q = value;
    this.getData();
  }
}
