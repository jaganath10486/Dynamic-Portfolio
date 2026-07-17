export class Utilities {
  static toBoolean(value: string): boolean {
    return value?.toLowerCase() === 'true';
  }

  static roundToTwo(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  static isValidNumber(value: unknown): value is number {
    return typeof value === 'number' && isFinite(value) && !isNaN(value);
  }
}
