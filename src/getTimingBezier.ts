export const getTimingBezier = (
    a: number,
    b: number,
    c: number,
    d: number,
  ): ((time: number) => number | undefined) => {
    const xc = 3.0 * a;
    const xb = 3.0 * (c - a) - xc;
    const xa = 1.0 - xc - xb;
    const yc = 3.0 * b;
    const yb = 3.0 * (d - b) - yc;
    const ya = 1.0 - yc - yb;

    return function (time: number): number | undefined {
      if (time >= 1.0) {
        return 1;
      }
      if (time <= 0) {
        return 0;
      }

      let t = 0.5,
        cbx,
        cbxd,
        dx;

      for (let it = 0; it < 20; it++) {
        cbx = t * (t * (t * xa + xb) + xc);
        dx = time - cbx;
        if (dx > -1e-8 && dx < 1e-8) {
          return t * (t * (t * ya + yb) + yc);
        }

        // Cubic bezier derivative.
        cbxd = t * (t * (3 * xa) + 2 * xb) + xc;

        if (cbxd > 1e-10 && cbxd < 1e-10) {
          // Problematic. Fall back to binary search method.
          break;
        }

        t += dx / cbxd;
      }

      // Fallback: binary search method. This is more reliable when there are near-0 slopes.
      let minT = 0;
      let maxT = 1;
      for (let it = 0; it < 20; it++) {
        t = 0.5 * (minT + maxT);

        cbx = t * (t * (t * xa + xb) + xc);

        dx = time - cbx;
        if (dx > -1e-8 && dx < 1e-8) {
          // Solution found!
          return t * (t * (t * ya + yb) + yc);
        }

        if (dx < 0) {
          maxT = t;
        } else {
          minT = t;
        }
      }
    };
};
