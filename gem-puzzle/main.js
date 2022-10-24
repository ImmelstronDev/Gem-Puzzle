const DIRECTIONS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

function renderBoard(board, canvas) {    
    const columns = board.length;
    const rows = board[0].length;
    
    
    const width = Math.floor(canvas.width / rows)
    const height = Math.floor(canvas.height / columns)

    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height)
    

    for(let i = 0; i < columns; i++){
        for(let j = 0; j < rows; j++){
            
            let x = j * width;
            let y = i * height

            if (board[i][j]){
                context.fillStyle = 'gold';
                context.strokeRect(x, y, width, height )
                
                context.font = "20px serif"
                context.textAlign = 'center';                
                context.fillText(board[i][j], x + Math.floor(width / 2), y + Math.floor(height / 2) )
            } else {
                context.fillStyle = 'gray';
                context.fillRect(x, y, width, height)
            }
        }
    }
}


function calc(x, y, columns, rows, width, height ) {
    const tileWidth = Math.floor(width / columns)
    const tileHeight = Math.floor(height / rows)

    let column = Math.floor(x / tileWidth);
    let row = Math.floor(y / tileHeight)

   

    return {column: column, row: row}
}



function renderBoardWithAnimation(board, moveInfo, canvas) {
    const columns = board.length;
    const rows = board[0].length;
    
    const width = Math.floor(canvas.width / rows)
    const height = Math.floor(canvas.height / columns)

    const context = canvas.getContext('2d');
    const start = moveInfo.start;
    const end = moveInfo.end;

    const y = Math.min(start.row, end.row) * height
    const x = Math.min(start.column, end.column) * width

    const offsetX = end.column - start.column;
    const offsetY = end.row - start.row;
    

    const fieldWidth = (Math.abs(offsetX) + 1) * width;
    const fieldHeight = (Math.abs(offsetY) + 1) * height;

    const startTailX = start.column * width;
    const startTailY = start.row * height;
    const endTailX = startTailX + offsetX * width;
    const endTailY = startTailY + offsetY * height;

    let currentX = startTailX;
    let currentY =  startTailY;

    const stepX = 10 * offsetX;
    const stepY = 10 * offsetY;    

    let startTimerAnimation = null


    function renderStepTile(timestamp) {
        if(startTimerAnimation === null) {
            startTimerAnimation = timestamp;
        }

        if(Math.abs(currentX - endTailX) > Math.abs(stepX) || Math.abs(currentY - endTailY) > Math.abs(stepY) ) {
            
            context.fillStyle = 'gray';
            context.fillRect(x, y, fieldWidth, fieldHeight)

            context.fillStyle = 'rgb(6, 98, 236)';
            context.fillRect(currentX, currentY, width, height)
            context.fillStyle = 'gold';
            context.strokeRect(currentX, currentY, width, height)
            context.fillText(board[end.row][end.column], currentX + Math.floor(width / 2), currentY + Math.floor(height / 2) )

            currentX += stepX;
            currentY += stepY;

           
            requestAnimationFrame(renderStepTile)
        } else {
            renderBoard(board, canvas)
           
            return
        }
        
    }
    requestAnimationFrame(renderStepTile)
}


 
function move(board, tileCoord){
    
    let column = tileCoord.column;
    let row = tileCoord.row;
    let value = board[row][column];

   
    
    const moveInfo = {
        moved: false
    }

    if(!value){
        return moveInfo;
    }
    for(let i = 0; i < DIRECTIONS.length; i++){
    let direction  = DIRECTIONS[i];
    let newColumn = column + direction[0];
    let newRow = row + direction[1];
    if(newRow < 0 || newRow > board.length - 1 || newColumn < 0 || newColumn > board[0].length - 1){
        continue
    }

    let neighbor = board[newRow][newColumn];
    if(!neighbor){
        board[newRow][newColumn] = value
        board[row][column] = null

        moveInfo['start'] = tileCoord
        moveInfo['end'] = {
            row:newRow ,
            column: newColumn
        }
        moveInfo['moved'] = true
        break;
    }
    
   }

   
   return moveInfo
}

function startTimer() {
    return setInterval(
        () => {
            const current = new Date()
            timerMs += current.getTime() - start.getTime()
            start = current
        },
        500);
}

