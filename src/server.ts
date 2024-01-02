import initApp from './app';

initApp().then((app) => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});
