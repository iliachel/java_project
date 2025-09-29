document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const registrationContainer = document.getElementById('registration-container');
    const todoContainer = document.getElementById('todo-container');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
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

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registrationContainer.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'block';
        registrationContainer.style.display = 'none';
    });

    logoutBtn.addEventListener('click', () => {
        token = null;
        loginContainer.style.display = 'block';
        todoContainer.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

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
            const tokenElement = data.getElementsByTagNameNS(NAMESPACE_URI, 'token')[0];
            if (tokenElement && tokenElement.textContent) {
                token = tokenElement.textContent;
                loginContainer.style.display = 'none';
                registrationContainer.style.display = 'none';
                todoContainer.style.display = 'block';
                loadTodos();
            } else {
                alert('Login failed');
            }
        });
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const body = `
            <ws:registrationRequest>
                <ws:username>${username}</ws:username>
                <ws:password>${password}</ws:password>
            </ws:registrationRequest>
        `;

        soapRequest(body).then(data => {
            const success = data.getElementsByTagNameNS(NAMESPACE_URI, 'success')[0].textContent === 'true';
            const message = data.getElementsByTagNameNS(NAMESPACE_URI, 'message')[0].textContent;
            alert(message);
            if (success) {
                loginContainer.style.display = 'block';
                registrationContainer.style.display = 'none';
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
        li.dataset.id = id;
        if (done) {
            li.classList.add('done');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = done;
        checkbox.addEventListener('change', () => {
            updateTodo(id, task, checkbox.checked);
        });

        const span = document.createElement('span');
        span.textContent = task;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
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