function fillAndShuffle (size){
    let arr = [];
    for(let i = 0; i < size * size; i++){
        if(i === size * size -1) {
            arr.push(null)
            
        } else {
            arr.push(i + 1);
        }
 
    }    
    arr.sort(() => Math.random() - 0.5)

    for(let i = 0; i < size * size - 1; i++) {
        if(arr[i] === i + 1) {
            if(i + 1 === size * size - 2) {
                const tmp = arr[i]
                arr[i] = arr[0];
                arr[0] = tmp
                break;
            }
            continue;
        } else {
            break;
        }
    }

    let pairCount = 0;
    
    for(let i = 0; i < arr.length; i++) {
        const cur = arr[i]
        if(cur === null) {
            pairCount += Math.floor(i / size) + 1;
            continue
        }
        for(let j = i + 1; j < arr.length; j++){
            if(arr[j] === null) {
                continue
            }

            if(arr[i] > arr[j]) {
                pairCount += 1;
            }
        }
    }

    if(pairCount % 2 === 1) {
        let index = 0;
        while(arr[index] === null || arr[index + 1] === null) {
            index++;
        }
        let buffer = arr[index];
        arr[index] = arr[index + 1]
        arr[index + 1] = buffer
    }
    

    let newBoard = new Array();

    for(let k = 0; k < size; k++){
        const row = []
        for(let l = 0; l < size; l++){
            row.push(arr[size * k + l])
        }
        newBoard.push(row)
    }
    
    return newBoard

    // return [[1, 2, 3 ,4], [5, 6, 7 ,8], [9, 10, 11, 12], [13, null, 14, 15]]
}

// function fillAndShuffle (size){
//     let arr = [];
//     for(let i = 0; i < size * size; i++){
//         if(i === size * size -1){
//             arr.push(null)
            
//         }else{
//             arr.push(i+1);
//         }
 
//     }    
//     arr.sort(() => Math.random() - 0.5)
//    

//     let newBoard = new Array();    

//     for(let k = 0; k < size; k++){
//         const row = []
//         for(let l = 0; l < size; l++){
//             row.push(arr[size * k + l])
//         }
//         newBoard.push(row)
//     }
//    
//     return newBoard
// }

setInterval(() => {
    let timeValue = Math.floor(timerMs / 1000);
    let minutes = Math.floor(timeValue / 60);
    let seconds = Math.floor(timeValue % 60)

    timer.textContent = [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':');
    counter.textContent = movesCount

    
}, 777);

function clickBoardHandler(evt) {
    let timeValue = Math.floor(timerMs / 1000);
    let minutes = Math.floor(timeValue / 60);
    let seconds = Math.floor(timeValue % 60)
    audio.pause();
    audio.currentTime = 0;
    let x = evt.offsetX;
    let y = evt.offsetY;
    const rows = board.length;
    const columns = board[0].length;

    const tileCoord =  calc(x, y, columns, rows, canvas.width, canvas.height )

   
   const moveInfo = move(board, tileCoord);
   
   if(moveInfo.moved) {
    renderBoardWithAnimation(board, moveInfo, canvas);
    movesCount++;
    if(soundBox.checked){
        audio.play();  
    }  
    
   }

  if(winCondition(board)){    
    stopResumeBtn.click();
    winWindow.classList.toggle('hidden');
    shadow.classList.toggle('hidden');
    messageWin.textContent = `Hooray! You solved the puzzle in ${[minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':')} and ${movesCount} moves!`
    saveResults(movesCount, timerMs, size)
  }

}



function winCondition(board) {

    let counter = 1
    for(let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if(counter === board.length * board.length) {
                break;
            }
            if(board[i][j] === counter){
                counter++
            } else { 
                return false
            }
        }
    }
    return true;
}








function saveResults(moves, seconds, frame) {
    const frameKey = frame + "x" + frame;   
    const results = JSON.parse(localStorage.getItem('results'))
    const frameResults = results[frameKey]    

    for(let i = 0; i < frameResults.length; i++) {
        const value = frameResults[i]    
        if(moves > value.moves) {
            continue;
        } else if (moves === value.moves ){
            if(seconds > value.seconds){
                continue
            } else {
                frameResults.splice(i, 0, {moves: moves, seconds: seconds});
                break;
            }
        } else if (moves < value.moves) {
            frameResults.splice(i, 0, {moves: moves, seconds: seconds});
            break;
        }        
    }

    if(frameResults.length === 0){
        frameResults.push({moves: moves, seconds: seconds})
    }
    
    if (frameResults.length > 10) {
        frameResults.splice(frameResults.length - 1, 1)
    }    

    localStorage.setItem('results', JSON.stringify(results))


}


function toggleStopResumeBtn(stopResumeBtn, saveBtn) {
    const state = stopResumeBtn.textContent;
    if(state === 'Resume') {
        stopResumeBtn.textContent = 'Stop';
        saveBtn.disabled = true;
    }
}


