const board = document.getElementById("game_board");
const game_status = document.getElementById("game_status");
const restart_button = document.getElementById("restart_button");
const columns = 8;
const rows = 8;
let selectedPiece = null;
let currentPlayer = 'white';
let whitePieces = 12;
let blackPieces = 12;
let isMultiCapture = false;

function createBoard(){
    board.innerHTML='';
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < columns; col++){
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(row+col) %2 === 0 ? 'white' : 'black';
            square.dataset.row = row;
            square.dataset.col = col;
            board.appendChild(square);

            if((row + col) % 2 !== 0 && (row < 3 || row > 4)){
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(row < 3 ? 'black' : 'white');
                piece.dataset.row = row;
                piece.dataset.col = col;
                
                square.appendChild(piece);
            }
            square.addEventListener('click', handleSquareClick);
        }
    }
}
function handleSquareClick(e){
    const square = e.target.classList.contains('square') ? e.target : e.target.parentElement;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if(selectedPiece){
        if(selectedPiece === square.firstChild){
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        }else if(!square.firstChild && isValidMode(selectedPiece, row, col)){
            movePiece(selectedPiece, row, col);
        }
    }else if(square.firstChild && square.firstChild.classList.contains('piece') && square.firstChild.classList.contains(currentPlayer)){
        selectPiece(square.firstChild);
    }
}

function selectPiece(piece){
    if(selectedPiece){
        selectedPiece.classList.remove('selected');
    }
    piece.classList.add('selected');
    selectedPiece = piece;
}

function isValidMode(){
    const oldRow = parseInt(piece.dataset.row);
    const oldCol = parseInt(piece.dataset.col);
    const moveRow = row - oldRow;
    const moveCol = col - oldCol;

    const captureMoves = getAvailableCaptures(currentPlayer);
    const isCapture = Math.abs(moveRow) === 2  && Math.abs(moveCol) === 2;

    if(captureMoves.lenth > 0 && !isCapture){
        return false;
    }
    if(!piece.classList.contains('king')){
        if((currentPlayer === 'white' && moveRow > 0) || (currentPlayer === 'black' && moveRow < 0)){
            return false;
        }
    }
    if(isCapture){
        const middleRow = oldRow + moveRow / 2;
        const middleCol = oldCol + moveCol / 2;
        const middleSquare = document.querySelector(`[data-row='${middleRow}'][data-col='${middleCol}']`);
        if(middleSquare.firstChild && middleSquare.firstChild.classList.contains('piece') && !middleSquare.firstChild.class.contains(currentPlayer)){
            return true;
        }
    }else if(Math.abs(moveRow) === 1 && Math.abs(moveCol) === 1){
        return true;
    }
    return false;
}

function movePiece(piece, row, col){
    const oldRow = parseInt(piece.dataset.row);
    const oldCol = parseInt(piece.dataset.col);
    const targetSquare = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    const moveRow = row - oldRow;
    const moveCol = col - oldCol;

    const isCapture = Math.abs(moveRow) === 2 && Math.abs(moveCol) === 2;
    if(isCapture){
        const middleRow = oldRow + moveRow / 2;
        const middleCol = oldCol + moveCol / 2;
        const middleSquare = document.querySelector(`[data-row='${middleRow}' [data-col='${middleCol}']]`);
        if(middleSquare.firstChild && middleSquare.firstChild.classList.contains('piece') && !middleSquare.firstChild.classList.contains(currentPlayer)){
            middleSquare.removeChild(middleSquare.firstChild);
            currentPlayer === 'white' ? blackPieces-- : whitePieces--;
            performMove(piece, targetSquare, row, col);

            const furtherCaptures = getAvailableCapturesForPiece(piece);
            if(furtherCaptures.length > 0){
                isMultiCapture = true;
                selectPiece(piece);
                return;
            }
        }
    } else{
        performMove(piece, targetSquare, row, col);
    }
    if(!isMultiCapture){
        endTurn();
    }else{
        isMultiCapture = false;
    }
}
function performMove(piece, targetSquare, row, col){
    targetSquare.appendChild(piece);
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.classList.remove('selected');
    selectPiece = null;

    if((row === 0 && currentPlayer === 'white') || (row === 7 && currentPlayer === 'black')){
        piece.classList.add('king');
    }
    checkWinCondition();
}
//czarna dziura
//ciemny