/**
 * @program: dolphin-admin
 * @description: 时间操作工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format);
}

/** 添加日期范围 */
export function convertDateRange(params: Recordable, dateRange: string[]): Recordable {
  const search = params;
  search.beginTime = '';
  search.endTime = '';
  if (dateRange && dateRange?.length > 0) {
    search.beginTime = dateRange[0];
    search.endTime = dateRange[1];
  }
  return params;
}

export const dateUtil = moment;