function stopResumeHandler(evt) {
    const btn = evt.target;
    const state = btn.textContent;
    if(state === 'Stop') {
        clearInterval(timerId);
        timerId = -1
        canvas.removeEventListener('click', clickBoardHandler)
        btn.textContent = 'Resume'
        saveBtn.disabled = false;
    } else {
        start = new Date() 
        canvas.addEventListener('click', clickBoardHandler);
        timerId = startTimer()
        btn.textContent = 'Stop';
        saveBtn.disabled = true;
    }
}

function startGame(boardSize) {
    board = fillAndShuffle(boardSize);
    timerMs = 0;
    start = new Date();
    movesCount = 0;
    renderBoard(board, canvas);
    if(timerId < 0) {
        timerId = startTimer()
    }
    toggleStopResumeBtn(stopResumeBtn, saveBtn)   
}

function transferToLocalStorage() { 
    let saveFile = new Object
    saveFile.size = size;
    saveFile.timerMs = timerMs;
    saveFile.timerId = timerId;
    saveFile.board = board;
    saveFile.movesCount = movesCount;

   

    localStorage.setItem('saveFile', JSON.stringify(saveFile))

    loadBtn.style.display = 'inline'
}









const timer = document.querySelector('#time')
const counter = document.querySelector('#counter')
const canvas = document.querySelector('canvas');
const shuffleBtn = document.querySelector('#shuffle_btn')
const stopResumeBtn = document.querySelector('#stop_btn')
const saveBtn = document.querySelector('#save_btn')
const loadBtn = document.querySelector('#load_btn')
const resultBtn = document.querySelector('#result_btn')
const resultCells = document.querySelectorAll('.cell')
const winWindow = document.querySelector('.win-panel');
const okBtn = document.querySelector('#ok');
const messageWin = document.querySelector('#message__about_win')
const audio = document.querySelector("#audio");
const soundBox = document.querySelector('#sound_box')
const table = document.querySelector('.result-panel')
const shadow = document.querySelector('.layer')

const frameBtns = document.querySelectorAll('.btn__frame')
const frameSize = document.querySelector('#frame-size')


let size = 4;
let timerMs = 0;
let start = null
let timerId = -1
let board = null;
let movesCount = 0;


resultBtn.addEventListener('click', () => {    
    
    table.classList.toggle('hidden')

    const frameKey = size + "x" + size;   
    const results = JSON.parse(localStorage.getItem('results'))
    const frameResults = results[frameKey] 
    for(let i = 0; i < frameResults.length; i++){
        let time  = frameResults[i].seconds
        let timeValue = Math.floor(time / 1000);
        let minutes = Math.floor(timeValue / 60);
        let sec = Math.floor(timeValue % 60)
        resultCells[i].textContent = (i + 1).toString()  +' | '+ frameResults[i].moves.toString() + ' | ' + [minutes.toString().padStart(2, '0'), sec.toString().padStart(2, '0')].join(':') + ' | ' + frameKey
    }
})

stopResumeBtn.addEventListener('click', stopResumeHandler)
canvas.addEventListener('click', clickBoardHandler)
shuffleBtn.addEventListener('click', () => {
    startGame(size)
})
saveBtn.addEventListener('click',transferToLocalStorage)
loadBtn.addEventListener('click', () => {
    let file = JSON.parse(localStorage.getItem('saveFile'))
   
    size = file.size
    timerMs = file.timerMs
    start = new Date()
    timerId = startTimer()
    board = file.board
    movesCount = file.movesCount
    renderBoard(board, canvas);      
    toggleStopResumeBtn(stopResumeBtn, saveBtn)
    
    canvas.addEventListener('click', clickBoardHandler)

})
okBtn.addEventListener('click', () => {
    winWindow.classList.toggle('hidden')
    shadow.classList.toggle('hidden')    
    stopResumeBtn.click();
    shuffleBtn.click();
})

for (const btn of frameBtns) {
    btn.addEventListener('click', () =>{
        

        size = btn.dataset.value
       
        startGame(size)
        frameSize.textContent = size + 'x' + size
    })
}
if(localStorage.getItem('saveFile') === null){
    loadBtn.style.display = 'none'
}

if(localStorage.getItem('results') === null){
    localStorage.setItem('results', JSON.stringify({        // TODO закинуть в startgame отдельной функцией
        "3x3": [],
        "4x4": [],
        "5x5": [],
        "6x6": [],
        "7x7": [],
        "8x8": []
    }))
}

startGame(size)









