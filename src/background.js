
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

const X = 0;
const Y = 1;

function vec2Add(v1, v2) {
    return [v1[X] + v2[X], v1[Y] + v2[Y]];
}

function vec2Sub(v1, v2) {
    return [v1[X] - v2[X], v1[Y] - v2[Y]];
}

function vec2Neg(v) {
    return [-v[X], -v[Y]];
}

function vec2Mul(v, x) {
    return [x * v[X], x * v[Y]];
}

function vec2Mod(v) {
    return Math.sqrt(square(v[X]) + square(v[Y]));
}

function vec2ModSq(v) {
    return square(v[X]) + square(v[Y]);
}

function vec2Dot(v1, v2) {
    return v1[X] * v2[X] + v1[Y] * v2[Y];
}

function vec2Norm(v) {
    const mod = vec2Mod(v);
    return vec2Mul(v, 1 / mod);
}


function createAtom(radius, pos, velocity) {
    return {
        radius,
        pos,
        velocity,
        acc: [0, 0],
        trace: [],
    };
}

function num2hex(num) {
    return num.toString(16).padStart(2, '0');
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function square(x) {
    return x * x;
}

function distanceSq([x1, y1], [x2, y2]) {
    return square(x2 - x1) + square(y2 - y1);
}

function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}

function constraintsMod(x, min, max) {
    const range = max - min;
    let offset = x - min;
    if (offset < 0) {
        offset = offset + Math.ceil((-offset) / range) * range;
    }
    return min + offset % range;
}

export class Fission {
    constructor(width, height, maxTraceCount, tracePeriod) {
        this.width = width;
        this.height = height;
        this.maxTraceCount = maxTraceCount;
        this.tracePeriod = tracePeriod;
        this.traceCD = tracePeriod;
        this.atoms = [];
    }

    initializeModel(atomCount) {
        const hw = this.width / 2; // half width
        const hh = this.height / 2; // half height

        for (let i = 0; i < atomCount; i++) {
            const atom = createAtom(rand(5, 15), [rand(-hw, hw), rand(-hh, hh)], [0.5 * rand(-hw, hw), 0.5 * rand(-hh, hh)]);
            this.atoms.push(atom);
        }
    }

    tick(dt, time) {
        const seconds = dt / 1000;
        this.traceCD -= dt;

        const e = 1;

        const atoms = this.atoms;
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            const trace = atom.trace;
            const prevPos = atom.pos;
            atom.pos = this.constraintsCoord(vec2Add(atom.pos, vec2Mul(atom.velocity, seconds)));
            
            if (this.traceCD <= 0) {
                trace.push([...prevPos, time]);
                if (trace.length > this.maxTraceCount) {
                    trace.splice(0, trace.length - this.maxTraceCount);
                }
            }
        }

        for (let i = 0; i < atoms.length - 1; i++) {
            const a1 = atoms[i];
            const v1 = a1.velocity;
            const m1 = PI * square(a1.radius);
            // const ke1 = 0.5 * m1 * vec2ModSq(v1); // kinetic energy 动能
            for (let j = i + 1; j < atoms.length; j++) {
                const a2 = atoms[j];
                const v2 = a2.velocity;
                const m2 = PI * square(a2.radius);
                // const ke2 = 0.5 * m2 * vec2ModSq(v2);
                if (distanceSq(a1.pos, a2.pos) < square(a1.radius + a2.radius)) {
                    // 碰撞后根据动量守恒进行运动的改变
                    // const momentum = vec2Add(vec2Mul(v1, m1), vec2Mul(v2, m2));

                    const inverseM1 = isFinite(m1) ? 1 / m1 : 0;
                    const inverseM2 = isFinite(m2) ? 1 / m2 : 0;

                    const n = vec2Norm(vec2Sub(a2.pos, a1.pos));
                    const up = -(1 + e) * vec2Dot(vec2Sub(v1, v2), n);
                    const down = vec2Dot(n, n) * (inverseM1 + inverseM2);
                    const j = up / down;

                    const newV1 = vec2Add(v1, vec2Mul(n, j * inverseM1));
                    const newV2 = vec2Sub(v2, vec2Mul(n, j * inverseM2));

                    a1.velocity = newV1;
                    a2.velocity = newV2;
                }
            }
        }

        if (this.traceCD <= 0) {
            this.traceCD = this.tracePeriod;
        }
    }

    constraintsCoord([x, y]) {
        return [constraintsMod(x, -this.width / 2, this.width / 2), constraintsMod(y, -this.height / 2, this.height / 2)];
    }

    render(canvas, time) {
        const g = canvas.getContext('2d');
        const hw = this.width / 2; // half width
        const hh = this.height / 2; // half height

        // 绘制背景
        g.clearRect(0, 0, this.width, this.height);

        g.fillStyle = '#ffffff';

        const atoms = this.atoms;
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            const [px, py] = atom.pos;
            const trace = atom.trace;

            const traceTimeRange = time - (trace.length > 0 ? trace[0][2] : time);
            for (let i = 0; i < trace.length; i++) {
                const item = trace[i];
                const tracePos = item.slice(0, 2);
                const traceTime = item[2];
                const ratio = (1 - (time - traceTime) / traceTimeRange) / 2;
                const opacity = num2hex(Math.floor(ratio * 0xff));
                g.fillStyle = '#ffffff' + num2hex(opacity);
                g.beginPath();
                g.arc(tracePos[X] + hw, tracePos[Y] + hh, atom.radius * ratio, 0, TWO_PI);
                g.fill();
            }

            g.fillStyle = '#ffffff';
            g.beginPath();
            g.arc(px + hw, py + hh, atom.radius, 0, TWO_PI);
            g.fill();
        }
    }
}