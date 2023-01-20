
export type MapPointType = {
  value: string;
  label: string;
  mapLng: number;
  mapLat: number;
  mapOrientation: number;
};

/** 出租车模拟数据 */
export const carPointData: MapPointType[]  = [
  { value: "001", label: "小黄车",  mapOrientation: 0, mapLng: 112.918119, mapLat: 28.282891 },
  { value: "002", label: "小绿车",  mapOrientation: 0, mapLng: 112.918919, mapLat: 28.282991 },
  { value: "003", label: "小红车",  mapOrientation: 0, mapLng: 112.918019, mapLat: 28.283991 }
];

/** 加油站模拟数据 */
export const gasStationPointData: MapPointType[] = [
  { value: "001", label: "地沟油加油站",  mapOrientation: 0, mapLng: 112.919043, mapLat: 28.288623 },
  { value: "002", label: "一路平安加油站",  mapOrientation: 0, mapLng: 112.919165, mapLat: 28.289924 },
  { value: "003", label: "一把火加油站",  mapOrientation: 0, mapLng: 112.919965, mapLat: 28.289924 }
]
