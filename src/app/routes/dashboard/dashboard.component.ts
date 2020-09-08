import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { G2BarClickItem, G2BarData } from '@delon/chart/bar';
import { G2PieClickItem, G2PieData } from '@delon/chart/pie';
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
  accounts: Array<{ name: string }> = [];
  lastRecords: Array<{ date: string; out: string; in: string; records: [] }> = [];
  loading = true;
  data: any = {};

  categoriesData: G2PieData[];
  categoriesTotal = 0;

  recordsAnalysisData: G2BarData[];
  recordsAnalysisLoading = true;

  overview: { overview: {}; key: string; text: string };

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    //  this.getAccounts();
    this.getOverview();
    this.getLastRecords();
    this.getCategoryiesData();
    this.getRecordAnalysisData();
  }

  getAccounts(): void {
    this.http.get('/api/accounts', { pageSize: 100 }).subscribe((res) => {
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
      this.recordsAnalysisData = res.data.map((item: any) => ({ x: item.x, y: item.y, color: '#f50' }));
      this.recordsAnalysisLoading = false;
      this.cdr.detectChanges();
    });
  }

  getCategoryiesData() {
    this.http.get('/api/categories/analysis').subscribe((res) => {
      this.categoriesData = res.data.filter((i: any) => i.y > 0);
      if (this.categoriesData) {
        this.categoriesTotal = this.categoriesData.reduce((pre, now) => now.y + pre, 0);
      }
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getOverview(): void {
    this.http.get('/api/records/overview').subscribe((res) => {
      this.overview = res.data;
      this.cdr.detectChanges();
    });
  }

  handlePieValueFormat(value: string | number): string {
    return yuan(value);
  }
}
