package com.todoapp;

public class Todo {
    private int id;
    private String task;
    private boolean done;

    public Todo(int id, String task) {
        this.id = id;
        this.task = task;
        this.done = false;
    }

    public int getId() {
        return id;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}