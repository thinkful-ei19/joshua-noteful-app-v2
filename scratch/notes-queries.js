'use strict';

const knex = require('../knex');

//knex.select(1).then(res => console.log(res));

/*knex
  .select('id', 'title', 'content')
  .from('notes')
  .where('title', 'like', '%10%')
  .then(results=> console.log(results));*/

/* ========== GET/READ SINGLE NOTES ========== */

/*knex
  .select('id', 'title', 'content')
  .from('notes')
  .where('notes.id', '1000')
  .then(results=>console.log(results));*/

/* ========== PUT/UPDATE A SINGLE ITEM ========== */

/*knex('notes')
  .update('title', 'New Title')
  .where('id', 1006)
  .returning(['id', 'title', 'content'])
  .then(results=>console.log(results));*/

/* ========== POST/CREATE ITEM ========== */

knex
  .insert({
    title: 'Created Note Example',
    content: 'This is a sample note'
  })
  .into('notes')
  .returning(['id', 'title', 'content'])
  .then(results=> console.log(results));

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */

/*knex
  .del()
  .from('notes')
  .where('id', 1005)
  .then(results=>console.log(results));*/
