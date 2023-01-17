export const buttonProps = {
  color: { type: String, validator: (v) => ['error', 'warning', 'success', ''].includes(v) },
  loading: { type: Boolean },
  disabled: { type: Boolean },
  /**
   * 图标前的文字。
   */
  preIcon: { type: String },
  /**
   * 图标后的文本。
   */
  postIcon: { type: String },
  /**
   * preIcon 和 postIcon 图标大小。
   * @default: 14
   */
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};
