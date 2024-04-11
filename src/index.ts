import { getMemoedTimingFunction } from './getTimingMemo';
import { getTimingFunction } from './getTimingFn';
import { getTimingJitted } from './getTimingJitted';
import { getTimingJittedRegex } from './getTimingJittedRegEx';

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

suite.add('getMemoedTimingFunction', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getMemoedTimingFunction(data[i]);
    }

    return true;
});


suite.add('getTimingFunction', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingFunction(data[i]);
    }

    return true;
});

suite.add('getTimingJitted', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingJitted(data[i]);
    }

    return true;
});


suite.add('getTimingJittedRegex', () => {
    for (let i = 0; i < data.length; i++) {
        const tm = getTimingJittedRegex(data[i]);
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

log('Waiting 10 seconds before starting benchmark...');

setTimeout(() => {
    log('Starting benchmark...', true);
    log(' ');
    setTimeout(() => {
        suite.run();
    }, 10);
}, 1000);
