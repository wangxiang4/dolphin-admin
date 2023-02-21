/**
 * @program: dolphin-admin
 * @description: 加密工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import { encrypt, decrypt } from 'crypto-js/aes';
import { LoginParams } from '/@/api/platform/core/entity/user';
import * as CryptoJS from 'crypto-js';
import { encryptionLoginModel } from '/#/utils';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class AesEncryption {
  private key;
  private readonly iv;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt;
    this.key = CryptoJS.enc.Utf8.parse(key ?? '');
    this.iv = CryptoJS.enc.Utf8.parse(iv ?? '');
  }

  get getOptions() {
    return {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.iv,
    };
  }

  encryptByAES(cipherText: string) {
    return encrypt(cipherText, this.key, this.getOptions).toString();
  }

  decryptByAES(cipherText: string) {
    return decrypt(cipherText, this.key, this.getOptions).toString(CryptoJS.enc.Utf8);
  }

}

export function encryptByBase64(cipherText: string) {
  return CryptoJS.enc.Utf8.parse(cipherText).toString(CryptoJS.enc.Base64);
}

export function decodeByBase64(cipherText: string) {
  return CryptoJS.enc.Base64.parse(cipherText).toString(CryptoJS.enc.Utf8);
}

export function encryptByMd5(password: string) {
  return CryptoJS.MD5(password).toString();
}

/** 登录加密处理，处理后台需要解密字符串，不加密密码，后端会解码AES会导致乱码，始终无法成功登录系统 */
export const encryptionLogin = (params: encryptionLoginModel): LoginParams => {
  let { data, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  param.forEach(ele => {
    const data = result[ele];
    const encryptKey= CryptoJS.enc.Latin1.parse(key);
    const iv = encryptKey;
    // 加密
    const encrypted = CryptoJS.AES.encrypt(data, encryptKey, {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    });
    result[ele] = encrypted.toString();
  });
  return result;
};
