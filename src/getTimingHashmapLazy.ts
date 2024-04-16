import { getTimingBezier } from './getTimingBezier';

const timingMapping = new Map<string, (time: number) => number | undefined>();

const timingLookup = {
    'ease' : [0.25, 0.1, 0.25, 1.0],
    'ease-in' : [0.42, 0, 1.0, 1.0],
    'ease-out' : [0, 0, 0.58, 1.0],
    'ease-in-out' : [0.42, 0, 0.58, 1.0],
    'ease-in-sine' : [0.12, 0, 0.39, 0],
    'ease-out-sine' : [0.12, 0, 0.39, 0],
    'ease-in-out-sine' : [0.37, 0, 0.63, 1],
    'ease-in-cubic' : [0.32, 0, 0.67, 0],
    'ease-out-cubic' : [0.33, 1, 0.68, 1],
    'ease-in-out-cubic' : [0.65, 0, 0.35, 1],
    'ease-in-circ' : [0.55, 0, 1, 0.45],
    'ease-out-circ' : [0, 0.55, 0.45, 1],
    'ease-in-out-circ' : [0.85, 0, 0.15, 1],
    'ease-in-back' : [0.36, 0, 0.66, -0.56],
    'ease-out-back' : [0.34, 1.56, 0.64, 1],
    'ease-in-out-back' : [0.68, -0.6, 0.32, 1.6],
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
        timingMapping.set(str, timing);

        return timing;
    }

    // parse failed, return linear
    console.warn('Unknown timing function: ' + str);
    return (t) => { return t; };
}

export const getTimingHashmapLazy = (str: string): ((time: number) => number | undefined) => {
    if (str === '') {
        return (t) => { return t };
    }

    if (timingMapping.has(str)) {
        return timingMapping.get(str) || defaultTiming;
    }

    if (str === 'linear') {
        return (time: number) => { return time; };
    }

    if (str === 'step-start') {
        return () => { return 1; };
    }

    if (str === 'step-end') {
        return (time: number) => { return time === 1 ? 1 : 0; };
    }

    if (timingLookup[str] !== undefined) {
        const [a, b, c, d] = timingLookup[str];
        const timing = getTimingBezier(a, b, c, d);
        timingMapping.set(str, timing);
        return timing;
    }

    if (str.startsWith('cubic-bezier')) {
        return parseCubicBezier(str);
    }

    console.warn('Unknown timing function: ' + str);
    return defaultTiming;
};
