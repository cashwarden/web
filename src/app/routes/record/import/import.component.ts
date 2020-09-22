import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-record-import',
  templateUrl: './import.component.html',
})
export class RecordImportComponent {
  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      if (file.response.code === 0) {
        if (file.response.data.fail === 0) {
          this.msgSrv.success(`${file.name} 导入成功`);
        } else {
          const error = file.response.data.fail_list[0];
          this.msgSrv.error(`${file.name} 导入失败：[${error.data.toString()}] ${error.reason}`);
        }
      } else {
        this.msgSrv.error(`${file.name} 导入失败：${file.response.message}`);
      }
    } else if (status === 'error') {
      this.msgSrv.error(`${file.name} 文件上传失败`);
    }
  }

  close() {
    this.modal.destroy();
  }
}
