
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

canvas.width = 448
canvas.height = 400

//Game Variables
let counter = 0


//BALL VARIABLES
const ballRadius = 3;

//Ball Position
let x = canvas.width / 2
let y = canvas.height - 30

//Ball Speed

let dx = -3
let dy = -3

//PADDLE VARIABLES

const paddleSensitivity = 8


    const paddleHeight = 10;
    const paddleWidth = 50;



    let paddleX = (canvas.width - paddleWidth) / 2
    let paddleY = canvas.height - paddleHeight - 10

    let rightPressed = false
    let leftPressed = false



//BRICKS VARIABLES

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16; 
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];


const BRICK_STATUS = { 
    ACTIVE: 1,
    DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++){
    bricks[c] = [] //inicializamos con array vacio
for (let r = 0; r < brickRowCount; r++){
    const brickX = c * (brickWidth + brickPadding) +
    brickOffsetLeft
    const brickY = r * (brickHeight + brickPadding) +
    brickOffsetTop
    //asignar color
    const random = Math.floor(Math.random() * 8)

    bricks[c][r] = {
        x:brickX,
        y:brickY, 
        status:BRICK_STATUS.ACTIVE, 
        color: random
}
}
}



function drawBall(){

    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()

}



function drawPaddle (){

//cambiar paddle
    ctx.drawImage(
        $sprite, //img
        29, //coordenada X de recorte
        174, //coordenada y de recorte
        paddleWidth, //tama;o de recorte
        paddleHeight, //tama;o de recorte
        paddleX, //posicion x del dibujo
        paddleY, //posicion y del dibujo
        paddleWidth, //ancho del dibujo
        paddleHeight //alto del dibujo

    )

}

function drawBricks(){
    for (let c = 0; c < brickColumnCount; c++){
    for (let r = 0; r < brickRowCount; r++){
        const currentBrick = bricks[c][r]
        if (currentBrick.status === BRICK_STATUS.DESTROYED)
            continue;
        
        const clipX = currentBrick.color * 32
        ctx.drawImage(
            $bricks,
            clipX,
            0,
            brickWidth,
            brickHeight,
            currentBrick.x,
            currentBrick.y,
            brickWidth,
            brickHeight
            
        )


    }
    }

}

function drawUI(){
    ctx.fillText(`FPS: ${FramePerSec}`, 5, 10)
}





function collisionDetection(){ 
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED)
                continue; 
            const isBallSameXAsBrick = 
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth
                
            const isBallSameYAsBrick = 
                y > currentBrick.y &&
                y < currentBrick.y + brickHeight
            
            
            
                if ( isBallSameXAsBrick && isBallSameYAsBrick){
                    dy = -dy
                    currentBrick.status = BRICK_STATUS.DESTROYED
                }

        }}
}

function ballMovement (){
    //rebote laterial
    if (
        x + dx > canvas.width - ballRadius || 
        x + dx < ballRadius
    ){
        dx= -dx
    }

    //rebote superior

    if (
        y + dy <ballRadius
    ){
        dy = -dy
    }

    //ball collision
    const isBallSameXAsPaddle = 
    x > paddleX &&
    x < paddleX + paddleWidth

    const isBallTouchingPaddle =
    y + dy > paddleY


    if( isBallTouchingPaddle && isBallSameXAsPaddle

    ){
        dy = -dy
    }    
    else if (
        y + dy > canvas.height - ballRadius || y + dy > paddleY + paddleHeight
    ){
        gameOver = true
        console.log('Game Over')
        document.location.reload()

    }



    x += dx
    y += dy

}
function paddleMovement(){ 
    if (rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += paddleSensitivity
    } else if (leftPressed && paddleX > 0){
        paddleX -= paddleSensitivity
    }


}

function cleanCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

}

function initEvents (){

    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event){
        const {key} = event
        if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd'){
            rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a'){
        leftPressed = true
    }
    }

    function keyUpHandler(event){
        const {key} = event
        if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd'){
            rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a'){
        leftPressed = false
    }

    }
}

const fps = 60

let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps
let frames = 0
let FramePerSec = fps

let gameOver = false;



function draw(){

    if (gameOver)return

    window.requestAnimationFrame(draw)
    const msNow = window.performance.now()
    const msPassed = msNow - msPrev

    if(msPassed < msPerFrame) return

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    frames ++

    if (msFPSPrev < msNow)
    {
        msFPSPrev = window.performance.now() + 1000
        FramePerSec = frames;
        frames = 0;
    }


    cleanCanvas()
    drawBall()
    drawPaddle()
    drawBricks()
    drawUI()
//drawSCore()
//drawLive()

//Colisiones y Movimientos
    collisionDetection()
    ballMovement()
    paddleMovement()

    window.requestAnimationFrame(draw)

}

draw()
initEvents()