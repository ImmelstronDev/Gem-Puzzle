
const TAG_BTN = "button";
const TAG_UL = "ul";
const TAG_LI = "li"
const TAG_INPUT = 'input'
const TAG_LABEL = 'label'
const TAG_DIV = 'div';
const TAG_SECTION = 'section'
const TAG_MAIN = 'main'
const TAG_P = 'p'
const TAG_SPAN = 'span'
const TAG_CANVAS = 'canvas'
const TAG_AUDIO = 'audio'


const controllers = [
    {
        id: 'shuffle_btn',
        classes: ['btn'],
        text: 'Shuffle and Start',
        disabled: false
    },
    {
        id: 'stop_btn',
        classes: ['btn'],
        text: 'Stop',
        disabled: false
    },
    {
        id: 'save_btn',
        classes: ['btn'],
        text: 'Save',
        disabled: true
    },
    {
        id: 'load_btn',
        classes: ['btn'],
        text: 'Load saved game',
        disabled: false
    },
    {
        id: 'result_btn',
        classes: ['btn'],
        text: 'Result',
        disabled: false
    }
]

const frameControllers = [
    {
        classes: ['btn__frame'],
        text: '3x3',
        data: {dataName: 'value', value: '3'}
    },
    {
        classes: ['btn__frame'],
        text: '4x4',
        data: {dataName: 'value', value: '4'}
    },
    {
        classes: ['btn__frame'],
        text: '5x5',
        data: {dataName: 'value', value: '5'}
    },
    {
        classes: ['btn__frame'],
        text: '6x6',
        data: {dataName: 'value', value: '6'}
    },
    {
        classes: ['btn__frame'],
        text: '7x7',
        data: {dataName: 'value', value: '7'}
    },
    {
        classes: ['btn__frame'],
        text: '8x8',
        data: {dataName: 'value', value: '8'}
    },
]

const infoPanelData = [
    {
        text: 'Moves: ',
        span: {
            id: 'counter',
            text: '0'
        }
    },    
    {
            text: 'Time: ',
            span: {
                id: 'time',
                text: '00:00'
            }
        
    }
]

const resultPanelData = [
    {
        text: '№ | moves | time | frame '
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    },
    {
        classes: 'cell'
    }
    
]




function addClassesToElement(element, classes) {
    classes.forEach((className => element.classList.add(className)))
}


function createElement(tagName, classes, id) {
    const element = document.createElement(tagName)
    if(classes){
        classes.forEach(className => element.classList.add(className))
    }
    if(id){
        element.setAttribute('id', id)
    }
    return element;
}


function handleDataAttribute(element, data) {
    element.dataset[data.dataName] = data.value;
}

function createBtn(btnData) {
    const btnElement = document.createElement(TAG_BTN);
    if(btnData.id) {
        btnElement.setAttribute('id', btnData.id);
    }

    
    if(btnData.data) {
        handleDataAttribute(btnElement, btnData.data)
    }
    addClassesToElement(btnElement, btnData.classes)
    btnElement.disabled = btnData.disabled;
    btnElement.textContent = btnData.text;
    return btnElement;
}



function createP(elements, classes) {
    const pElement = document.createElement(TAG_P);
    if(classes){
        addClassesToElement(pElement, classes);
    }    
    elements.forEach(e => pElement.appendChild(e)) 
    return pElement
}

function createUnorderedList(listItems, classNames) {
    const ul = document.createElement(TAG_UL)
    addClassesToElement(ul, classNames);

    const li = document.createElement(TAG_LI);

    listItems.forEach(item => {
        const dupLi = li.cloneNode();
        dupLi.appendChild(item)
        ul.appendChild(dupLi)
    })

    return ul;
}

function createGameContainer(elements) {
    const gameContainer = createElement(TAG_DIV, ['game-container'])
    const contentContainer = createElement(TAG_DIV, ['content-container'])

    gameContainer.appendChild(contentContainer)

    elements.forEach(element => contentContainer.appendChild(element))

    return gameContainer;
}


function createControllers() {
    const controllerBtns = controllers.map(c => createBtn(c))
    
    const soundControllerElement = document.createElement(TAG_INPUT)
    soundControllerElement.setAttribute('id', 'sound_box')
    soundControllerElement.type = 'checkbox'

    const soundLabel = document.createElement(TAG_LABEL)
    const textSoundLabel = document.createTextNode('Sound on/off')
    soundLabel.appendChild(textSoundLabel)
    soundLabel.appendChild(soundControllerElement)

    controllerBtns.push(soundLabel)

    return createUnorderedList(controllerBtns, ['controllers'])
}

function createFrameController(){
    const controllerBtns = frameControllers.map(c => createBtn(c))
    return createUnorderedList(controllerBtns, ['frame-controller'])

}

