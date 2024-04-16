import { getMemoedTimingFunction } from './getTimingMemo';
import { getTimingFunction } from './getTimingFn';
import { getTimingOptimized } from './getTimingOptimized';
import { getTimingOptimizedRegex } from './getTimingOptimizedRegex';
import { getTimingOptimizedRegexLazy } from './getTimingOptimizedRegExLazy';
import { getTimingHashmap } from './getTimingHashmap';
import { getTimingHashmapLazy } from './getTimingHashmapLazy';
import { getTimingFunctionCached } from './getTimingFnCached';

import { setup } from './setup';

// get amount=1000 from query params
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const data = setup(amount ? parseInt(amount) : 1000);

const results = document.getElementById('results');
if (results) {
    results.style.padding = '20px';
    results.style.fontFamily = 'monospace';
    results.style.fontSize = '20px';
    results.style.color = 'black';
}

const log = (msg: string, replace?: boolean) => {
    if (msg !== ' ')
        console.log(msg);

    if (!results) {
        return;
    }

    if (replace) {
        results.innerHTML = '';
    }

    results.appendChild(document.createTextNode(msg));
    results.appendChild(document.createElement('br'));
}

// @ts-ignore
const suite = new Benchmark.Suite('jitful tests')

suite.add('original', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingFunction(data[i]);
    }

    return true;
});

suite.add('original cached', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingFunctionCached(data[i]);
    }

    return true;
});


suite.add('memoized', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getMemoedTimingFunction(data[i]);
    }

    return true;
});


// Disabling because we really dont need this variant
// suite.add('optimized non-regex', () => {
//     for (let i = 0; i < data.length; i++) {
//         const tm = getTimingOptimized(data[i]);
//     }

//     return true;
// });


suite.add('optimized', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingOptimizedRegex(data[i]);
    }

    return true;
});

suite.add('optimized lazy', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingOptimizedRegexLazy(data[i]);
    }

    return true;
});

suite.add('hashmap', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingHashmap(data[i]);
    }

    return true;
});

suite.add('hashmap lazy', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingHashmapLazy(data[i]);
    }

    return true;
});

suite.on('complete', () => {
    log(' ');
    log('Benchmark complete.')
    log('Fastest is ' + suite.filter('fastest').map('name'));
    log('Slowest is ' + suite.filter('slowest').map('name'));
});

suite.on('cycle', (event) => {
    const benchmark = event.target;
    log(benchmark.toString());
});

log('Ready!');

setTimeout(() => {
    log('Starting benchmark...', true);
    log(' ');
    setTimeout(() => {
        suite.run();
    }, 10);
}, 1000);
