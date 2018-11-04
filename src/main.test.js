import { showMessage, loadChat, Chat } from './index';
import { queryByTestId, getByText, queryByText } from 'dom-testing-library';
import { toHaveClass, toBeInTheDocument } from 'jest-dom';

expect.extend({ toBeInTheDocument, toHaveClass });

describe('context: View', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    })
    
    test('showMessage method', () => {
        const dom = showMessage('name', 'time', 'message');
        const firstChild = dom.firstElementChild;
        const secondChild = dom.children[1];
        expect(dom.nodeName).toBe('LI');
        expect(firstChild).toHaveClass('message-header');
        expect(firstChild.firstElementChild.textContent).toBe('time, Today');
        expect(firstChild.children[1].innerHTML).toBe('name <i class="circle"></i>');
        expect(secondChild).toHaveClass('message-content');
        expect(secondChild.textContent).toBe('message');
    });

    test('loadChat method', () => {
        const dom = loadChat('chatName');
        const div = document.createElement('div');
        div.setAttribute('data-testid', 'load-chat');
        document.body.appendChild(div);
        document.querySelector('[data-testid="load-chat"]').innerHTML = dom;
        expect(queryByText(document, 'chatName')).toBeInTheDocument();
        expect(queryByText(document, 'chatName')).toHaveClass('title');
        expect(document.querySelector('.message-list')).toBeInTheDocument();
        expect(document.querySelector('.ball-loader-container')).toBeInTheDocument();
        expect(queryByTestId(document, 'input')).toBeInTheDocument();
        expect(document.querySelector('.button')).toBeInTheDocument();
    });

    test('Chat method', () => {
        const app = document.createElement('div');
        app.setAttribute('id', 'chat-container');
        document.body.appendChild(app);

        const name = 'Silvio';
        const chatName = 'Chatroom';
        const target = document.getElementById('chat-container');
        const message = 'hello world';
        const chat = new Chat(name, chatName, target);
        chat.init();

        const emptyMessage = queryByText(document, 'This chatroom has no messages so far.');
        expect(emptyMessage).toBeInTheDocument();

        const input = queryByTestId(document, 'input');
        input.value = message;
        getByText(document, 'Send').click();
        expect(emptyMessage).not.toBeInTheDocument();
        expect(getByText(document, message)).toBeInTheDocument();
    });
});