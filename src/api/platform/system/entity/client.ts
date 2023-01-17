/**
 * @program: dolphin-admin
 * @description: 客户端实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 客户端查询参数 */
export type ClientParams = Page & Client;

/** 客户端对象 */
export interface Client extends CommonEntity {
  clientId: string;
  clientSecret: string;
  resourceIds: string;
  scope: string;
  authorizedGrantTypes: string;
  webServerRedirectUri: string;
  authorities: string;
  accessTokenValidity: number;
  refreshTokenValidity: number;
  additionalInformation: string;
  autoapprove: string;
  [key: string]: any;
}

/** 客户端响应对象 */
export type ClientResult = R<Client[]>;
