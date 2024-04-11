const timingOptions = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'ease-in-sine',
    'ease-out-sine',
    'ease-in-out-sine',
    'ease-in-cubic',
    'ease-out-cubic',
    'ease-in-out-cubic',
    'ease-in-circ',
    'ease-out-circ',
    'ease-in-out-circ',
    'ease-in-back',
    'ease-out-back',
    'ease-in-out-back',
    'step-start',
    'step-end',
    'cubic-bezier(0.1, 0.7, 1.0, 0.1)',
    'cubic-bezier(0.5, 1.5, 0.5, 0.5)',
    'cubic-bezier(0.2, 0.5, 0.2, 0.1)',
    'cubic-bezier(0.84, 0.52, 0.56, 0.6)'
];

export const setup = () => {
    let data: string[] = [];

    for (let i = 0; i < 1000; i++) {
        const timingIndex = i % timingOptions.length;
        const timingOption = timingOptions[timingIndex];
        data.push(timingOption);
    }

    return data;
}
