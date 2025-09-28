package com.todoapp;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import java.util.List;

@WebService
@SOAPBinding(style = SOAPBinding.Style.RPC)
public interface TodoService {

    @WebMethod
    String login(String username, String password);

    @WebMethod
    Todo[] getTodos(String token);

    @WebMethod
    Todo addTodo(String token, String task);

    @WebMethod
    Todo updateTodo(String token, int id, String task, boolean done);

    @WebMethod
    boolean deleteTodo(String token, int id);
}