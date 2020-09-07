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
  q = {
    page: 1,
    name: '',
    sort: '',
    type: '',
  };
  accountTypes: any[] = [];
  list: Array<{ id: number; name: string; type: string; color: string; balance: string }> = [];

  loading = true;
  pagination: {};
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
    this.http.get('/api/accounts', this.q).subscribe((res) => {
      this.list = res.data.items;
      this.pagination = res.data._meta;
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
        const init = { type: '', name: '全部' };
        this.accountTypes = [init, ...res.data];
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

  submit(): void {
    console.log(this.q);

    this.getData();
  }

  reset(): void {
    this.q = {
      page: 1,
      name: '',
      sort: '',
      type: '',
    };
    this.getData();
  }

  to(item: { key: string }) {
    this.router.navigateByUrl(`/account/view/${item.key}`);
  }

  form(record: { id?: number } = {}): void {
    this.modal.create(AccountFormComponent, { record }, { size: 'md' }).subscribe((res) => {
      if (record.id) {
        // record = res;
        this.getData();
      } else {
        this.list.splice(0, 0, res);
        this.list = [...this.list];
      }
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
