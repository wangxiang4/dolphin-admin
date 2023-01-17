/**
 * @program: dolphin-admin
 * @description: 核心用户实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { CommonEntity } from '/@/api/common/data/entity';
import type { DolphinUser } from '/@/api/common/base/entity';

/** 登录参数对象 */
export interface LoginParams {
  username: string;
  password: string;
  realKey?: string;
  code?: string;
  [key: string]: any;
}

/** 令牌增强输出对象 */
export interface TokenEnhancer {
  access_token: string;
  clientId: string;
  expires_in: number;
  license: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_info: DolphinUser;
}

/** 用户对象 */
export interface User extends CommonEntity {
  // 用户id
  id: string;
  // 用户名
  userName: string;
  // 昵称
  nickName: string;
  // 头像
  avatar: string;
  // 所属部门ID
  deptId: string;
  // 所属部门名称
  deptName: string;
  // 邮箱
  email: string;
  // 菜单按钮权限
  permissions: string[];
  // 角色ID权限
  roleIds: string[];
  // 手机号
  phone: string;
  // 用户密码
  password: string;
  // 用户性别
  sex: string;
  // 最后登陆IP
  loginIp: string;
  // 最后登陆时间
  loginTime: string;
  // 用户状态
  status: string;
  // 备注信息
  remarks: string;
  // 多租户ID
  tenantId: string;
  // 指定登录后首页跳转
  homePath?: string;
  // 前端项目配置多租户选择集合
  tenantIds: string[];
  [key: string]: any;
}

/** 验证码对象 */
export interface Captcha {
  // 验证码地址
  img: string;
  // redis拿取验证码唯一key
  realKey: string;
}
