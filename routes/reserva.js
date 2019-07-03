var express = require('express');
var router = express.Router();
var moment = require('moment'); 

router.get('/', function(req, res, next) {
  res.redirect('/reserva/read/');
});
router.get('/read', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT r.id AS rid, r.pessoa_cpf, p.nome, d.nome AS disciplina, r.estado, e.id AS eid, e.dia, e.horario_id, h.inicio, e.sala_numero, r.descricao
    FROM reserva r
    INNER JOIN evento e
    ON r.id = e.reserva_id
    INNER JOIN pessoa p
    ON p.cpf = r.pessoa_cpf
    INNER JOIN horario h
    ON h.id = e.horario_id
    INNER JOIN disciplina d
    ON d.codigo = r.disciplina_codigo
    ORDER BY r.id, e.dia, e.horario_id, e.sala_numero`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(result, index){this[index].dia = moment(this[index].dia).format('DD/MM/YYYY'); }, results);
    res.render('reserva', { title: 'express', reservas: results });
  });
});

router.get('/read/:id', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT r.id AS rid, r.pessoa_cpf, p.nome, d.nome AS disciplina, r.estado, e.id AS eid, e.dia, e.horario_id, h.inicio, e.sala_numero, r.descricao
    FROM reserva r
    INNER JOIN evento e
    ON r.id = e.reserva_id
    INNER JOIN pessoa p
    ON p.cpf = r.pessoa_cpf
    INNER JOIN horario h
    ON h.id = e.horario_id
    INNER JOIN disciplina d
    ON d.codigo = r.disciplina_codigo
    WHERE r.id = ${req.params.id}
    ORDER BY r.id, e.dia, e.horario_id, e.sala_numero`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(result, index){this[index].dia = moment(this[index].dia).format('DD/MM/YYYY'); }, results);
    res.render('reservar', { title: 'express', eventos: results, rid: req.params.id });
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

router.get('/update', function(req, res, next) {
  res.redirect('/reserva/read/');
});
router.get('/update/:id', function(req, res, next) {
  var horarios = [];
  var salas = [];
  var disciplinas = [];
  var pessoas = [];
  var formdata;


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

          var aux = 
            `
            SELECT pessoa_cpf AS dados FROM reserva WHERE id = ${req.params.id}
            UNION ALL
            SELECT GROUP_CONCAT(DISTINCT horario_id) FROM evento WHERE reserva_id = ${req.params.id} GROUP BY reserva_id
            UNION ALL
            SELECT disciplina_codigo FROM reserva WHERE id = ${req.params.id}
            UNION ALL
            SELECT descricao FROM reserva WHERE id = ${req.params.id}
            UNION ALL
            SELECT CONCAT(MIN(dia), ",", MAX(dia)) FROM evento WHERE reserva_id = ${req.params.id}
            UNION ALL
            SELECT GROUP_CONCAT(DISTINCT (WEEKDAY(dia)+1)) FROM evento WHERE reserva_id = ${req.params.id} GROUP BY reserva_id
            UNION ALL
            SELECT GROUP_CONCAT(DISTINCT sala_numero) FROM evento WHERE reserva_id = ${req.params.id} GROUP BY reserva_id;
            `;
          db.query(aux, function (error, results, fields) {
            if (error) throw error;
            formdata = {
                cpf:results[0].dados,
                horario:results[1].dados,
                disciplina:results[2].dados,
                descricao:results[3].dados,
                periodo:results[4].dados.split(','),
                dias:results[5].dados.split(',').map(function(value){return parseInt(value);}),
                salas:results[6].dados.split(',').map(function(value){return parseInt(value);})
            };
            console.log(formdata);
            //res.send("gudu");
            res.render('reservau', { title: 'criando usuario', rid:req.params.id, horarios: horarios, salas: salas, pessoas: pessoas, disciplinas: disciplinas, formdata: formdata });
          });
        });
      });
    });
  });
});
router.post('/update', function(req, res, next) {
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
    `UPDATE reserva SET
    estado = 0,
    disciplina_codigo = ${req.body.disciplina}, 
    descricao = "${req.body.descricao.substring(0, 144)}"
    WHERE id = ${req.body.rid}`;
  console.log(aux);
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    //reserva_id, id, dia, horario_id, sala_numero
    var aux = 
      `DELETE FROM evento
      WHERE reserva_id = ${req.body.rid}`;
    db.query(aux, function(error, results, fields){
      if (error) throw error;
      var aux = `INSERT INTO evento VALUES `;
      var auxQvals = [];
      dias.forEach(function(dia){
        salas.forEach(function(sala){
          auxQvals.push( `(
            ${req.body.rid},
            NULL,
            "${dia}",
            ${req.body.horario},
            ${sala}
          )`);
        });
      });
      aux += auxQvals.join(', ');
      db.query(aux, function(error, results, fields){
        if (error) throw error;
        res.redirect('/reserva/read/'+req.body.rid);
      });
    });
  });
});

router.get('/remove', function(req, res, next) {
  res.redirect('/reserva/read/');
});
router.get('/remove/:id', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `DELETE FROM evento
    WHERE reserva_id = ${req.params.id}`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    var aux = 
    `DELETE FROM reserva
    WHERE id = ${req.params.id}`;
    db.query(aux, function (error, results, fields) {
      if (error) throw error;
      res.redirect('/reserva/read/');
    });
  });
});


module.exports = router;
