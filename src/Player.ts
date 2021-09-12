import { Iinput } from "./components/GameCanvas";

type animationState = "idle" | "walk" | "crouch";

interface IAnimations {
    still: {
        [state: string] : Array<{sx: number, sy: number}>
    },
    right: {
        [state: string] : Array<{sx: number, sy: number}>
    },
    left: {
        [state: string] : Array<{sx: number, sy: number}>
    }
}

class Player {
    //  let gravity = 0.0981
    image;
    x;
    y;
    lastX;
    
    r = 200;
    spriteWidth=31;

    // TODO ANIMATIONS
    animations: IAnimations = {
        still: {
            idle: [{sx: 0, sy: 0}],
            crouch: [{sx: 3, sy: 0}]
        },
        right: {
            idle: [{sx: 0, sy: 1}],
            walk: [{sx: 0, sy: 1}, {sx: 1, sy: 1}, {sx: 2, sy: 1}, {sx: 3, sy: 1}],
            crouch: [{sx: 3, sy: 0}]
            
        },
        left: {
            idle: [{sx: 0, sy: 2}],
            walk: [{sx: 0, sy: 2}, {sx: 1, sy: 2}, {sx: 2, sy: 2}, {sx: 3, sy: 2}],
            crouch: [{sx: 3, sy: 0}]
        }
        
    }

    frameDuration = 0.16;
    
    // Initial animation
    activeFrame = 0;
    sinceLastFrame = 0;
    lastFrameTime = new Date().getTime();
    animationDirection = this.animations.right;
    animationState: animationState = "idle";

    speed = 12;
    xVelocity = 0;
    yVelocity = 0;
    gravity = 9.81 * 100;
    jumpHeight = 300;
    friction = 0.6;
    crouchFriction = 0.99;
    maxSpeed = 100;
    crouchMaxSpeed = 400;
    active = true;
    crouching = false;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.lastX = x;
        this.y = y
        this.image = new Image();
        this.image.src = "Penguin.png"
        this.image.onload = () => {
            console.log("IMAGE LOADED");
        }
        
    }
    // Player variables

    step = (input: Iinput, delta: number) => {
        const {leftKey, rightKey, upKey, downKey} = input;
        //Movement
        if(this.active) {

            //Check if player is trying to Crouch
            if(!downKey) {
                this.crouching = false;
            }

            // Horizontal movement
            if (downKey && this.y >= window.innerHeight - this.r) {
                if(this.crouching === false) {
                    this.crouching = true;
                    if(Math.abs(this.xVelocity) > 10)
                        this.xVelocity *= 10;

                } else {
                    this.xVelocity *= this.crouchFriction;
                }



            } else if ((!leftKey && !rightKey && downKey) || (!leftKey && !rightKey) || (leftKey && rightKey)) {
                // Slow down
                this.xVelocity *= this.friction;
                
            } else if (rightKey) {
                // Add friction if travelling in the opposite direction
                if(this.xVelocity < 0)
                    this.xVelocity *= this.friction;
                // Right
                this.xVelocity++; 
            } else if (leftKey) {
                // Add friction if travelling in the opposite direction
                if(this.xVelocity > 0)
                    this.xVelocity *= this.friction;
                // Left
                this.xVelocity--; 
            }
            // Vertical movement
            if (upKey && this.y === window.innerHeight - this.r) {
                // Check if on ground
                this.yVelocity *= -Math.sqrt(this.jumpHeight * -2 * -this.gravity); 
            }
            // Apply gravity
            this.yVelocity += this.gravity * (delta / 1000);
            // Correct speed
            if(this.crouching) {
                if(this.crouching && this.xVelocity > this.crouchMaxSpeed) {
                    this.xVelocity = this.crouchMaxSpeed;
                } else if(this.crouching && this.xVelocity < -this.crouchMaxSpeed) {
                    this.xVelocity = -this.crouchMaxSpeed;
                }
            } else {
                if( this.xVelocity > this.maxSpeed) {
                    this.xVelocity = this.maxSpeed
                } else if (this.xVelocity < -this.maxSpeed) {
                    this.xVelocity = -this.maxSpeed
                }
            }


            this.x += this.xVelocity * this.speed * delta / 1000; 
            this.y += this.yVelocity * delta / 1000;
            if (this.y >= window.innerHeight - this.r) {
                this.y = window.innerHeight - this.r
                this.yVelocity = 1;
            }
        }
    }

    draw = (context: CanvasRenderingContext2D, scrollCoordinates: {x: number, y: number}) => {
        //console.log(this.x, this.y)

        let newState = this.animationState;
        let newDirection = this.animationDirection;

        if(this.xVelocity < 0.01 && this.xVelocity > -0.01) {
            newDirection = this.animations.still;
            newState = "idle";
        }
        else if(this.xVelocity > 0) {
            newDirection = this.animations.right;
            newState = "walk";
        }
        else if (this.xVelocity < 0) {
            newDirection = this.animations.left;
            newState = "walk";
        }

        if(this.crouching) {
            newState = "crouch";
        }

        if(newDirection !== this.animationDirection || newState !== this.animationState) {
            console.log(newState)
            this.activeFrame = 0;
        }
        
        this.animationDirection = newDirection;
        this.animationState = newState;
        


        

        //Change frame
        this.sinceLastFrame += (new Date().getTime() - this.lastFrameTime) / 1000;

        if(this.sinceLastFrame > this.frameDuration) {
            this.sinceLastFrame = 0;
            this.activeFrame++;
        }

        const direction = this.animationDirection
        const animationState = this.animationState
        const animationFrames = direction[animationState];
        const frame = animationFrames[this.activeFrame % animationFrames.length];

        if(this.x > scrollCoordinates.x + window.innerWidth - 200 - this.r  || this.x < scrollCoordinates.x + 200) {
            scrollCoordinates.x -= this.lastX - this.x;
            
        }
        this.lastX = this.x;

        context.drawImage(
            this.image, 
            this.spriteWidth * frame.sx, 
            this.spriteWidth * frame.sy, 
            this.spriteWidth, 
            this.spriteWidth, 
            this.x, 
            this.y, 
            this.r, 
            this.r
        );
        this.lastFrameTime = new Date().getTime();
        
    }

}

export { Player };