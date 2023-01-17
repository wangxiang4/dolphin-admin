/**
 * @program: dolphin-admin
 * @description: 令牌模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '用户编号',
    dataIndex: 'user_info.id'
  },
  {
    title: '用户名称',
    dataIndex: 'user_info.username'
  },
  {
    title: '客户端',
    dataIndex: 'clientId'
  },
  {
    title: '令牌',
    dataIndex: 'access_token'
  },
  {
    title: '类型',
    dataIndex: 'token_type'
  },
  {
    title: '过期时间',
    dataIndex: 'expires_in'
  }
];
