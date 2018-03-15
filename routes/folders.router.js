'use strict';

const express = require('express');

const router = express.Router();
const knex = require('../knex');

router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ SINGLE NOTES ========== */

router.get('/folders/:id', (req, res, next) =>{
  knex
    .first('id', 'name')
    .where('id', req.params.id)
    .from('folders')
    .then(result=>{
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/folders/:id', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const updateFolder = {name};
  
  knex('folders')
    .update(updateFolder)
    .where('id', req.params.id)
    .returning(['id', 'name'])
    .then(([result])=>{
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/folders', (req, res, next) => {
  const { name } = req.body;
    
  const newItem = { name };
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex
    .insert(newItem)
    .into('folders')
    .returning(['id', 'name'])
    .then((results)=>{
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    }) 
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/folders/:id', (req, res, next) => {
    
  knex
    .del()
    .where('id', req.params.id)
    .from('folders')
    .then(() =>{
      res.status(204).end();
    })
    .catch(next);
});


module.exports = router;