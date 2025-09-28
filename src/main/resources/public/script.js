document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const todoContainer = document.getElementById('todo-container');
    const loginBtn = document.getElementById('login-btn');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');

    let token = null;

    const soapRequest = (method, args) => {
        const body = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://todoapp.com/">
                <soapenv:Header/>
                <soapenv:Body>
                    <q0:${method}>
                        ${args}
                    </q0:${method}>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        return fetch('/todoservice', {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: body
        })
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"));
    };

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const args = `
            <arg0>${username}</arg0>
            <arg1>${password}</arg1>
        `;

        soapRequest('login', args).then(data => {
            token = data.getElementsByTagName('return')[0].textContent;
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
        const args = `<arg0>${token}</arg0>`;
        soapRequest('getTodos', args).then(data => {
            todoList.innerHTML = '';
            const todos = data.getElementsByTagName('return');
            for (let item of todos) {
                const id = item.getElementsByTagName('id')[0].textContent;
                const task = item.getElementsByTagName('task')[0].textContent;
                const done = item.getElementsByTagName('done')[0].textContent === 'true';
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
            const args = `
                <arg0>${token}</arg0>
                <arg1>${task}</arg1>
            `;
            soapRequest('addTodo', args).then(data => {
                const id = data.getElementsByTagName('id')[0].textContent;
                const task = data.getElementsByTagName('task')[0].textContent;
                const done = data.getElementsByTagName('done')[0].textContent === 'true';
                addTodoToList(id, task, done);
                newTodoInput.value = '';
            });
        }
    });

    const updateTodo = (id, task, done) => {
        const args = `
            <arg0>${token}</arg0>
            <arg1>${id}</arg1>
            <arg2>${task}</arg2>
            <arg3>${done}</arg3>
        `;
        soapRequest('updateTodo', args).then(() => {
            loadTodos();
        });
    };

    const deleteTodo = (id) => {
        const args = `
            <arg0>${token}</arg0>
            <arg1>${id}</arg1>
        `;
        soapRequest('deleteTodo', args).then(() => {
            loadTodos();
        });
    };
});