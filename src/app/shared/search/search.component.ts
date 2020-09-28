import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { deepCopy, getTimeDistance } from '@delon/util';

@Component({
  selector: 'app-record-search',
  styleUrls: ['./search.component.less'],
  templateUrl: './search.component.html',
})
export class RecordSearchComponent implements OnInit {
  @Output() searched = new EventEmitter<{}>();
  @Output() reseted = new EventEmitter<{}>();
  @Input() q: any = {};
  @Input() date: Date[] = [];

  selectCacheKey = 'RECORD_SEARCH_SELECT_CACHE_KEY';
  selectData: any = {};

  initQ: any;
  loading = true;
  selectLabels: any = [
    { key: 'account_id', label: '账户' },
    { key: 'category_id', label: '分类' },
    { key: 'transaction_type', label: '类型' },
    { key: 'source', label: '来源' },
  ];

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef, private datePipe: DatePipe, private cache: CacheService) {}

  ngOnInit() {
    this.initQ = deepCopy(this.q);
    this.loadSelect('/api/accounts', 'account_id');
    this.loadSelect('/api/categories', 'category_id');
    this.loadSelect('/api/tags', 'tags');
    this.loadSelect('/api/transactions/types', 'transaction_type');
    this.loadSelect('/api/records/sources', 'source');
  }

  loadSelect(url: string, key: string) {
    this.loading = true;
    this.http.get(url, { pageSize: 50 }).subscribe((res: any) => {
      if (res.data) {
        if (key === 'tags') {
          this.selectData[key] = res.data.items.map((item: any) => ({ id: item.name, name: item.name }));
        } else if (['transaction_type', 'source'].includes(key)) {
          this.selectData[key] = res.data.map((item: any) => ({ id: item.type, name: item.name }));
        } else if (['account_id', 'category_id'].includes(key)) {
          this.selectData[key] = res.data.items.map((item: any) => ({ id: item.id, name: item.name, icon: item.icon_name }));
        } else {
          this.selectData[key] = res.data.items.map((item: any) => ({ id: item.id, name: item.name }));
        }
        this.loading = false;
        this.cache.set(this.selectCacheKey, this.selectData);
        this.cdr.detectChanges();
      }
    });
  }

  reset(): void {
    this.date = [];
    this.q = this.initQ;
    this.reseted.emit(this.q);
  }

  search(): void {
    if (this.date) {
      this.q.date = this.date.map((item: any) => this.datePipe.transform(item, 'yyyy-MM-dd')).join('~');
    }
    this.searched.emit(this.q);
  }

  setDate(type: 'today' | 'week' | 'month' | 'year'): void {
    this.date = getTimeDistance(type);
    setTimeout(() => this.cdr.detectChanges());
  }
}
