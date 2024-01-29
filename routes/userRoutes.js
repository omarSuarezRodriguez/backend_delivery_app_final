const usersController = require('../controllers/usersController');

module.exports = (app, upload) => {

    // GET -> Obtener datos
    // POST -> Almacenar datos
    // PUT -> Actualizar datos
    // DELETE -> Eliminar datos


    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);


}