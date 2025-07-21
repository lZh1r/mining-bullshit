export class GigaNum {
    static readonly precision = 8;
    static readonly toStringPrecision = 3;
    static readonly powerRecursiveFactor = 100;
    mainPart: number;
    exponentialFactor: number;

    constructor(mainPart: number);
    constructor(mainPart: number, exponentialFactor: number);
    constructor(mainPart: number, exponentialFactor?: number) {
        if (typeof exponentialFactor === "number") {
            this.mainPart = mainPart;
            this.exponentialFactor = exponentialFactor;
        } else {
            if (mainPart === 0) {
                this.exponentialFactor = 0;
                this.mainPart = 0;
            } else {
                this.exponentialFactor = Math.floor(Math.log10(mainPart));
                this.mainPart = GigaNum.formatMainPart(mainPart / Math.pow(10, this.exponentialFactor));
            }
        }
    }

    private static formatMainPart(unformatted: number, precision?: number) {
        const precisionNum = Math.pow(10, precision ?? GigaNum.precision);
        return Math.round(unformatted * precisionNum) / precisionNum;
    }

    toString() {
        return `${GigaNum.formatMainPart(this.mainPart, GigaNum.toStringPrecision)}e${this.exponentialFactor}`;
    }

    toNumber() {
        return this.mainPart * Math.pow(10, this.exponentialFactor);
    }

    subtract(anotherNum: GigaNum): GigaNum;
    subtract(anotherNum: number): GigaNum;
    subtract(anotherNum: GigaNum | number): GigaNum;
    subtract(anotherNum: GigaNum | number): GigaNum {
        if (typeof anotherNum === "number") {
            anotherNum = new GigaNum(anotherNum);
        }
        const thisExp = this.exponentialFactor;
        if (this.compareTo(anotherNum) === "less") {
            return this;
        } else {
            const expDifference = thisExp - anotherNum.exponentialFactor;
            if (expDifference <= GigaNum.precision) {
                let resultMain = (this.mainPart * Math.pow(10, expDifference) - anotherNum.mainPart) / Math.pow(10, expDifference);
                let resultExp = thisExp;
                if (resultMain < 1) {
                    resultMain *= 10;
                    resultExp -= 1;
                }
                return new GigaNum(GigaNum.formatMainPart(resultMain), resultExp);
            } else {
                return this;
            }
        }
    }

    add(anotherNum: GigaNum): GigaNum;
    add(anotherNum: number): GigaNum;
    add(anotherNum: GigaNum | number): GigaNum;
    add(anotherNum: GigaNum | number): GigaNum {
        if (typeof anotherNum === "number") {
            anotherNum = new GigaNum(anotherNum);
        }
        const thisExp = this.exponentialFactor;
        const thisMain = this.mainPart;
        const otherExp = anotherNum.exponentialFactor;
        const otherMain = anotherNum.mainPart;
        const expDifference = Math.abs(thisExp - otherExp);
        const scaleFactor = Math.pow(10, expDifference);
        let resultMain;
        let resultExp;

        if (this.compareTo(anotherNum) === "less") {
            if (expDifference <= GigaNum.precision) {
                resultMain = (otherMain * scaleFactor + thisMain) / scaleFactor;
                resultExp = otherExp;
            } else {
                return anotherNum;
            }
        } else if (expDifference <= GigaNum.precision) {
            resultMain = (thisMain * scaleFactor + otherMain) / scaleFactor;
            resultExp = thisExp;
        } else {
            return this;
        }

        if (resultMain >= 10) {
            resultMain /= 10;
            resultExp += 1;
        }
        return new GigaNum(GigaNum.formatMainPart(resultMain), resultExp);
    }

    divide(anotherNum: GigaNum): GigaNum;
    divide(anotherNum: number): GigaNum;
    divide(anotherNum: GigaNum | number): GigaNum {
        if (typeof anotherNum === "number") {
            if (anotherNum <= 0) {
                return new GigaNum(0, 0);
            }
            anotherNum = new GigaNum(anotherNum);
        }
        let resultMain = this.mainPart;
        let resultExp = this.exponentialFactor;
        switch (this.compareTo(anotherNum)) {
            case "equal": {
                return new GigaNum(1, 0);
            }
            case "less": {
                return new GigaNum(0, 0);
            }
            case "more": {
                resultExp -= anotherNum.exponentialFactor;
                resultMain /= anotherNum.mainPart;
                if (resultMain < 1) {
                    resultMain *= 10;
                    resultExp -= 1;
                }
                break;
            }
        }
        resultExp -= anotherNum.exponentialFactor;
        return new GigaNum(GigaNum.formatMainPart(resultMain), resultExp);
    }

    multiply(anotherNum: GigaNum): GigaNum;
    multiply(anotherNum: number): GigaNum;
    multiply(anotherNum: GigaNum | number): GigaNum {
        if (typeof anotherNum === "number") {
            if (anotherNum <= 0) {
                return new GigaNum(0, 0);
            }
            anotherNum = new GigaNum(anotherNum);
        }
        let resultMain = this.mainPart * anotherNum.mainPart;
        let resultExp = this.exponentialFactor + anotherNum.exponentialFactor;
        if (resultMain > 10) {
            resultMain /= 10;
            resultExp += 1;
        }
        return new GigaNum(GigaNum.formatMainPart(resultMain), resultExp);
    }

    pow(anotherNum: number) {
        const originalMain = this.mainPart;
        const originalExp = this.exponentialFactor;
        let resultMain = 1;
        let resultExp = 1;
        if (anotherNum <= 0) {
            return new GigaNum(1, 0);
        } else if (anotherNum > GigaNum.powerRecursiveFactor) {
            const temp = this.pow(GigaNum.powerRecursiveFactor);
            while (anotherNum > GigaNum.powerRecursiveFactor) {
                anotherNum -= GigaNum.powerRecursiveFactor;
                resultMain *= temp.mainPart;
                resultExp += temp.exponentialFactor;
                if (resultMain >= 10) {
                    while (resultMain >= 10) {
                        resultMain /= 10;
                        resultExp += 1;
                    }
                }
            }
            resultMain *= Math.pow(originalMain, anotherNum);
            resultExp += Math.round(originalExp * anotherNum);

        } else {
            resultMain = Math.pow(originalMain, anotherNum);
            resultExp = Math.round(originalExp * anotherNum);
        }

        if (resultMain >= 10) {
            while (resultMain >= 10) {
                resultMain /= 10;
                resultExp += 1;
            }
        } else if (resultMain < 1) {
            while (resultMain < 1) {
                resultMain *= 10;
                resultExp -= 1;
            }
        }

        return new GigaNum(GigaNum.formatMainPart(resultMain), resultExp);
    }

    /**
     * Note to self:
     * Compares THIS to ANOTHER GigaNum and returns "more" if THIS is greater than ANOTHER ONE.
     * Not the other way around!
     */
    compareTo(anotherNum: GigaNum) {
        const thisExp = this.exponentialFactor;
        const thisMain = this.mainPart;
        const otherExp = anotherNum.exponentialFactor;
        const otherMain = anotherNum.mainPart;

        if (thisExp > otherExp) {
            return "more";
        } else if (thisExp === otherExp) {
            if (thisMain > otherMain) {
                return "more";
            } else if (thisMain === otherMain) {
                return "equal";
            } else {
                return "less";
            }
        } else {
            return "less";
        }
    }
}