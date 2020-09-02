import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, TitleService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings-binding',
  templateUrl: './binding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBindingComponent implements OnInit {
  telegram = { client_username: '' };

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private iconService: NzIconService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private titleSrv: TitleService,
  ) {
    this.iconService.fetchFromIconfont({
      scriptUrl: environment.iconfontURl,
    });
  }

  ngOnInit() {
    this.titleSrv.setTitle('账号绑定');
    this.http.get('/api/users/auth-clients').subscribe((res) => {
      this.telegram = res.data.telegram;
      this.cdr.detectChanges();
    });
  }

  bindTelegram() {
    this.http.post('/api/reset-token').subscribe((res) => {
      const code = `/bind/${res.data.reset_token}`;
      this.modal.info({
        nzWidth: '500px',
        nzTitle: '绑定 Telegram 账号',
        nzContent: `将下面的绑定码复制发送给 Telegram 机器人 <a href="https://t.me/CashwardenBot" target="_blank">@CashwardenBot</a> </br> <code>${code}</code>`,
        nzOnOk: () => console.log('Info OK'),
      });
    });
  }
}
