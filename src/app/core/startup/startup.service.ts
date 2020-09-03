import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { I18NService } from '../i18n/i18n.service';

import { environment } from '@env/environment';
import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    private iconService: NzIconService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    this.iconService.fetchFromIconfont({
      scriptUrl: environment.iconfontURl,
    });
  }

  private viaHttp(resolve: any, reject: any) {
    zip(this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`), this.httpClient.get('assets/tmp/app-data.json'))
      .pipe(
        catchError((res) => {
          console.warn(`StartupService.load: Network request failed`, res);
          resolve(null);
          return [];
        }),
      )
      .subscribe(
        ([langData, appData]) => {
          // Setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);

          // Application data
          const res: any = appData;
          // Application information: including site name, description, year
          this.settingService.setApp(res.app);
          // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
          this.aclService.setFull(true);
          // Menu data, https://ng-alain.com/theme/menu
          this.menuService.add(res.menu);
          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = res.app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaMockI18n(resolve: any, reject: any) {
    this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).subscribe((langData) => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);

      this.viaMock(resolve, reject);
    });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `CashWarden`,
      description: `一个开源的资产管理系统`,
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: 'Main',
        group: false,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            icon: { type: 'icon', value: 'dashboard' },
          },
          {
            text: '账号',
            link: '/account/index',
            icon: { type: 'icon', value: 'account-book' },
          },
          {
            text: '记录',
            link: '/record/index',
            icon: { type: 'icon', value: 'database' },
            shortcutRoot: true,
          },
          // {
          //   text: 'Analytics',
          //   link: '/analytics',
          //   icon: { type: 'icon', value: 'area-chart' },
          // },
          // {
          //   text: 'Imports',
          //   link: '/imports',
          //   icon: { type: 'icon', value: 'appstore' },
          // },
          {
            text: '设置',
            // i18n: 'menu.settings',
            icon: { type: 'icon', value: 'setting' },
            children: [
              {
                text: '个人设置',
                link: '/settings/personal',
                icon: { type: 'icon', value: 'user' },
              },
              {
                text: '分类设置',
                link: '/settings/categories',
                icon: { type: 'icon', value: 'appstore' },
              },
              {
                text: '标签设置',
                link: '/settings/tags',
                icon: { type: 'icon', value: 'appstore' },
              },
              // {
              //   text: 'Currencies Settings',
              //   link: '/settings/rules',
              // },
              {
                text: '规则设置',
                link: '/settings/rules',
                icon: { type: 'icon', value: 'group' },
              },
            ],
          },
        ],
      },
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMockI18n(resolve, reject);
    });
  }
}
