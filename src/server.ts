import initApp from './app';

initApp().then((app) => {
    let port;
    if (process.env.NODE_ENV !== "production") {
        port = process.env.PORT;
    } else {
        port = process.env.HTPPS_PORT;
    }
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});
