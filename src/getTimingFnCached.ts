import { getTimingBezier } from './getTimingBezier';

const timingCache = {};

export const getTimingFunctionCached = (str: string): ((time: number) => number | undefined) => {
    if (timingCache[str] !== undefined) {
        return timingCache[str];
    }

    switch (str) {
      case 'linear':
        return function (time: number) {
          return time;
        };
      case 'ease':
        return getTimingBezier(0.25, 0.1, 0.25, 1.0);

      case 'ease-in':
        return getTimingBezier(0.42, 0, 1.0, 1.0);
      case 'ease-out':
        return getTimingBezier(0, 0, 0.58, 1.0);
      case 'ease-in-out':
        return getTimingBezier(0.42, 0, 0.58, 1.0);

      case 'ease-in-sine':
        return getTimingBezier(0.12, 0, 0.39, 0);
      case 'ease-out-sine':
        return getTimingBezier(0.12, 0, 0.39, 0);
      case 'ease-in-out-sine':
        return getTimingBezier(0.37, 0, 0.63, 1);

      case 'ease-in-cubic':
        return getTimingBezier(0.32, 0, 0.67, 0);
      case 'ease-out-cubic':
        return getTimingBezier(0.33, 1, 0.68, 1);
      case 'ease-in-out-cubic':
        return getTimingBezier(0.65, 0, 0.35, 1);

      case 'ease-in-circ':
        return getTimingBezier(0.55, 0, 1, 0.45);
      case 'ease-out-circ':
        return getTimingBezier(0, 0.55, 0.45, 1);
      case 'ease-in-out-circ':
        return getTimingBezier(0.85, 0, 0.15, 1);

      case 'ease-in-back':
        return getTimingBezier(0.36, 0, 0.66, -0.56);
      case 'ease-out-back':
        return getTimingBezier(0.34, 1.56, 0.64, 1);
      case 'ease-in-out-back':
        return getTimingBezier(0.68, -0.6, 0.32, 1.6);

      case 'step-start':
        return function () {
          return 1;
        };
      case 'step-end':
        return function (time: number) {
          return time === 1 ? 1 : 0;
        };
      default:
        // eslint-disable-next-line no-case-declarations
        const s = 'cubic-bezier(';
        if (str && str.indexOf(s) === 0) {
          const parts = str
            .substr(s.length, str.length - s.length - 1)
            .split(',');
          if (parts.length !== 4) {
            console.warn('Unknown timing function: ' + str);
            // Fallback: use linear.
            return function (time) {
              return time;
            };
          }
          const a = parseFloat(parts[0] || '0.42');
          const b = parseFloat(parts[1] || '0');
          const c = parseFloat(parts[2] || '1');
          const d = parseFloat(parts[3] || '1');

          if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
            console.warn(' Unknown timing function: ' + str);
            // Fallback: use linear.
            return function (time) {
              return time;
            };
          }

          const timing = getTimingBezier(a, b, c, d);
          timingCache[str] = timing;
          return timing;
        } else {
          console.warn('Unknown timing function: ' + str);
          // Fallback: use linear.
          return function (time) {
            return time;
          };
        }
    }
};
