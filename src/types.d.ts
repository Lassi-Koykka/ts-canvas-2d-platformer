export class Entity {
    x: number;
    y: number;
    image: HTMLImageElement;
    //Step: (time: number) => void;
    draw: (ctx: CanvasRenderingContext2D, ...args: any[]) => void;

}

export class Block extends Entity {
    blockWidth: number;
    blockHeight: number;
    spriteWidth: number;
}