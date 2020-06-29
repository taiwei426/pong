import {elements} from './views/base'


var game = {
    started: 0,
    moving: 0,
    numOfTurns: 0,


    paddle0left : 0,
    paddle0top : 0,
    paddle1left : 980,
    paddle1top : 0,

    ballLeft: 500,
    ballSpeed: 100,

    player0Score: 0, 
    player1Score: 0,

    ////
    paddlewidth : 23,
    paddleheight : 60,

    boardHeight: 600, 
    boardWidth: 1000, 
    ballDiameter: 20,
}


var paddle0 = document.querySelector(elements.paddle0);
var paddle1 = document.querySelector(elements.paddle1);
var ball = document.querySelector(elements.ball);
// var winnerContainer = document.querySelector('.player-winner');

window.addEventListener('load', resetGame());

window.addEventListener('keydown', event => {
    // if(event){
    //     if(game.started === 0){
    //         resetGame();
    //         game.started = 1;
    //         setTimeout(function(){
    //             gameInit();
    //         }, 200)        
    //     }
    //     if(event.keyCode === 69 || event.keyCode === 68 || event.keyCode === 73 || event.keyCode === 75){
    //         movePaddles(event);
           
    //     } 
    // }
   
    if(event.keyCode === 69 || event.keyCode === 68 || event.keyCode === 73 || event.keyCode === 75){

        movePaddles(event);
               
    } else if (game.started === 0 && event.keyCode === 32 ){
        resetGame();
        game.started = 1;
        setTimeout(function(){
            gameInit();
        }, 200)        
    }   

    // else if(event.keyCode === 82){
    //     resetGame();
    // }
});

function resetGame(){
    
    game.ballSpeed = 100;
    game.numOfTurns = 0;

    // if winner container, remove it
    if(document.querySelector(elements.winnerContainer)){
        document.querySelector(elements.winnerContainer).parentNode.removeChild(document.querySelector(elements.winnerContainer));
    }

    // reset paddles
    game.paddle0top = (game.boardHeight / 2) - (game.paddleheight / 2);
    game.paddle1top = (game.boardHeight / 2) - (game.paddleheight / 2);
    paddle0.setAttribute('style', `top: ${game.paddle0top}px`);
    paddle1.setAttribute('style', `top: ${game.paddle1top}px`);

    // reset ball 
    game.ballLeft = (game.boardWidth / 2) - (game.ballDiameter / 2); 
    game.ballTop = (game.boardHeight / 2) - (game.ballDiameter / 2); 
    ball.setAttribute('style', `left: ${game.ballLeft}px; top: ${game.ballTop}px`);
    
    
    game.ballLeft += 0;
    
    ball.style.left = `${game.ballLeft}px`;
    
    game.verticalIncrement = 0;
    game.upOrDown = -1;
    ball.style.top = `${game.ballTop}px`;
    
}

function gameInit(){
    game.whoseTurn = Math.round(Math.random());
    removeStartInstructions();
    removePaddleBounce();
    moveBall();
}


function removeStartInstructions(){
    if(document.querySelector(elements.startInstructions)){
        document.querySelector(elements.startInstructions).parentNode.removeChild(document.querySelector(elements.startInstructions));
    }
}

// remove paddle bounce animation 
function removePaddleBounce(){
    if(paddle0.classList.contains('bounce')){
        paddle0.classList.remove('bounce');
        paddle1.classList.remove('bounce');
        var keys = Array.from(document.querySelectorAll(elements.key));
        keys.forEach(el => {
            el.classList.remove('bounce-keys');
        })
    }
}

// moves paddles
function movePaddles(event){

    removePaddleBounce();

    // player 1:  'E' - goes up
    if(event.keyCode === 69){
        if(game.paddle0top > 0){
            game.paddle0top -= 10;
            paddle0.setAttribute('style', `top: ${game.paddle0top}px`);
        }

    // player 1:  'D' - goes down    
    } else if(event.keyCode === 68){
        if(game.paddle0top < 600 - game.paddleheight){
            game.paddle0top += 10;
            paddle0.setAttribute('style', `top: ${game.paddle0top}px`);
        }

    // player 2:  'I' - goes up        
    } else if (event.keyCode === 73){
        if(game.paddle1top > 0){
            game.paddle1top -= 10;
            paddle1.setAttribute('style', `top: ${game.paddle1top}px`);
        }
    
        // player 2:  'K' - goes down    
    } else if (event.keyCode === 75){
        if(game.paddle1top < 600 - game.paddleheight){
            game.paddle1top += 10;
            paddle1.setAttribute('style', `top: ${game.paddle1top}px`);
        }
    }

}

