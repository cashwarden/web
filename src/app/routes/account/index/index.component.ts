import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountFormComponent } from './../form/form.component';

@Component({
  selector: 'app-account-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountIndexComponent implements OnInit {
  q: any = {
    page: 1,
    pageSize: 50,
  };
  accountSorts = [
    { value: '-balance_cent', label: '余额倒序' },
    { value: 'balance_cent', label: '余额正序' },
  ];
  accountTypes: any[] = [];
  list: Array<{ id: number; name: string; type: string; color: string; balance: string }> = [];

  loading = true;
  overview: { count: number; net_asset: number; total_assets: number; liabilities: number };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getOverview();
    this.getData();
    this.getAccountTypes();
  }

  getData(): void {
    this.loading = true;
    const q = {};
    Object.entries(this.q)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => (q[key] = value));
    this.q = q;
    this.http.get('/api/accounts', this.q).subscribe((res) => {
      this.list = res.data.items;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getAccountTypes(): void {
    this.http.get('/api/accounts/types').subscribe((res) => {
      if (res.code !== 0) {
        this.msg.warning(res.message);
        return;
      }
      if (res.data) {
        this.accountTypes = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  getOverview(): void {
    this.http.get('/api/accounts/overview').subscribe((res) => {
      this.overview = res.data;
      this.cdr.detectChanges();
    });
  }

  search(): void {
    this.getData();
  }

  reset(): void {
    this.q = {
      page: 1,
      pageSize: 50,
    };
    this.getData();
  }

  to(item: { key: string }) {
    this.router.navigateByUrl(`/account/view/${item.key}`);
  }

  form(record: { id?: number } = {}): void {
    console.log(this.accountTypes);

    this.modal.create(AccountFormComponent, { record, accountTypes: this.accountTypes }, { size: 'md' }).subscribe((res) => {
      this.getData();
      this.getOverview();
      this.cdr.detectChanges();
    });
  }

  delete(record: any): void {
    this.http.delete(`/api/accounts/${record.id}`).subscribe((res) => {
      if (res?.code !== 0) {
        this.msg.warning(res?.message);
        return;
      }
      this.getData();
      this.getOverview();
      this.msg.success('删除成功');
    });
  }
}
