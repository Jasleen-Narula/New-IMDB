let definitions = require("./definition");

module.exports = {

  "swagger": "2.0",
  "info": {
    "description": "Api documentation for Nodejs-recruitment-task",
    "version": "1.0.0",
    "title": "Nodejs-recruitment-task"
  },
  "host": process.env.SWAGGER_URL,
  "basePath": "",
  "tags": [
    {
      "name": "movies",
      "description": "Everything about movies"
    },
    {
      "name": "auth",
      "description": "Everything about auth"
    },
  ],
  "schemes": [
    "http"
  ],
  "paths": {
    "/movie": {
      "post": {
        "tags": [
          "movies"
        ],
        "summary": "Create movie",
        "description": "",
        "consumes": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "header",
            "name": "Authorization",
            "description": "Enter the Bearer token",
            "required": true
          },
          {
            "in": "body",
            "name": "body",
            "description": "Enter details",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "required": true,
                  "unique": true
                }
              }
            }
          }
        ],
        "responses": {}
      },
      "get": {
        "tags": [
          "movies"
        ],
        "summary": "Get movies",
        "description": "",
        "consumes": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "header",
            "name": "Authorization",
            "description": "Enter the Bearer token",
            "required": true
          },
        ],
        "responses": {}
      },
    },
   
    "/auth": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Get verification token",
        "description": "",
        "consumes": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Fetch token",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "username": {
                  "type": "string",
                  "required": true
                },
                "password": {
                  "type": "string",
                  "required": true
                }
              }
            }
          }
        ],
        "responses": {}
      }
    },
   
  },
  "definitions": definitions
};
