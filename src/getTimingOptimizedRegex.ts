import { getTimingBezier } from './getTimingBezier';

const timingMapping = {
    'linear' : (time: number) => { return time; },
    'ease' : getTimingBezier(0.25, 0.1, 0.25, 1.0),
    'ease-in' : getTimingBezier(0.42, 0, 1.0, 1.0),
    'ease-out' : getTimingBezier(0, 0, 0.58, 1.0),
    'ease-in-out' : getTimingBezier(0.42, 0, 0.58, 1.0),
    'ease-in-sine' : getTimingBezier(0.12, 0, 0.39, 0),
    'ease-out-sine' : getTimingBezier(0.12, 0, 0.39, 0),
    'ease-in-out-sine' : getTimingBezier(0.37, 0, 0.63, 1),
    'ease-in-cubic' : getTimingBezier(0.32, 0, 0.67, 0),
    'ease-out-cubic' : getTimingBezier(0.33, 1, 0.68, 1),
    'ease-in-out-cubic' : getTimingBezier(0.65, 0, 0.35, 1),
    'ease-in-circ' : getTimingBezier(0.55, 0, 1, 0.45),
    'ease-out-circ' : getTimingBezier(0, 0.55, 0.45, 1),
    'ease-in-out-circ' : getTimingBezier(0.85, 0, 0.15, 1),
    'ease-in-back' : getTimingBezier(0.36, 0, 0.66, -0.56),
    'ease-out-back' : getTimingBezier(0.34, 1.56, 0.64, 1),
    'ease-in-out-back' : getTimingBezier(0.68, -0.6, 0.32, 1.6),
    'step-start' : () => { return 1; },
    'step-end' : (time: number) => { return time === 1 ? 1 : 0; }
}

const defaultTiming = (t) => {
    return t;
};

const parseCubicBezier = (str: string) => {
    //cubic-bezier(0.84, 0.52, 0.56, 0.6)
    const regex = /cubic-bezier\((?:\s*(\d+\.?\d*)\s*,){3}\s*(\d+\.?\d*)\s*\)/;
    const match = str.match(regex);

    if (match) {
        const [, num1, num2, num3, num4] = match.slice(1);
        const a = parseFloat(num1 || '0.42');
        const b = parseFloat(num2 || '0');
        const c = parseFloat(num3 || '1');
        const d = parseFloat(num4 || '1');

        const timing = getTimingBezier(a, b, c, d);
        timingMapping[str] = timing;

        return timing;
    }

    // parse failed, return linear
    console.warn('Unknown timing function: ' + str);
    return (t) => { return t; };
}

export const getTimingOptimizedRegex = (str: string): ((time: number) => number | undefined) => {
    if (str === '') {
        return (t) => { return t };
    }

    if (timingMapping[str] !== undefined) {
        return timingMapping[str] || defaultTiming;
    }

    if (str.startsWith('cubic-bezier')) {
        return parseCubicBezier(str);
    }

    return defaultTiming;
};
