import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { G2PieData } from '@delon/chart/pie';
import { G2TagCloudData } from '@delon/chart/tag-cloud';
import { _HttpClient } from '@delon/theme';
import { yuan } from '@shared';
import { zip } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  accounts: Array<{ name: string; balance: number; type_name: string; type: string }> = [];
  lastRecords: Array<{ date: string; out: string; in: string; records: [] }> = [];
  loading = true;
  data: any = {};
  tags: G2TagCloudData[];

  categoriesData: G2PieData[];
  categoriesTotal = 0;

  recordsAnalysisData: any;
  recordsAnalysisLoading = true;

  recordsOverview: Array<{ overview: { surplus: number; expense: number; income: number }; key: string; text: string }>;
  water: { overview: { surplus: number; expense: number; income: number }; key: string; text: string; percent?: string };
  accountsOverview: { percent: number; color: string };
  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAccounts();
    this.getOverview();
    this.getTags();
    this.getLastRecords();
    this.getCategoryiesData();
    this.getRecordAnalysisData();
  }

  getAccounts(): void {
    this.http.get('/api/accounts', { pageSize: 3, sort: '-balance_cent' }).subscribe((res) => {
      this.accounts = res.data.items;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getLastRecords() {
    this.http.get('/api/records', { pageSize: 6, transaction_type: 'expense' }).subscribe((res) => {
      this.lastRecords = res.data.items;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getRecordAnalysisData() {
    this.http.get('/api/records/analysis').subscribe((res) => {
      this.recordsAnalysisData = {
        data: res.data,
        xField: 'x',
        yField: 'y',
        meta: {
          x: {
            alias: '日期',
          },
          y: {
            alias: '支出金额',
          },
        },
        interactions: [
          {
            type: 'slider',
            cfg: {
              start: 0,
              end: 1,
            },
          },
        ],
      };
      this.recordsAnalysisLoading = false;
      this.cdr.detectChanges();
    });
  }

  getCategoryiesData() {
    this.http.get('/api/categories/analysis').subscribe((res) => {
      this.categoriesData = res.data.filter((i: any) => i.y > 0);
      if (this.categoriesData) {
        this.categoriesTotal = this.categoriesData.reduce((pre, now) => Math.round((now.y + pre) * 100) / 100, 0);
      }
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getOverview(): void {
    zip(this.http.get('/api/accounts/overview'), this.http.get('/api/records/overview')).subscribe(([accounts, records]: [any, any]) => {
      const percent = (accounts.data.net_asset <= 0 ? 0 : accounts.data.total_assets / accounts.data.net_asset) * 100;
      this.accountsOverview = { percent: +percent.toFixed(2), color: percent > 50 ? '#2f9cff' : '#f50' };
      this.recordsOverview = records.data;
      this.water = [...this.recordsOverview].pop();
      this.recordsOverview.pop();
      this.water.percent = ((this.water.overview.surplus / this.water.overview.income) * 100).toFixed(2);
      this.cdr.detectChanges();
    });
  }

  getTags(): void {
    this.http.get('/api/tags', { sort: 'count' }).subscribe((res) => {
      const data = res.data.items.filter((i: any) => i.count > 0);
      if (data) {
        this.tags = res.data.items.map((item: any) => ({ value: item.count, name: item.name }));
      }
      this.cdr.detectChanges();
    });
  }

  handlePieValueFormat(value: string | number): string {
    return yuan(value);
  }
}
