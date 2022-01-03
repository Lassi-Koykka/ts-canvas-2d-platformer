import { useEffect, useRef } from "react"
import "./GameCanvas.css"
import GroundBlock from "../GroundBlock";
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

    let scrollCoordinates = { x: 0, y: 0 };

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
    let ground: GroundBlock;


    // const handleResize = () => {
    //     let nativeWidth = 1024;  // the resolution the games is designed to look best in
    //     let nativeHeight = 768;

    //     // the resolution of the device that is being used to play
    //     let deviceWidth = window.innerWidth;  // please check for browser compatibility
    //     let deviceHeight = window.innerHeight;

    //     let scaleFitNative = Math.min(deviceWidth / nativeWidth, deviceHeight / nativeHeight);


    //     ctx.canvas.style.width = deviceWidth + "px";
    //     ctx.canvas.style.height = deviceHeight + "px";
    //     ctx.canvas.width = deviceWidth;
    //     ctx.canvas.height = deviceHeight;

        
    //     // ctx is the canvas 2d context 
    //     ctx.setTransform(
    //         scaleFitNative, 0, // or use scaleFillNative 
    //         0, scaleFitNative,
    //         Math.floor(deviceWidth / 2),
    //         Math.floor(deviceHeight / 2)
    //     );
    //     ctx.imageSmoothingEnabled = false;
    // };

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
        } else if (e.key === "s" || e.key === "ArrowDown") {
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

        // for(let i = 0; i < 1000; i++) {
        //     ctx.fillStyle =  i % 2 === 0 ? `rgb(${ Math.floor(255-i*255* 0.01) }, ${ Math.floor(i*255* 0.01) }, ${ Math.floor(255*i* 0.01) })` : "black";
        //     ctx.fillRect(100*i, 0, 200, height); 
        // }

        // Player draw
        ground.draw(ctx);
        player.draw(ctx, scrollCoordinates);

    }

    useEffect(() => {
        //initialize
        if (canvasRef.current) {

            contextRef.current = canvasRef.current.getContext('2d')!;
            contextRef.current.imageSmoothingEnabled = false;
            ctx = contextRef.current;

            // window.addEventListener("resize", () => handleResize());

            setupInputs();

            player = new Player(400, 400);
            ground = new GroundBlock(500, 700, 100, 20);

            if (contextRef.current) {
                requestAnimationFrame(Step);
            }
        }
    }, [])

    return <canvas ref={canvasRef} width={width} height={height} className="canvas" />
}

export default GameCanvas