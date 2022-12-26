import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';

/**
 * Update token below if domain changed;
 */
export enum QiniuToken {
  accessKey = 'Y7KtC0UrXL6JB1MaH1Z3VaVLgK-7XJEHkhWCC4xx',
  secretKey = '80nRC4OM7yANxQhp8iC722C7ybCyTuluzMXKxUnb',
  bucket = 'bigscreentest',
}

@Injectable()
export class AppService {
  private mac: any;
  constructor() {
    this.initConfig();
  }

  initConfig() {
    qiniu.conf.ACCESS_KEY = QiniuToken.accessKey;
    qiniu.conf.SECRET_KEY = QiniuToken.secretKey;

    this.mac = new qiniu.auth.digest.Mac(
      QiniuToken.accessKey,
      QiniuToken.secretKey,
    );
  }

  async upToken(name: string): Promise<string> {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: QiniuToken.bucket + ':' + name,
    }); // 防止文件被串改，前端使用此token上传的文件名称必须与 name 一致

    return await putPolicy.uploadToken(this.mac);
  }
}
