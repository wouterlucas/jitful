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
    //'cubic-bezier(0.84, 0.52, 0.56, 0.6)'
    const s = 'cubic-bezier('
    const parts = str.split(',');
    if (parts.length !== 4) {
        console.warn('Unknown timing function: ' + str);
        // Fallback: use linear.
        return defaultTiming;
    }

    const a = parseFloat(parts[0].substring(13, parts[0].length) || '0.42');
    const b = parseFloat(parts[1] || '0');
    const c = parseFloat(parts[2] || '1');
    const d = parseFloat(parts[3].substring(0, parts[3].length - 1) || '1');

    if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number' || typeof d !== 'number') {
        console.warn(' Unknown timing function: ' + str);
        // Fallback: use linear.
        return defaultTiming;
    }

    return getTimingBezier(a, b, c, d);
}

export const getTimingJitted = (str: string): ((time: number) => number | undefined) => {
    if (str === '') {
        return (t) => { return t };
    }

    if (str.startsWith('cubic-bezier')) {
        return parseCubicBezier(str);
    }

    return timingMapping[str] || defaultTiming;
};
