var express = require('express');
var router = express.Router();

router.get('/read', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT r.id AS rid, r.pessoa_cpf, r.estado, e.id AS eid, e.dia, e.horario_id, e.sala_numero, e.descricao
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

router.post('/create', function(req, res, next) {
  console.log(req.body);
  res.send("gudi");
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
