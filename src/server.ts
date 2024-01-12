import initApp from './app';
import swaggerUI from "swagger-ui-express" 
import swaggerJsDoc from "swagger-jsdoc"

initApp().then((app) => {

    // Swagger
    if (process.env.NODE_ENV == "development") {
        const options = { 
            definition: {
                openapi: "3.0.0",
                info: {
                   title: "Web Dev 2022 REST API",
                   version: "1.0.0",
                   description: "REST server including authentication using JWT",
                },
                servers: [{url: "http://localhost:3000",},],
            },
            apis: ["./src/routes/*.ts"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    }


    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});
