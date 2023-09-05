'use strict';
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
 const displayMessage = function(message){
    document.querySelector(".message").textContent = message;
 }

 document.querySelector(".check").addEventListener("click", function() {
    const guess = Number(document.querySelector(".guess").value);
    console.log(guess, typeof guess);
    if(!guess){
        displayMessage(" No number!");
    }
    else if ( guess === secretNumber){
        displayMessage("Correct Number !");
        document.querySelector("body").style.backgroundColor = "green";
        document.querySelector(".number").style.width = "30rem";
        document.querySelector(".number").style.fontSize = "7rem";
        document.querySelector(".number").textContent = secretNumber;
        if(score > highscore){
            highscore = score;
            document.querySelector(".highscore").textContent = highscore;
        }

    }
        else if( guess !== secretNumber){
            if (score > 1 ){
                /* document.querySelector(".message").textContent = guess > secretNumber ? "Too High!" : "Too Low"; */
                displayMessage(guess > secretNumber ? "Too High!" : "Too Low");
                score--;
                document.querySelector(".score").textContent = score;
            }
        }})
    /* else if ( guess > secretNumber){
        document.querySelector(".message").textContent = "Too High!";
        score--;
        document.querySelector(".score").textContent = score;
        
    }
    else if ( guess < secretNumber){
        document.querySelector(".message").textContent = "Too Low!";
        score--;
        document.querySelector(".score").textContent = score;      
    }

}); */ 

    document.querySelector(".again").addEventListener("click", function(){
        score = 20;
        secretNumber = Math.trunc(Math.random()*20) + 1;
        displayMessage("Start Guessing...")
        document.querySelector(".score").textContent = score;
        
        document.querySelector(".guess").value = " ";
        document.querySelector("body").style.backgroundColor = "#222";
        document.querySelector(".number").style.width = "15rem";
        document.querySelector(".number").style.fontSize = "6rem";
        document.querySelector(".number").textContent = secretNumber;
        document.querySelector(".number").textContent = "?";
    });