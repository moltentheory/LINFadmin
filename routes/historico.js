var express = require('express');
var router = express.Router();
var moment = require('moment');

/* READ */
router.get('/', function(req, res, next) {
  res.redirect('/histprocp/read/');
});

router.get('/read', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT h.id, h.hora_entrada, h.hora_saida, h.pessoa_cpf, p.nome 
    FROM historico h
    INNER JOIN pessoa p
    ON p.cpf = h.pessoa_cpf
    ORDER BY h.hora_entrada`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(result, index){this[index].hora_entrada = moment(this[index].hora_entrada).format('HH:mm:ss'); }, results);
    results.forEach(function(result, index){
      if(this[index].hora_saida != null)
        this[index].hora_saida = moment(this[index].hora_saida).format('HH:mm:ss');
      else
        this[index].hora_saida = 'Não saiu';
    }, results);
    res.render('historico', { title: 'express', historico: results });
  });
});
router.get('/read/id/:id', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT h.id, h.hora_entrada, h.hora_saida, h.pessoa_cpf, p.nome 
    FROM historico h
    INNER JOIN pessoa p
    ON p.cpf = h.pessoa_cpf
    WHERE h.id = ${req.params.id}
    ORDER BY h.hora_entrada`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(result, index){this[index].hora_entrada = moment(this[index].hora_entrada).format('HH:mm:ss'); }, results);
    results.forEach(function(result, index){
      if(this[index].hora_saida != null)
        this[index].hora_saida = moment(this[index].hora_saida).format('HH:mm:ss');
      else
        this[index].hora_saida = 'Não saiu';
    }, results);
    res.render('historicor', { title: 'express', historico: results });
  });
});
router.get('/read/cpf/:cpf', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT h.id, h.hora_entrada, h.hora_saida, h.pessoa_cpf, p.nome 
    FROM historico h
    INNER JOIN pessoa p
    ON p.cpf = h.pessoa_cpf
    WHERE p.cpf = ${req.params.cpf}
    ORDER BY h.hora_entrada`;
    console.log(aux);
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(result, index){this[index].hora_entrada = moment(this[index].hora_entrada).format('HH:mm:ss'); }, results);
    results.forEach(function(result, index){
      if(this[index].hora_saida != null)
        this[index].hora_saida = moment(this[index].hora_saida).format('HH:mm:ss');
      else
        this[index].hora_saida = 'Não saiu';
    }, results);
    res.render('historicor', { title: 'express', historico: results });
  });
});

router.get('/create', function(req, res, next) {
  var pessoas = [];
  var currenttime = moment().format('HH:mm:ss');

  var db = req.app.get('db');
  db.query('SELECT cpf, nome FROM pessoa', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { pessoas.push({cpf: item.cpf, nome: item.nome}) });
    res.render('historicoc', { title: 'criando entrada no historico', pessoas, currenttime });
  });
});
router.post('/create', function(req, res, next) {
  // info validation todo

  // format entrada and saida
  var entrada = '\"'+moment(req.body.entrada, 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')+'\"';
  var saida = 'NULL';
  if(req.body.saida != '') saida = '\"'+moment(req.body.saida, 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')+'\"';

  var db = req.app.get('db');
  //- fields: id, hora_entrada, hora_saida, pessoa_cpf
  var aux = 
    `INSERT INTO historico VALUES(
      NULL,
      ${entrada},
      ${saida},
      ${req.body.pessoa_cpf}
    )`;
    console.log(aux);
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/historico/read/id/'+results.insertId);
  });
});

router.get('/update/:id', function(req, res, next) {
  var db = req.app.get('db');
  var pessoas = [];
  db.query('SELECT cpf, nome FROM pessoa', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { pessoas.push({cpf: item.cpf, nome: item.nome}) });
    var aux = 
      `SELECT h.id, h.hora_entrada, h.hora_saida, h.pessoa_cpf, p.nome 
      FROM historico h
      INNER JOIN pessoa p
      ON p.cpf = h.pessoa_cpf
      WHERE h.id = ${req.params.id}
      ORDER BY h.hora_entrada`;
    db.query(aux, function (error, results, fields) {
      if (error) throw error;
      results.forEach(function(result, index){this[index].hora_entrada = moment(this[index].hora_entrada).format('HH:mm:ss'); }, results);
      results.forEach(function(result, index){
        if(this[index].hora_saida != null)
          this[index].hora_saida = moment(this[index].hora_saida).format('HH:mm:ss');
        else
          this[index].hora_saida = '';
      }, results);
      res.render('historicou', { title: 'update de entrada do historico', historico: results[0], pessoas });
    });
  });
});
router.post('/update', function(req, res, next) {
  // info validation todo

  // format entrada and saida
  var entrada = '\"'+moment(req.body.entrada, 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')+'\"';
  var saida = 'NULL';
  if(req.body.saida != '') saida = '\"'+moment(req.body.saida, 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')+'\"';

  console.log()

  var db = req.app.get('db');
  //- fields: id, hora_entrada, hora_saida, pessoa_cpf
  var aux = 
    `UPDATE historico SET
      hora_entrada = ${entrada},
      hora_saida = ${saida},
      pessoa_cpf = ${req.body.pessoa_cpf}
    WHERE id = ${req.body.hid}`;
    console.log(aux);
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/historico/read/id/'+req.body.hid);
  });
});


router.get('/delete', function(req, res, next) {
  res.redirect('/historico/read/');
});
router.get('/delete/:id', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `DELETE FROM historico
    WHERE id = ${req.params.id}`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/historico/read/');
  });
});

module.exports = router;