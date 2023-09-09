'use strict';
const modal = document.querySelector(".modal");
const overlay =  document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
console.log(btnsOpenModal);
    const closeModal = function () {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    };
    const openModal = function () {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    };
    for(let i = 0; i < btnsOpenModal.length; i++){
        console.log("button clicked!");
        btnsOpenModal[i].addEventListener("click", openModal);
    };
    
    btnCloseModal.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    /* btnCloseModal.addEventListener("click", function(){
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    })
    overlay.addEventListener("click", function(){
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }) */
    
    document.addEventListener("keydown", function(e){
        console.log(e.key)
        if(e.key === "Escape" && !modal.classList.contains("hidden")){
            /* if(!modal.classList.contains("hidden")){ */
                /* modal.classList.add("hidden");
                overlay.classList.add("hidden") */;
                closeModal();
 
            }
        }
    );



