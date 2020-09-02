import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { SettingsTagsEditComponent } from './edit/edit.component';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  submit(value: any): void {
    this.q = value;
    this.getData();
  }
}
