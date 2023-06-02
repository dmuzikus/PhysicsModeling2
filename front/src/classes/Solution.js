export class Solver {
    h = 6.62607015 * 10e-34;
    m = 9.1093837 * 10e-31;
    constructor(delta=20, P=0, step=0.07) {
        this.setDelta(delta);
        this.setP(P);
        this.setStep(step || 1);
        this.setA(1);
        this.setN(2)
    }
    #getRange(start, stop, step) {
        if (typeof stop == 'undefined') {
            stop = start;
            start = 0;
        }
        if (typeof step == 'undefined') {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        const result = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
};
    #getArrange() {
        const arr = [];
        for (let i=-this.delta; i<=this.delta; i+=this.step){
            arr.push(i);
        }
        return arr;
    }

    #getArrangeK() {
        const arr = [];
        for (let i=-Math.PI / this.a; i<= Math.PI / this.a; i+=this.step){
            arr.push(i);
        }
        return arr;
    }
    #getArrangeKLeft(n) {
        const arr = [];
        for (let i=-n * Math.PI / this.a; i<=-(n - 1) * Math.PI / this.a; i+=this.step){
            arr.push(i);
        }
        return arr;
    }
    #getArrangeKRight(n) {
        const arr = [];
        for (let i=(n - 1) * Math.PI / this.a; i<=n * Math.PI / this.a; i+=this.step){
            arr.push(i);
        }
        return arr;
    }
    setDelta(value) {
        this.delta = value
    };
    setP(value) {
        this.P = value
    };
    setStep(value) {
        this.step = value
    };
    setA(value) {
        this.a = value
    };
    setN(value) {
        this.n = value
    };
    #solve(alphaA, P) {
        if (alphaA!==0) return Math.cos(alphaA) + P * Math.sin(alphaA) / alphaA
        return 1
    }
    processBaseCase() {
        let funcValues = [];
        let topLimitArray = [];
        let bottomLimitArray = [];
        let arrange = this.#getArrange();
        arrange.forEach((x)=>{
            funcValues.push(this.#solve(x, this.P))
            bottomLimitArray.push(-1)
            topLimitArray.push(1)
        })
        return {
            funcValues: funcValues,
            arrange: arrange,
            bottomLimitArray: bottomLimitArray,
            topLimitArray: topLimitArray,
            P: this.P,
            delta: this.delta
        }
    }

    processSpecialCase() {
        let xValues = []
        let yValues = []


        this.#getRange(2, this.n + 1).forEach((i) => {
            this.#getArrangeKLeft(i).forEach((k, idx) => {
                xValues.push(k)
                if (idx === 0) yValues.push(null)
                else yValues.push((i -1) * 2.5 + Math.pow(k, 2) * Math.pow(this.h, 2) / (2 * this.m) + Math.cos(k * this.a) * (i % 2 === 0? 1 : -1))
            })
        })

        this.#getArrangeK().forEach((k, idx)=>{
            xValues.push(k)
            if (idx === 0 || idx === this.#getArrangeKLeft().length - 1) yValues.push(null)
            else yValues.push(Math.pow(k, 2) * Math.pow(this.h, 2) / (2 * this.m) - Math.cos(k * this.a))
        })


        this.#getRange(2, this.n + 1).forEach((i) => {
            this.#getArrangeKRight(i).forEach((k, idx) => {
                xValues.push(k)
                if (idx === 0) yValues.push(null)
                else yValues.push((i -1) * 2.5 + Math.pow(k, 2) * Math.pow(this.h, 2) / (2 * this.m) + Math.cos(k * this.a) * (i % 2 === 0? 1 : -1))
            })
        })
        return {x: xValues, y: yValues}
    }
}