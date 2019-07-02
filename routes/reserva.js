var express = require('express');
var router = express.Router();
var moment = require('moment'); 

router.get('/read', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT r.id AS rid, r.pessoa_cpf, r.estado, e.id AS eid, e.dia, e.horario_id, e.sala_numero, r.descricao
    FROM reserva r
    INNER JOIN evento e
    ON r.id = e.reserva_id
    ORDER BY r.id`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.render('reserva', { title: 'express', reservas: results });
  });
});

router.get('/create', function(req, res, next) {
  var horarios = [];
  var salas = [];
  var disciplinas = [];
  var pessoas = [];

  var db = req.app.get('db');
  db.query('SELECT * FROM horario', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { horarios.push({id: item.id, inicio: item.inicio, fim: item.fim}) });

    db.query('SELECT * FROM sala', function (error, results, fields) {
      if (error) throw error;
      results.forEach(function(item) { salas.push({numero: item.numero}) });

      db.query('SELECT codigo, nome FROM disciplina', function (error, results, fields) {
        if (error) throw error;
        results.forEach(function(item) { disciplinas.push({codigo: item.codigo, nome: item.nome}) });
        console.log(disciplinas)

        db.query('SELECT cpf, nome FROM pessoa', function (error, results, fields) {
          if (error) throw error;
          results.forEach(function(item) { pessoas.push({cpf: item.cpf, nome: item.nome}) });
          res.render('reservac', { title: 'criando usuario', horarios: horarios, salas: salas, pessoas: pessoas, disciplinas: disciplinas });
        });
      });
    });
  });
});

/*router.post('/create', function(req, res, next) {
  console.log(req.body);
  res.send('gud');
});*/
router.post('/create', function(req, res, next) {
  console.log(req.body);

  var weekdays = req.body.dia.map(function(elem){ return parseInt(elem); });
  var salas = req.body.sala.map(function(elem){ return parseInt(elem); });

  var dias = [];
  var a = moment(req.body.start);
  var b = moment(req.body.end);
  if(b.diff(a, 'days') > 0){
    for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
      if( weekdays.indexOf(m.isoWeekday()) > -1 )
        dias.push(m.format('YYYY-MM-DD')); 
    }
  } else {
    dias.push(a.format('YYYY-MM-DD'))
  }

  //id, pessoa_cpf, estado, disciplina_codigo, descricao
  var db = req.app.get('db');
  var aux = 
    `INSERT INTO reserva VALUES(
    NULL,
    ${req.body.pessoa_cpf}, 
    0,
    ${req.body.disciplina}, 
    "${req.body.descricao.substring(0, 144)}"
    )`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    //reserva_id, id, dia, horario_id, sala_numero
    var id = results.insertId;
    var aux = `INSERT INTO evento VALUES `;
    var auxQvals = [];
    dias.forEach(function(dia){
      salas.forEach(function(sala){
        auxQvals.push( `(
          ${results.insertId},
          NULL,
          "${dia}",
          ${req.body.horario},
          ${sala}
        )`);
      });
    });
    aux += auxQvals.join(', ');
    console.log(aux);
    db.query(aux, function(error, results, fields){
      if (error) throw error;
      console.log(results);
      res.redirect('/reserva/read/');
    });
  });
});
router.post('/createee', function(req, res, next) {
  // info validation todo

  var db = req.app.get('db');
  //cpf, senha, nome, email, matricula, foto, departamento_id, cargo_id
  var aux = 
    `INSERT INTO pessoa VALUES(
    ${req.body.cpf}, 
    "${req.body.senha}", 
    "${req.body.nome}", 
    "${req.body.email}", 
    ${req.body.matricula}, 
    "${req.file.buffer.toString('base64')}", 
    "${req.file.mimetype}", 
    ${req.body.departamento}, 
    ${req.body.cargo}
    )`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    //db.end();
    res.redirect('/pessoa/read/'+req.body.cpf);
  });
});

module.exports = router;
