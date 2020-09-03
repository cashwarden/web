import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { yuan } from '@shared';
import { G2PieClickItem, G2PieData } from '@delon/chart/pie';

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

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAccounts();
    this.getLastRecords();
    this.getCategoryiesData();
  }

  getAccounts(): void {
    this.http.get('/api/accounts', { pageSize: 100 }).subscribe((res) => {
      this.accounts = res.data.items;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getLastRecords() {
    this.http.get('/api/records', { pageSize: 5 }).subscribe((res) => {
      this.lastRecords = res.data.items;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getCategoryiesData() {
    this.http.get('/api/categories/analysis').subscribe((res) => {
      this.categoriesData = res.data;
      if (this.categoriesData) {
        this.categoriesTotal = this.categoriesData.reduce((pre, now) => now.y + pre, 0);
      }
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  handlePieValueFormat(value: string | number): string {
    return yuan(value);
  }
}
