'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();
const knex = require('../knex');


// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  knex
    .select('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder){
      if(searchTerm){
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function(queryBuilder){
      if(folderId) {
        queryBuilder.where('folder_id', 'folderId');
      }
    })
    .orderBy('notes.id')
    .then(results=> {res.json(results);
    })
    .catch(next);
});

/* ========== GET/READ SINGLE NOTES ========== */
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
    .select('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', noteId)
    .then(result=>{
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  /***** Never trust users - validate input *****/
  const { title, content, folder_id} = req.body;

  /***** Never trust users - validate input *****/
  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateNote = {
    title: title,
    content: content,
    folder_id: folder_id
  };

  knex('notes')
    .update(updateNote)
    .where('id', noteId)
    .returning(['id'])
    .then(()=>{
      return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
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
router.post('/notes', (req, res, next) => {
  const { title, content, folder_id } = req.body;
  
  if (!req.body.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { title: title, content: content, folder_id: folder_id };
 
  let noteId;

  knex
    .insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id])=>{
      noteId = id;
      return knex.select('note.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then((results)=>{
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    }) 
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  knex
    .del()
    .from('notes')
    .where('id', req.params.id)
    .then(() =>{
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;