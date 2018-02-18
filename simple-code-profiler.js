class Profiler {
    constructor(label) {
        this.label = label;
        this.times = {};
        this.initTime = null;
        this.index = 0;
    }

    start() {
        this.initTime = process.hrtime();
    }

    record(label, label2) {
        if (!this.initTime) {
            this.start();
        }
        const time = process.hrtime();
        const fromInit = diff(time, this.initTime);
        const fromInitNanos = toNanos(fromInit);
        this.times[label || this.index] = {
            time: time,
            from: {
                init: {
                    time: fromInit,
                    nanos: fromInitNanos,
                    millis: fromInitNanos/1e6
                }
            }
        };
        if (label2 && this.times[label2] && this.times[label2].time) {
            const fromLabelTime = diff(time, this.times[label2].time);
            const nanos = toNanos(fromLabelTime);
            this.times[label].from[label2] = {
                time: fromLabelTime,
                nanos: nanos,
                millis: nanos/1e6
            }
        }
        this.index += 1;
    }

    print(tabs) {
        console.log(`------------- Profile: ${this.label} ------------- `);
        console.log(JSON.stringify(this.times, null, tabs || 2));
        console.log(`-------------------------------------------------- `);

    }
}

function toNanos(time){
    return time[0] * 1e9 + time[1]
}

function diff(a, b) {
    let s = a[0] - b[0];
    let ms = a[1] - b[1];

    if (ms < 0) {
        s = s - 1;
        ms = 1e9 + ms;
    }

    return [s, ms];
}

module.exports = foo = function (label) {
    if (process.env.NODE_ENV === 'development') {
        return new Profiler(label);
    } else if (process.env.NODE_ENV === 'production') {
        return {
            start: function () {
            },
            record: function () {
            },
            print: function () {
            }
        }
    } else {
        throw new Error('Must set NODE_ENV');
    }
};