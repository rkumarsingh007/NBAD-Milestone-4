const express = require('express');
const router = express.Router();
const controller = require('../controllers/commodityController');
const { validateId } = require('../middlewares/validator'); 


//GET /commodities: send all commodities to the user
router.get('/', controller.index);

//GET /commodities/new: send html form for creating a new commodity
router.get('/new', controller.new);

//POST /commodities: create a new commodity
router.post('/', controller.create);

//GET /commodities/:id: send details of commodity identified by id
router.get('/:id', validateId, controller.show);

//GET /commodities/:id: send html form for editing an existing commodity
router.get('/:id/edit', validateId, controller.edit);

//PUT /commodities/:id: update the commodity identified by id
router.put('/:id', validateId, controller.update);

//DELETE /commodities/:id: delete the commodity identified by id
router.delete('/:id', validateId, controller.delete);

module.exports=router;  