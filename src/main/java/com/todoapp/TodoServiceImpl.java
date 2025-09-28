package com.todoapp;

import javax.jws.WebService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@WebService(endpointInterface = "com.todoapp.TodoService")
public class TodoServiceImpl implements TodoService {

    private Map<String, String> users = new HashMap<>();
    private Map<String, String> sessions = new HashMap<>();
    private List<Todo> todos = new ArrayList<>();
    private int nextId = 1;

    public TodoServiceImpl() {
        users.put("admin", "admin");
    }

    @Override
    public String login(String username, String password) {
        if (users.containsKey(username) && users.get(username).equals(password)) {
            String token = UUID.randomUUID().toString();
            sessions.put(token, username);
            return token;
        }
        return null;
    }

    @Override
    public Todo[] getTodos(String token) {
        if (sessions.containsKey(token)) {
            return todos.toArray(new Todo[0]);
        }
        return new Todo[0];
    }

    @Override
    public Todo addTodo(String token, String task) {
        if (sessions.containsKey(token)) {
            Todo todo = new Todo(nextId++, task);
            todos.add(todo);
            return todo;
        }
        return null;
    }

    @Override
    public Todo updateTodo(String token, int id, String task, boolean done) {
        if (sessions.containsKey(token)) {
            for (Todo todo : todos) {
                if (todo.getId() == id) {
                    todo.setTask(task);
                    todo.setDone(done);
                    return todo;
                }
            }
        }
        return null;
    }

    @Override
    public boolean deleteTodo(String token, int id) {
        if (sessions.containsKey(token)) {
            return todos.removeIf(todo -> todo.getId() == id);
        }
        return false;
    }
}