import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '@delon/abc/xlsx';
import { ModalHelper, _HttpClient } from '@delon/theme';
import format from 'date-fns/format';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecurrenceFormComponent } from '../../recurrence/form/form.component';
import { RecordImportComponent } from '../import/import.component';
import { RecordFormComponent } from './../form/form.component';

@Component({
  selector: 'app-record-index',
  styleUrls: ['./index.component.less'],
  templateUrl: './index.component.html',
})
export class RecordIndexComponent implements OnInit {
  q: any = {
    page: 1,
    pageSize: 50,
  };
  list: Array<{ date: string; records: []; in: string; out: string }> = [];
  loading = true;
  loadingMore = true;

  overview: [];
  pagination: { totalCount: number; pageCount: number; currentPage: number; perPage: number };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private xlsx: XlsxService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.loadingMore = true;

    const q = {};
    Object.entries(this.q)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => (q[key] = value));
    this.q = q;

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

  form(record: { id?: number; transaction?: {} } = {}): void {
    this.modal.create(RecordFormComponent, { record: record.transaction }, { size: 'md' }).subscribe((res) => {
      this.q.page = 1;
      this.getData();
      this.cdr.detectChanges();
    });
  }

  import(): void {
    this.modal.create(RecordImportComponent, {}, { size: 'lg' }).subscribe((res) => {
      this.q.page = 1;
      this.getData();
      this.cdr.detectChanges();
    });
  }

  download(): void {
    const initData = [['账单日期', '类别', '类型', '金额', '标签', '描述', '备注', '账户1', '账户2']];
    this.http.get('/api/transactions/export').subscribe((res: any) => {
      const data = initData.concat(res.data);
      const now = format(new Date(), 'yyyy-MM-dd');
      this.xlsx.export({
        sheets: [
          {
            data,
            name: 'sheet name',
          },
        ],
        opts: {
          bookType: 'csv',
        },
        filename: `CashWarden_Export_${now}.csv`,
      });
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
      this.q.page = 1;
      this.getData();
      this.msg.success('删除成功');
    });
  }

  reloadData(value: {}) {
    if (value) {
      this.q.page = 1;
      this.q = value;
      this.getData();
    }
  }
}
