package com.todoapp;

import com.todoapp.ws.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Endpoint
public class TodoEndpoint {
    private static final String NAMESPACE_URI = "http://todoapp.com/ws";

    private final Map<String, String> users = new HashMap<>();
    private final Map<String, String> sessions = new HashMap<>();
    private final List<Todo> todos = new ArrayList<>();
    private int nextId = 1;

    public TodoEndpoint() {
        users.put("admin", "admin");
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "loginRequest")
    @ResponsePayload
    public LoginResponse login(@RequestPayload LoginRequest request) {
        LoginResponse response = new LoginResponse();
        if (users.containsKey(request.getUsername()) && users.get(request.getUsername()).equals(request.getPassword())) {
            String token = UUID.randomUUID().toString();
            sessions.put(token, request.getUsername());
            response.setToken(token);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getTodosRequest")
    @ResponsePayload
    public GetTodosResponse getTodos(@RequestPayload GetTodosRequest request) {
        GetTodosResponse response = new GetTodosResponse();
        if (sessions.containsKey(request.getToken())) {
            response.getTodos().addAll(todos);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addTodoRequest")
    @ResponsePayload
    public AddTodoResponse addTodo(@RequestPayload AddTodoRequest request) {
        AddTodoResponse response = new AddTodoResponse();
        if (sessions.containsKey(request.getToken())) {
            Todo todo = new Todo();
            todo.setId(nextId++);
            todo.setTask(request.getTask());
            todo.setDone(false);
            todos.add(todo);
            response.setTodo(todo);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateTodoRequest")
    @ResponsePayload
    public UpdateTodoResponse updateTodo(@RequestPayload UpdateTodoRequest request) {
        UpdateTodoResponse response = new UpdateTodoResponse();
        if (sessions.containsKey(request.getToken())) {
            for (Todo todo : todos) {
                if (todo.getId() == request.getTodo().getId()) {
                    todo.setTask(request.getTodo().getTask());
                    todo.setDone(request.getTodo().isDone());
                    response.setTodo(todo);
                    break;
                }
            }
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteTodoRequest")
    @ResponsePayload
    public DeleteTodoResponse deleteTodo(@RequestPayload DeleteTodoRequest request) {
        DeleteTodoResponse response = new DeleteTodoResponse();
        if (sessions.containsKey(request.getToken())) {
            boolean removed = todos.removeIf(todo -> todo.getId() == request.getId());
            response.setSuccess(removed);
        } else {
            response.setSuccess(false);
        }
        return response;
    }
}