import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecurrenceFormComponent } from '../../recurrence/form/form.component';
import { RecordFormComponent } from './../form/form.component';

@Component({
  selector: 'app-record-index',
  styleUrls: ['./index.component.less'],
  templateUrl: './index.component.html',
})
export class RecordIndexComponent implements OnInit {
  q = {
    page: 1,
    cagegory_id: '0',
  };

  list: Array<{ date: string; records: []; in: string; out: string }> = [];

  loading = true;
  loadingMore = true;
  selectRawData: any = {};
  selectData: any = {};
  selectLabels: any = [
    { key: 'account_id', label: '所属账户' },
    { key: 'category_id', label: '所属分类' },
    { key: 'tags', label: '所属标签' },
    { key: 'transaction_type', label: '交易类型' },
    { key: 'source', label: '记录来源' },
  ];
  overview: [];
  pagination: { totalCount: number; pageCount: number; currentPage: number; perPage: number };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getData();
    this.loadSelect('/api/accounts', 'account_id');
    this.loadSelect('/api/categories', 'category_id');
    this.loadSelect('/api/tags', 'tags');
    this.loadSelect('/api/transactions/types', 'transaction_type');
    this.loadSelect('/api/records/sources', 'source');
  }

  getData(): void {
    this.loading = true;
    this.loadingMore = true;
    this.http.get('/api/records', this.q).subscribe((res) => {
      this.list = res.data.items;
      this.pagination = res.data._meta;
      if (res.data._meta.pageCount <= res.data._meta.currentPage) {
        this.loadingMore = false;
      }
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.q.page++;
    this.http.get('/api/records', this.q).subscribe((res: any) => {
      const data = this.list.concat(res.data.items);
      this.list = [...data];
      if (res.data._meta.pageCount <= res.data._meta.currentPage) {
        this.loadingMore = false;
      }
    });
  }

  getDate(currentDate: string, prevDate?: string) {
    currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    prevDate = prevDate ? this.datePipe.transform(prevDate, 'yyyy-MM-dd') : '';
    if (currentDate !== prevDate) {
      return currentDate;
    }
    return '';
  }

  loadSelect(url: string, key: string) {
    this.http.get(url).subscribe((res: any) => {
      if (res.code !== 0) {
        this.msg.warning(res.message);
        return;
      }
      if (res.data) {
        const init = { id: 0, name: '全部', value: false };
        if (key === 'tags') {
          this.selectRawData[key] = res.data.items.map((item: any) => ({ id: item.name, name: item.name, value: false }));
        } else if (['transaction_type', 'source'].includes(key)) {
          this.selectRawData[key] = res.data.map((item: any) => ({ id: item.type, name: item.name, value: false }));
        } else {
          this.selectRawData[key] = res.data.items.map((item: any) => ({ id: item.id, name: item.name, value: false }));
        }
        this.selectData[key] = [init, ...this.selectRawData[key]];
        this.cdr.detectChanges();
      }
    });
  }

  changeSelect(status: boolean, idx: number, key: string): void {
    if (idx === 0) {
      this.selectData[key].map((i: any) => (i.value = status));
    } else {
      this.selectData[key][idx].value = status;
    }
    this.q[key] = this.selectData[key]
      .filter((i: any) => i.value === true)
      .map((i: any) => i.id)
      .toString();
    this.getData();
  }

  disabled(record: any): boolean {
    if (record.transaction.id) {
      return true;
    }
    return false;
  }

  form(record: { id?: number; transaction?: {} } = {}): void {
    this.modal
      .create(RecordFormComponent, { record: record.transaction, selectRawData: this.selectRawData }, { size: 'md' })
      .subscribe((res) => {
        this.getData();
        this.cdr.detectChanges();
      });
  }

  recurrenceForm(record: { transaction_id?: number } = {}): void {
    this.modal.create(RecurrenceFormComponent, { record: { transaction_id: record.transaction_id } }, { size: 'md' }).subscribe((res) => {
      this.router.navigateByUrl(`/recurrence/index`);
    });
  }

  delete(record: any): void {
    this.http.delete(`/api/records/${record.id}`).subscribe((res) => {
      if (res?.code !== 0) {
        this.msg.warning(res?.message);
        return;
      }
      this.getData();
      this.msg.success('删除成功');
    });
  }

  onCreated(created: boolean) {
    if (created) {
      this.getData();
    }
  }
}
