import { Block } from "./types.d";

class GroundBlock extends Block {
    x;
    y;
    pxWidth;
    pxHeight;
    blockWidth;
    blockHeight;
    spriteWidth = 8;
    unitWidth = 25;
    
    constructor(x: number, y: number, blockWidth: number, blockHeight: number) {
        super();
        this.x = x;
        this.y = y;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.pxWidth = blockWidth * this.unitWidth + 1;
        this.pxHeight = blockHeight * this.unitWidth + 1;
        this.image = new Image();
        this.image.src = "Dirt.png";
    }

    draw = (ctx: CanvasRenderingContext2D) => {

        const drawTile = (spriteX:number, spriteY: number, blockCol: number, blockRow: number) => {
            ctx.drawImage(
                this.image,
                Math.floor(this.spriteWidth*spriteX),
                Math.floor(this.spriteWidth*spriteY),
                Math.floor(this.spriteWidth),
                Math.floor(this.spriteWidth),
                Math.floor(this.x + this.unitWidth*blockCol),
                Math.floor(this.y + this.unitWidth*blockRow),
                Math.floor(this.unitWidth),
                Math.floor(this.unitWidth)
            );
        }

        

        for(let spriteRow = 0; spriteRow < this.blockWidth; spriteRow++)  {
            for (let spriteCol = 0; spriteCol < this.blockHeight; spriteCol++) {
                let row = spriteRow
                let col = spriteCol;
                
                if (row === this.blockWidth - 1) {
                    row = 3;
                } else if (row !== 0) {
                    row = (row % 2) + 1;
                }
                
                if (col === this.blockHeight - 1) {
                    col = 3;
                } else if (col !== 0) {
                    col = (col % 2) + 1;
                }

                drawTile(row, col, spriteRow, spriteCol);
                
            }
        }
        
    }

}

export default GroundBlock;