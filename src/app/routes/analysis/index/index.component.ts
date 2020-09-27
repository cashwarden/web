import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { G2BarData } from '@delon/chart/bar';
import { G2PieData } from '@delon/chart/pie';
import { _HttpClient } from '@delon/theme';
import { deepCopy, getTimeDistance } from '@delon/util';
import { yuan } from '@shared';

@Component({
  selector: 'app-analysis-index',
  styleUrls: ['./index.component.less'],
  templateUrl: './index.component.html',
})
export class AnalysisIndexComponent implements OnInit {
  q: any = {};
  data: { total: { expense: number; income: number; surplus: number }; expense: []; income: [] };
  pieData: { total: { expense: number; income: number; surplus: number }; expense: G2PieData[]; income: G2PieData[] };
  recordSumData: { total: { expense: number; income: number; surplus: number }; expense: G2BarData[]; income: G2BarData[] };
  date: Date[] = [];
  loading = true;
  types = ['expense', 'income'];

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '分类', index: 'category_name' },
    { title: '金额', type: 'number', index: 'currency_amount' },
  ];

  tabs: Array<{ key: string; name: string; show?: boolean }> = [
    { key: 'day', name: '日视图', show: true },
    { key: 'month', name: '月视图' },
    { key: 'year', name: '年视图' },
  ];

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef, private datePipe: DatePipe) {}

  ngOnInit() {
    this.date = getTimeDistance('month');
    if (this.date) {
      this.q.date = this.date.map((item: any) => this.datePipe.transform(item, 'yyyy-MM-dd')).join('~');
    }
    this.getData();
    this.getRecordSumData();
  }

  getData(): void {
    this.loading = true;
    const q = {};
    Object.entries(this.q)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => (q[key] = value));
    this.q = q;

    this.http.get('/api/analysis/category', this.q).subscribe((res) => {
      this.data = deepCopy(res.data);
      this.pieData = deepCopy(res.data);
      this.pieData.expense = this.pieData.expense.map((item: any) => ({ x: item.category_name, y: item.currency_amount }));
      this.pieData.income = this.pieData.income.map((item: any) => ({ x: item.category_name, y: item.currency_amount }));

      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getRecordSumData(): void {
    const q = {};
    Object.entries(this.q)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => (q[key] = value));
    this.q = q;
    this.http.get('/api/analysis/date', this.q).subscribe((res) => {
      this.recordSumData = res.data;
      this.recordSumData.expense = this.recordSumData.expense.map((item: any) => ({
        x: item.date,
        y: item.currency_amount,
        color: '#f50',
      }));

      this.recordSumData.income = this.recordSumData.income.map((item: any) => ({ x: item.date, y: item.currency_amount }));
      this.cdr.detectChanges();
    });
  }

  reloadData(value: {}) {
    if (value) {
      this.q = value;
      this.getData();
      this.getRecordSumData();
    }
  }

  changeTab(idx: number): void {
    this.tabs[idx].show = true;
    this.q.group_type = this.tabs[idx].key;

    this.getRecordSumData();
    this.cdr.detectChanges();
  }

  handlePieValueFormat(value: string | number): string {
    return yuan(value);
  }
}
