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
    private final Map<String, List<Todo>> userTodos = new HashMap<>();
    private int nextId = 1;

    public TodoEndpoint() {
        users.put("admin", "admin");
        userTodos.put("admin", new ArrayList<>());
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
        String username = sessions.get(request.getToken());
        if (username != null) {
            response.getTodos().addAll(userTodos.get(username));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addTodoRequest")
    @ResponsePayload
    public AddTodoResponse addTodo(@RequestPayload AddTodoRequest request) {
        AddTodoResponse response = new AddTodoResponse();
        String username = sessions.get(request.getToken());
        if (username != null) {
            Todo todo = new Todo();
            todo.setId(nextId++);
            todo.setTask(request.getTask());
            todo.setDone(false);
            userTodos.get(username).add(todo);
            response.setTodo(todo);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateTodoRequest")
    @ResponsePayload
    public UpdateTodoResponse updateTodo(@RequestPayload UpdateTodoRequest request) {
        UpdateTodoResponse response = new UpdateTodoResponse();
        String username = sessions.get(request.getToken());
        if (username != null) {
            List<Todo> todos = userTodos.get(username);
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
        String username = sessions.get(request.getToken());
        if (username != null) {
            List<Todo> todos = userTodos.get(username);
            boolean removed = todos.removeIf(todo -> todo.getId() == request.getId());
            response.setSuccess(removed);
        } else {
            response.setSuccess(false);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "registrationRequest")
    @ResponsePayload
    public RegistrationResponse register(@RequestPayload RegistrationRequest request) {
        RegistrationResponse response = new RegistrationResponse();
        if (users.containsKey(request.getUsername())) {
            response.setSuccess(false);
            response.setMessage("Username already exists");
        } else {
            users.put(request.getUsername(), request.getPassword());
            userTodos.put(request.getUsername(), new ArrayList<>());
            response.setSuccess(true);
            response.setMessage("User registered successfully");
        }
        return response;
    }
}