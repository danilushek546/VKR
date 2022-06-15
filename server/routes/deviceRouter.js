const { Router } = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.get('/search', deviceController.getSearchAllDeviceByName);
router.delete('/:id', checkRole("ADMIN"), deviceController.delete);
router.put('/:id', checkRole("ADMIN"), deviceController.update);
module.exports = router;