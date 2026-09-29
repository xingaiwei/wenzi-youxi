/** 水墨调色：墨分五色（焦、浓、重、淡、清），外加少量浅绛与朱砂 */
export const INK = {
  burnt: '#141414', // 焦墨
  thick: '#262626', // 浓墨
  heavy: '#474644', // 重墨
  light: '#7d7b76', // 淡墨
  clear: '#b3afa4', // 清墨
  paper: '#efe6d2', // 宣纸
  paperDeep: '#e3d6ba',
  cinnabar: '#b1382a', // 朱砂
  indigo: '#5f7d80', // 花青
  ochre: '#a4845a', // 赭石
} as const;

export type InkTone = keyof typeof INK;
