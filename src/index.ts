import { getMemoedTimingFunction } from './getTimingMemo';
import { getTimingFunction } from './getTimingFn';
import { getTimingJitted } from './getTimingJitted';

import { setup } from './setup';

const results = document.getElementById('results');
if (results) {
    results.style.padding = '20px';
    results.style.fontFamily = 'monospace';
    results.style.fontSize = '20px';
    results.style.color = 'black';
}

const log = (msg: string) => {
    console.log(msg);
    results?.appendChild(document.createTextNode(msg));
    results?.appendChild(document.createElement('br'));
}

const start = () => {
    log('Starting benchmark...');
    log(' ');
}

// @ts-ignore
const suite = new Benchmark.Suite('jitful tests')

const data = setup();

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

suite.on('start', start);
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

setTimeout(() => {
    suite.run();
}, 5000);
