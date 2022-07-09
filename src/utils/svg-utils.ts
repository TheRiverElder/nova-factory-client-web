export class PathBuilder {

    private instList: Array<string> = [];
    private add(inst: string) { this.instList.push(inst); }
    
    private width: number;
    private height: number;

    setSize(width: number, height: number): PathBuilder {
        this.width = width;
        this.height = height;
        return this;
    }

    moveTo(x: number, y: number): PathBuilder {
        this.add(`M ${x} ${this.height - y}`);
        return this;
    }

    moveBy(dx: number, dy: number): PathBuilder {
        this.add(`m ${dx} ${-dy}`);
        return this;
    }

    lineTo(x: number, y: number): PathBuilder {
        this.add(`L ${x} ${this.height - y}`);
        return this;
    }

    lineBy(dx: number, dy: number): PathBuilder {
        this.add(`l ${dx} ${-dy}`);
        return this;
    }

    build(): string {
        return this.instList.join(' ');
    }
}