var express = require('express');
var router = express.Router();
var moment = require('moment')

router.get('/', function(req, res, next) {
  var horarioatual = 0;
  var horarios = [];
  var salas = [];

  var db = req.app.get('db');
  db.query('SELECT * FROM horario', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { 
      horarios.push({id: item.id, inicio: item.inicio, fim: item.fim});
      if( moment(item.fim, "HH:mm:ss").diff(moment(), 'minutes') < 0  ) horarioatual = item.id;
    });
    horarioatual++;

    db.query('SELECT * FROM sala', function (error, results, fields) {
      if (error) throw error;
      results.forEach(function(item) { salas.push({numero: item.numero}) });

      var aux = 
        `SELECT r.pessoa_cpf, p.nome, d.nome AS disciplina, r.estado, e.dia, e.horario_id, e.sala_numero, r.descricao
        FROM reserva r
        INNER JOIN evento e
        ON r.id = e.reserva_id
        INNER JOIN pessoa p
        ON p.cpf = r.pessoa_cpf
        INNER JOIN disciplina d
        ON d.codigo = r.disciplina_codigo
        WHERE r.estado = 2
        AND
          (e.dia = CURRENT_DATE()
          OR e.dia = CURRENT_DATE()+1)
        ORDER BY r.id, e.dia, e.horario_id, e.sala_numero`;
      db.query(aux, function (error, results, fields) {
        if (error) throw error;
        results.forEach(function(result, index){this[index].dia = moment(this[index].dia).format('DD/MM/YYYY'); }, results);
        res.render('programacao', { title: 'Programação do dia', eventos: results, horarios, salas, horarioatual, diaatual: moment().format('DD/MM/YYYY')});
      });
    });
  });
});

module.exports = router;
