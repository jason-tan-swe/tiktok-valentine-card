hasPressedYes = false;
let cursorX = -1;
let cursorY = -1;

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}

function isOverlapping(rectA, rectB) {
    return !(rectA.right < rectB.left || 
        rectA.left > rectB.right || 
        rectA.bottom < rectB.top || 
        rectA.top > rectB.bottom)
}

function isOffScreen(rect) {
    return (
        rect.right > window.innerWidth || // Right edge out
        rect.left < 0 ||                  // Left edge out
        rect.bottom > window.innerHeight || // Bottom out
        rect.top < 0                      // Top out
    );
};


function displayContent() {
     const content = document.getElementById('content');
    const adjustButtons = document.querySelector('.adjust-buttons');
    
    content.classList.add('visible');
    adjustButtons.classList.add('hidden');
}


function randomizeLocation() {
    // get the current parent container size
    const screenContainer = document.getElementById('surrounding-box');
    const noBtn = document.getElementById('no-button');
    const yesBtn = document.getElementById('yes-button');

    const containerWidth = screenContainer.offsetWidth;
    const containerHeight = screenContainer.offsetHeight;

    // randomize the x and y, such that they are atleast more than 5 away of the current location
    let gotoX = -1;
    let gotoY = -1;
    const minDistanceFromCursor = 100; // pixels
    while (gotoX < 0 || gotoY < 0 || 
          (cursorX !== -1 && cursorY !== -1 && 
          Math.sqrt(Math.pow(gotoX - cursorX, 2) + Math.pow(gotoY - cursorY, 2)) < minDistanceFromCursor)) { 
        gotoX = Math.floor(Math.random() * (containerWidth )); // account for padding
        gotoY = Math.floor(Math.random() * (containerHeight )); // account for padding
    }

    
    // place the no-button onto that spot
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${gotoX}px`;
    noBtn.style.top = `${gotoY}px`;
    console.log('isoverlap? off?', isOverlapping(noBtn.getBoundingClientRect(), yesBtn.getBoundingClientRect()), isOffScreen(noBtn.getBoundingClientRect()));
    if (isOverlapping(noBtn.getBoundingClientRect(), yesBtn.getBoundingClientRect()) || isOffScreen(noBtn.getBoundingClientRect())) {
        randomizeLocation(); // recursive call until we aren't overlapping
    }    
}

document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    const noBtn = document.getElementById('no-button');
    const yesBtn = document.getElementById('yes-button');
    const adjustButtons = document.querySelector('.adjust-buttons');

    // Set initial positions
    adjustButtons.style.position = 'relative';
    
    // Fix Yes button position
    const originalYesPos = yesBtn.getBoundingClientRect();
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = `${originalYesPos.left - adjustButtons.getBoundingClientRect().left}px`;
    yesBtn.style.top = '0';
    
    // Set No button initial position
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${originalYesPos.right - adjustButtons.getBoundingClientRect().left + 8}px`; // 8px is the gap
    noBtn.style.top = '0';
});

const noBtn = document.getElementById('no-button')
const yesBtn = document.getElementById('yes-button')

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

yesBtn.addEventListener('click', () => {
    displayContent();
    hasPressedYes = true;
});

noBtn.addEventListener('mouseover', () => {
    if (!hasPressedYes) randomizeLocation();
});
noBtn.addEventListener('mouseleave', () => {
});
noBtn.addEventListener('click', () => {
    if (!hasPressedYes) randomizeLocation();
});
