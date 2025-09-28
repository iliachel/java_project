package com.todoapp;

import javax.xml.ws.Endpoint;
import static spark.Spark.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class App {
    public static void main(String[] args) {
        String url = "http://localhost:8080/todoservice";
        Endpoint.publish(url, new TodoServiceImpl());
        System.out.println("SOAP service published at: " + url + "?wsdl");

        port(8081);
        staticFiles.location("/public");

        get("/", (req, res) -> {
            res.redirect("index.html");
            return null;
        });

        post("/todoservice", (req, res) -> {
            HttpClient client = HttpClients.createDefault();
            HttpPost post = new HttpPost("http://localhost:8080/todoservice");
            post.setEntity(new StringEntity(req.body(), "UTF-8"));
            post.setHeader("Content-Type", "text/xml;charset=UTF-8");

            HttpResponse response = client.execute(post);
            res.status(response.getStatusLine().getStatusCode());
            res.type("text/xml");
            return EntityUtils.toString(response.getEntity());
        });
    }
}