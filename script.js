let addBtn = document.querySelector(".addBtn");
let removeBtn = document.querySelector(".removeBtn");
let newModal = document.querySelector(".newModal");
let mainArea = document.querySelector(".mainArea");
let textArea = document.querySelector(".textArea");
let ticketColors = document.querySelectorAll(".modalPrColor");
let toolboxColors = document.querySelectorAll(".color");
// let ticket = document.querySelectorAll(".tickets");
let isVisible = false;
let removeFlg = false;
let colors = ["red", "blue", "yellow", "green"];
let modalPriorityColor = colors[3];

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

ticketColors.forEach((elem, indx)=>{
    elem.addEventListener("click", (e)=>{
        ticketColors.forEach((pcolor, indx) => {
            pcolor.classList.remove("border");
        })
        elem.classList.add("border");
        modalPriorityColor = elem.classList[1];
    })
})

let ticketsArr =[];

if(localStorage.getItem("my_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("my_tickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
    })
}

for(let i =0; i<toolboxColors.length; i++){
    toolboxColors[i].addEventListener("click", (e) => {
        let currToolBoxColor = toolboxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, indx) =>{
            return currToolBoxColor===ticketObj.ticketColor;
        })

        //Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket");
        for(let i =0; i<allTicketsCont.length; i++)
            allTicketsCont[i].remove();

        filteredTickets.forEach((ticketObj, indx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })

    toolboxColors[i].addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket");
        for(let i =0; i<allTicketsCont.length; i++)
            allTicketsCont[i].remove();
        
        ticketsArr.forEach((ticketObj, idx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
}

addBtn.addEventListener("click", (e)=>{
    // console.log("clicked!");
    isVisible = !isVisible;
    if(isVisible){
        newModal.style.display = "flex";
    }
    else{
        newModal.style.display = "none";
        setModalToDefault();
    }
        
})
removeBtn.addEventListener("click", (e)=>{
    removeFlg = !removeFlg;
    console.log(removeFlg);
})

newModal.addEventListener("keydown", (e)=> {
    let key = e.key;
    if(e.ctrlKey && e.key === 'x'){
        createTicket(modalPriorityColor, textArea.value);
        
        isVisible = false;
        setModalToDefault();
    }

})

function createTicket(ticketColor, ticketTask, ticketId){
   
    let id = ticketId || shortid();
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "ticket");
    newTicket.innerHTML = `
    <div class="ticketColor ${ticketColor}"></div>
    <div class="ticketId">#${id}</div>
    <div class="taskArea">${ticketTask}</div>
    <div class="ticketLock">
                <i class="fas fa-lock"></i>
            </div>
    `;
    mainArea.appendChild(newTicket);
    if(!ticketId){
        ticketsArr.push({ticketColor, ticketTask, ticketId:id});
        localStorage.setItem("my_tickets", JSON.stringify(ticketsArr));
    }
    
    handleRemove(newTicket, id);
    handleLock(newTicket, id);
    handleColor(newTicket, id);
    
}
function handleRemove(ticketToBeDel, id){
    ticketToBeDel.addEventListener("click", (e) => {
        if(removeFlg){
            let indx = getTicketIndex(id);
            ticketsArr.splice(indx, 1);
            localStorage.setItem("my_tickets", JSON.stringify(ticketsArr));
            ticketToBeDel.remove();
        }
    })
   
}
function handleLock(ticketToBeEdit, id){
    let ticketLockDiv = ticketToBeEdit.querySelector(".ticketLock");
    let ticketLockIcon = ticketLockDiv.children[0];
    let ticketTaskArea = ticketToBeEdit.querySelector(".taskArea");
    ticketLockIcon.addEventListener("click", (e)=>{

        let ticketIndx = getTicketIndex(id);

        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass);
            ticketLockIcon.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else{
            ticketLockIcon.classList.remove(unlockClass);
            ticketLockIcon.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        //modify in local storage
        ticketsArr[ticketIndx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("my_tickets", JSON.stringify(ticketsArr));
    })
}

function handleColor(ticketColChange, id){
    
    let currColorDiv = ticketColChange.querySelector(".ticketColor");
    
    currColorDiv.addEventListener("click", (e) => {
        //get ticket indx from the tickets array
        let ticketColIndex = getTicketIndex(id);


        let currColor = currColorDiv.classList[1];
        // console.log(currColor);
        let currColorIndx = colors.findIndex((colors) => {
            return colors === currColor;
        });
        currColorIndx++;
        let newColorIndx = (currColorIndx) % colors.length;
        let newTicketColor = colors[newColorIndx];
        // console.log(newColor);
        currColorDiv.classList.remove(currColor);
        currColorDiv.classList.add(newTicketColor);

        //Modify data in local storage
        ticketsArr[ticketColIndex].ticketColor = newTicketColor;
        localStorage.setItem("my_tickets", JSON.stringify(ticketsArr));
    })
    

}

function getTicketIndex(id){
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketId === id;
    })
    return ticketIdx;
}

   
function setModalToDefault(){
    newModal.style.display = "none";
    textArea.value = "";
    modalPriorityColor = colors[colors.length-1];
    ticketColors.forEach((elem, indx)=>{    
        elem.classList.remove("border");
    })
    ticketColors[ticketColors.length-1].classList.add("border");
}