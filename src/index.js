export function showMessage(name, time, message) {
    var newLi = document.createElement("li");
    const element = `
        <div class="message-header">
        <span class="header-time">${time}, Today</span>
        <span class="header-name">${name} <i class="circle"></i></span>
        </div>
        <div class="message-content">${message}</div>
    `;
    newLi.innerHTML = element;
    return newLi;
}

export function loadChat(chat) {
    const element = `
        <h1 class="title">${chat || 'My First Chat'}</h1>
        <div>
            <ul class="message-list" id="message-list"></ul>
            <div class="ball-loader-container">
                <div class="ball-loader" id="typing">
                <div class="ball-loader-ball ball1"></div>
                <div class="ball-loader-ball ball2"></div>
                <div class="ball-loader-ball ball3"></div>
            </div>
        </div>
        <div class="message-input">
            <input type="text" data-testid="input" class="input" id="input-box" placeholder="Type your message here!" />
            <button class="button" type="button" id="send-button">Send</button>
        </div>
        </div>
    `;
    return element;
}

export class Chat {
    constructor(title, name, target) {
        this.title = title;
        this.name = name;
        this.newMessage = '';
        this.typing = false;
        this.interval;
        this.target = target;
    }
    init() {
        this.loadStructure();
        this.getComponents();
        this.bindEvents();
        this.render();
        // Estabilish websocket connection
    }
    getComponents() {
        this.sendButton = document.getElementById(`send-button`);
        this.messageList = document.getElementById(`message-list`);
        this.input = document.getElementById(`input-box`);
        this.typingField = document.getElementById(`typing`);
    }
    loadStructure() {
        this.target.innerHTML = loadChat(this.title, this.id);
    }
    bindEvents() {
        this.sendButton.addEventListener("click", this.addNewMessage.bind(this));
        this.input.addEventListener("keyup", this.addNewMessageOnEnter.bind(this));
        this.input.addEventListener("focus", this.getTypingStatus.bind(this));
        this.input.addEventListener("blur", this.getTypingStatus.bind(this));
    }
    async addNewMessage() {
        try {
            // message would be sent to the stream
            this.newMessage = this.input.value;
            this.render()
        } catch(e) {
            console.log(e)
        }
    }
    getTypingStatus(e) {
        let oldValue = this.input.value;
        if(e.type === 'focus') {
            this.interval = window.setInterval(() => {
                this.typing = oldValue === this.input.value ? false : true;
                oldValue = this.input.value 
                this.typingField.style.display = this.typing ?
                'block' : 'none'
            }, 1000)
        } else {
            this.typing = false;
            clearInterval(this.interval)
        }
    }
    addNewMessageOnEnter(event) {
        if (event.keyCode === 13) {
            this.addNewMessage();
        }
    }
    isChatStreamClean() {
        // This would be substituded by a reconciliation with server to check if message stream is empty or not
        return this.messageList.hasChildNodes()
    }
    scrollToBottom() {
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }
    getCurrentTime(){
        return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    }
    render() {
        // After estabilishing connection to server, check if there's 
        if(!this.isChatStreamClean()) {
            this.messageList.innerHTML = `<li class="empty-message" id="empty-message">This chatroom has no messages so far.</li>`;
            this.input.focus();
            return;
        }
        const emptyMessage = document.getElementById(`empty-message`);
        if(emptyMessage) {
            this.messageList.removeChild(emptyMessage);
        }
        if(this.newMessage.trim() !== '') {
            this.messageList.append(showMessage(this.name, this.getCurrentTime(), this.newMessage.trim()));
            this.input.value = '';
        }
        this.scrollToBottom();
    }    
}

window.onload = function() {
    (function(){
        const name = prompt('What is your name?');
        const chatName = prompt('What is the chatroom name?');
        const target = document.getElementById('chat-container');
        const chat = new Chat(chatName, name, target);
        chat.init()
     })();
};