// ball vertical movement
function moveVertically(){

    // goes down
    if (game.upOrDown === 0){

        // if top of ball is less than top of board, OR within board
        if(game.ballTop < 0 || (game.ballTop > 0 && game.ballTop < game.boardHeight - game.ballDiameter)){
            
            game.ballTop += game.verticalIncrement;  

        // if top of ball is greater than board height
        }else if (game.ballTop > game.boardHeight - game.ballDiameter ){
              
            game.upOrDown = 1;
            moveVertically(1, Math.random() * 20);     
        }
       
    // goes up
    } else if(game.upOrDown === 1){      

        // if top of ball is greater than board height, OR if it's within board
        if(game.ballTop > game.boardHeight - game.ballDiameter || (game.ballTop < game.boardHeight - game.ballDiameter && game.ballTop > 0)){
            
            game.ballTop -= game.verticalIncrement;
            
        // if top of ball is smaller than top of board    
        } else if (game.ballTop < 0 ){
            game.upOrDown = 0;
            moveVertically(0, Math.random() * 20);     
        }
    }
    ball.style.top = `${game.ballTop}px`;
}



function moveBall(move){

    game.verticalIncrement = Math.random() * 10;
    
    game.upOrDown = Math.round(Math.random());

    if (game.whoseTurn === 1){

        function myLoop(){

            setTimeout(function(){        
                      
                game.ballLeft += 20;

                moveVertically();

                // if ball's position is at player 1's end
                if(game.ballLeft >= game.boardWidth - game.ballDiameter){
                    
                    // if ball's within paddle's height
                    if(game.paddle1top -10 <= game.ballTop && game.paddle1top + 60 >= game.ballTop){
                        
                        game.ballLeft = game.boardWidth - game.ballDiameter - game.paddlewidth;
                        game.whoseTurn = 0;
                        moveBall();
                    
                    // if ball's not within paddle's height
                    } else {

                        game.ballLeft = game.boardWidth - game.ballDiameter;
                        game.whoseTurn = 0;
                        playerWins();
                    }
                
                // if ball hasn't reached player 1's end
                } else if (game.ballLeft < 980){
                    myLoop();
                }
                
                ball.style.left = `${game.ballLeft}px`;

            }, game.ballSpeed)
        }

        myLoop();      
        game.numOfTurns += 1;
        
    } else if (game.whoseTurn === 0){

        function myLoop(){
            
            setTimeout(function(){
                
                game.ballLeft -= 20;
                
                moveVertically(game.upOrDown, game.verticalIncrement);

                // if ball's position is at player 0's end
                if(game.ballLeft <= 20){

                    // if ball's within paddle's height
                    if(game.paddle0top -10 <= game.ballTop && game.paddle0top + 60 >= game.ballTop){
                        
                        game.ballLeft = 20;
                        game.whoseTurn = 1;
                        moveBall();
                    
                    // if ball's not within paddle's height
                    } else {
                        
                        game.ballLeft = 0;
                        game.whoseTurn = 1;
                        playerWins();
                    }
                
                // if ball hasn't reached player 0's end
                } else if (game.ballLeft > 20){
                    myLoop();
                }

                ball.style.left = `${game.ballLeft}px`;

            }, game.ballSpeed)
        }

        myLoop();    
        game.numOfTurns += 1;    
    }
    
    // speed increases after every round
    game.ballSpeed = game.ballSpeed - Math.floor(game.numOfTurns/2);
    console.log(game.numOfTurns, game.ballSpeed)
}

function playerWins(){
    game.started = 0;
    
    if ( game.whoseTurn === 0){
        game.player0Score += 1
        document.querySelector(elements.score0).innerHTML = game.player0Score;
    } else { 
        game.player1Score += 1;
        document.querySelector(elements.score1).innerHTML = game.player1Score;
    }

    var html = `
        <div class="player-winner">
            <div class="winner-text">
                player ${game.whoseTurn === 0 ? '1' : '2'} wins
            </div>
            <div class="start-game"></div>
        </div>
    `
    document.querySelector(elements.container).insertAdjacentHTML('beforeend', html);

    console.log(game.player0Score, game.player1Score);

    ball.style.transition = 'none';
}


/// TO DO
// multiplayer vs single player
// different levels? easy, medium, hard?
// sticky on 2nd player
// clean up code? - global controller, visual, data controllers?


// ball z index - is getting covered by text
// paddles are getting clipped when they're on the text
