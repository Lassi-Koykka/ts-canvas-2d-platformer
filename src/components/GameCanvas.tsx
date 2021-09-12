import { useEffect, useRef } from "react"
import { Player } from "../Player"

interface GameCanvasProps {
    width?: number,
    height?: number
}

export interface Iinput {
    leftKey: boolean, rightKey: boolean, upKey: boolean, downKey: boolean
}

const GameCanvas = ({ width = window.innerWidth, height = window.innerHeight }: GameCanvasProps) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    let ctx: CanvasRenderingContext2D;

    let scrollCoordinates = {x: 0, y: 0};

    window.onresize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
    }


    let lastTime = 0;
    let upKey = false;
    let leftKey = false;
    let rightKey = false;
    let downKey = false;

    let player: Player;


    const handleResize = () => {
        ctx.canvas.height = window.innerHeight;
        ctx.canvas.width = window.innerWidth;
        ctx.imageSmoothingEnabled = false;
    };

    const setupInputs = () => {
        document.addEventListener("keydown", handleInputDown)
        document.addEventListener("keyup", handleInputUp)
    }

    const handleInputDown = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            upKey = true;
        } else if (e.key === "a" || e.key === "ArrowLeft") {
            leftKey = true;
        } else if (e.key === "d" || e.key === "ArrowRight") {
            rightKey = true;
        } else if (e.key === "s" || e.key === "ArroDown") {
            downKey = true;
        }
    }
    const handleInputUp = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            upKey = false;
        } else if (e.key === "a" || e.key === "ArrowLeft") {
            leftKey = false;
        } else if (e.key === "d" || e.key === "ArrowRight") {
            rightKey = false;
        } else if (e.key === "s" || e.key === "ArrowDown") {
            downKey = false;
        }
    }

    const Step = (time: number) => {

        // Draw loop
        const delta = (time - lastTime);
        lastTime = time;
        player.step({ upKey, downKey, leftKey, rightKey }, delta);

        Draw();

        requestAnimationFrame(Step);
    }

    const Draw = () => {
        // Clear canvas
        ctx.restore();
        
        ctx.clearRect(0, 0, width, height);


        ctx.save();
        ctx.setTransform(1, 0, 0, 1, -1 * scrollCoordinates.x, -1 * scrollCoordinates.y);


        // Create gradient
        
        for(let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgb(${ Math.floor(255-i*255* 0.01) }, ${ Math.floor(i*255* 0.01) }, ${ Math.floor(255-i*255* 0.01) })`
            ctx.fillRect(200*i, 0, 200, height); 
        }
        
        // Player draw
        player.draw(ctx, scrollCoordinates);
        
    }

    useEffect(() => {
        //initialize
        if (canvasRef.current) {

            contextRef.current = canvasRef.current.getContext('2d')!;
            contextRef.current.imageSmoothingEnabled = false;
            ctx = contextRef.current;
            
            window.addEventListener("resize", () => handleResize());
            
            setupInputs();

            player = new Player(400, 400);

            if (contextRef.current) {
                requestAnimationFrame(Step);
            }
        }
    }, [])

    return <canvas ref={canvasRef} width={width} height={height} />
}

export default GameCanvas