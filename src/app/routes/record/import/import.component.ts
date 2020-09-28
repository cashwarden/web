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
  dataSet = [
    { column_name: '账单日期', description: '消费时间, 常见的时间格式都支持，如：「2020-09-08 20:35」 「2020-09-08」', required: '是' },
    { column_name: '类别', description: '账单类别，必须已经存在的分类', required: '是' },
    { column_name: '类型', description: '账单类型，目前只有「支出」、「收入」、「转账」', required: '是' },
    { column_name: '金额', description: '消费金额，整数或者最多两位小数', required: '是' },
    { column_name: '标签', description: '多个标签用「/」分开', required: '否' },
    { column_name: '描述', description: '账单描述', required: '否' },
    { column_name: '备注', description: '账单备注', required: '否' },
    {
      column_name: '账户1',
      description: '收入或者支出的账户，或者是转账类型的转出账户。如果为空，则使用默认账户，否则填写的账户必须已存在',
      required: '否',
    },
    { column_name: '账户2', description: '转账类型时的转入账户', required: '交易类型为「转账」时必填' },
  ];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
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