function createInfoPanel() {
    const infoPanel = infoPanelData.map(e => {
        const textContent = document.createTextNode(e.text)
        const infoSpan = createElement(TAG_SPAN, [], e.span.id)
        if(e.span.text){
            infoSpan.textContent = e.span.text
        }
        return [textContent, infoSpan]
    }).map(e => createP(e))
    
    
    return createUnorderedList(infoPanel, ['info-panel']);
}

function createResultPanel() {
    const createPopupResultPanel = createElement(TAG_DIV, ['popup-panel', 'hidden', 'result-panel']);
    const createPopupContainer = createElement(TAG_DIV, ['popup-panel-container']);
    const createResultPanel = resultPanelData.map(e => {
        
        const elements = []
        if(e.text) {
            elements.push(document.createTextNode(e.text))
        }

        return createP(elements, [e.classes])
    })

    createResultPanel.forEach(e => createPopupContainer.appendChild(e) )
    
    createPopupResultPanel.appendChild(createPopupContainer)

    return createPopupResultPanel
}

function createBoard() {
    const board = createElement(TAG_DIV, ['board'])
    const canvas = createElement(TAG_CANVAS)
    board.appendChild(canvas)
    
    if(screen.width < 767){
        canvas.width = 300;
        canvas.height = 300;        
    } else {
        canvas.width = 500;
        canvas.height = 500;
    }
    return board
}

function createFrame() {
    const frameContainer = createElement(TAG_DIV, ['frame-container']);
    const frameContentContainer = createElement(TAG_DIV, ['frame-content-container']);

    const frameInfo = createElement(TAG_DIV, ['frame-info']);
    const frameSizeP = createElement(TAG_P);
    const frameSizeSpan = createElement(TAG_SPAN);

    const sizeBarChooser = createElement(TAG_DIV, ['size__bar__chooser']);
    const sizeInfo = createElement(TAG_DIV, ['info']);
    const sizeText = createElement(TAG_P);
    
    const textFrameSize = document.createTextNode('Frame size: ')
    const textOtherSizes =  document.createTextNode('Other sizes: ');


    frameSizeP.appendChild(textFrameSize)
    
    frameSizeSpan.setAttribute('id', 'frame-size')
    frameSizeSpan.textContent = '4x4';
    frameSizeP.appendChild(frameSizeSpan)
    frameInfo.appendChild(frameSizeP)

    sizeText.appendChild(textOtherSizes)
    sizeInfo.appendChild(frameInfo);

    sizeBarChooser.appendChild(sizeInfo);
    sizeBarChooser.appendChild(createFrameController());

    frameContentContainer.appendChild(frameInfo);
    frameContentContainer.appendChild(sizeBarChooser);
    
    frameContainer.appendChild(frameContentContainer);


    return frameContainer
}

function createAudio(){
    const audio = createElement(TAG_AUDIO);
    audio.setAttribute('id', 'audio')
    audio.src = 'sound.mp3'
    return audio
}

function createWinPanel() {
    const popupWinPanel = createElement(TAG_DIV, ['popup-panel', 'hidden', 'win-panel']);
    const popupContainer = createElement(TAG_DIV, ['popup-panel-container']);
    const popupContent = createElement(TAG_DIV, ['popup-panel-content']);

    const lineP = createElement(TAG_P);
    const spanWin = createElement(TAG_SPAN)
    const buttonOK = createElement(TAG_BTN)
    
    buttonOK.textContent = 'OK!';
    buttonOK.setAttribute('id', 'ok')
    spanWin.setAttribute('id', 'message__about_win')

    
    lineP.appendChild(spanWin)
    lineP.appendChild(buttonOK)
    popupContent.appendChild(lineP)
    popupContainer.appendChild(popupContent)
    popupWinPanel.appendChild(popupContainer)
    return popupWinPanel
}

function createShadow() {
    const shadow = createElement(TAG_DIV, ['layer', 'hidden'])
    return shadow
}




function generateTags() {
    const elements = []


    const section = createElement(TAG_SECTION, ['container'])
    const main = createElement(TAG_MAIN, ['game']);
    section.appendChild(main);
    
    main.appendChild(createGameContainer([createControllers()]))
    main.appendChild(createGameContainer([createInfoPanel()]))
    main.appendChild(createGameContainer([createBoard()]))
    main.appendChild(createGameContainer([createFrame()]))

    main.appendChild(createAudio())
    main.appendChild(createResultPanel())
    main.appendChild(createWinPanel())
    main.appendChild(createShadow())

    elements.push(section)

    return [section];
}




const body = document.querySelector('#root')

generateTags().forEach(element => body.appendChild(element))



