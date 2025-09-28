document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const todoContainer = document.getElementById('todo-container');
    const loginBtn = document.getElementById('login-btn');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');

    let token = null;
    const NAMESPACE_URI = "http://todoapp.com/ws";

    const soapRequest = (body) => {
        const fullBody = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="${NAMESPACE_URI}">
                <soapenv:Header/>
                <soapenv:Body>
                    ${body}
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        return fetch('/ws', {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: fullBody
        })
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"));
    };

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const body = `
            <ws:loginRequest>
                <ws:username>${username}</ws:username>
                <ws:password>${password}</ws:password>
            </ws:loginRequest>
        `;

        soapRequest(body).then(data => {
            token = data.getElementsByTagNameNS(NAMESPACE_URI, 'token')[0].textContent;
            if (token) {
                loginContainer.style.display = 'none';
                todoContainer.style.display = 'block';
                loadTodos();
            } else {
                alert('Login failed');
            }
        });
    });

    const loadTodos = () => {
        const body = `<ws:getTodosRequest><ws:token>${token}</ws:token></ws:getTodosRequest>`;
        soapRequest(body).then(data => {
            todoList.innerHTML = '';
            const todos = data.getElementsByTagNameNS(NAMESPACE_URI, 'todos');
            for (let item of todos) {
                const id = item.getElementsByTagNameNS(NAMESPACE_URI, 'id')[0].textContent;
                const task = item.getElementsByTagNameNS(NAMESPACE_URI, 'task')[0].textContent;
                const done = item.getElementsByTagNameNS(NAMESPACE_URI, 'done')[0].textContent === 'true';
                addTodoToList(id, task, done);
            }
        });
    };

    const addTodoToList = (id, task, done) => {
        const li = document.createElement('li');
        li.textContent = task;
        li.dataset.id = id;
        if (done) {
            li.classList.add('done');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(id);
        });

        li.addEventListener('click', () => {
            updateTodo(id, task, !done);
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    };

    addBtn.addEventListener('click', () => {
        const task = newTodoInput.value;
        if (task) {
            const body = `
                <ws:addTodoRequest>
                    <ws:token>${token}</ws:token>
                    <ws:task>${task}</ws:task>
                </ws:addTodoRequest>
            `;
            soapRequest(body).then(data => {
                const todo = data.getElementsByTagNameNS(NAMESPACE_URI, 'todo')[0];
                const id = todo.getElementsByTagNameNS(NAMESPACE_URI, 'id')[0].textContent;
                const task = todo.getElementsByTagNameNS(NAMESPACE_URI, 'task')[0].textContent;
                const done = todo.getElementsByTagNameNS(NAMESPACE_URI, 'done')[0].textContent === 'true';
                addTodoToList(id, task, done);
                newTodoInput.value = '';
            });
        }
    });

    const updateTodo = (id, task, done) => {
        const body = `
            <ws:updateTodoRequest>
                <ws:token>${token}</ws:token>
                <ws:todo>
                    <ws:id>${id}</ws:id>
                    <ws:task>${task}</ws:task>
                    <ws:done>${done}</ws:done>
                </ws:todo>
            </ws:updateTodoRequest>
        `;
        soapRequest(body).then(() => {
            loadTodos();
        });
    };

    const deleteTodo = (id) => {
        const body = `
            <ws:deleteTodoRequest>
                <ws:token>${token}</ws:token>
                <ws:id>${id}</ws:id>
            </ws:deleteTodoRequest>
        `;
        soapRequest(body).then(() => {
            loadTodos();
        });
    };
});