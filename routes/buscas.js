var express = require('express');
var router = express.Router();
var moment = require('moment'); 

router.get('/', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT 
        evento.sala_numero sala,
        evento.dia data,
        horario.inicio inicio,
        horario.fim fim,
        pessoa.nome nome,
        cargo.titulo cargo,
        reserva.descricao descricao
    FROM
        evento
            INNER JOIN
        horario ON evento.horario_id = horario.id
            INNER JOIN
        reserva ON evento.reserva_id = reserva.id
            INNER JOIN
        pessoa ON reserva.pessoa_cpf = pessoa.cpf
            INNER JOIN
        cargo ON pessoa.cargo_id = cargo.id
    WHERE
        dia < CURRENT_DATE() + 14
    ;`;
    db.query(aux, function (error, results, fields) {
        if (error) throw error;
        results.forEach(function(result, index){this[index].inicio = moment(this[index].inicio, 'HH:mm:ss').format('HH:mm'); }, results);
        results.forEach(function(result, index){this[index].fim = moment(this[index].fim, 'HH:mm:ss').format('HH:mm'); }, results);
        var q1 = results;

    var aux = 
    `SELECT 
        evento.sala_numero sala,
        evento.dia data,
        horario.inicio inicio,
        horario.fim fim,
        reserva.descricao descricao
    FROM
        evento
            INNER JOIN
        horario ON evento.horario_id = horario.id
            INNER JOIN
        reserva ON evento.reserva_id = reserva.id
            INNER JOIN
        disciplina ON reserva.disciplina_codigo = disciplina.codigo
            INNER JOIN
        departamento ON disciplina.departamento_id = departamento.id
    WHERE
        departamento.nome = 'DEPARTAMENTO DE CIÊNCIA DA COMPUTAÇÃO'
    ;`;
    db.query(aux, function (error, results, fields) {
        if (error) throw error;
        results.forEach(function(result, index){this[index].inicio = moment(this[index].inicio, 'HH:mm:ss').format('HH:mm'); }, results);
        results.forEach(function(result, index){this[index].fim = moment(this[index].fim, 'HH:mm:ss').format('HH:mm'); }, results);
        var q2 = results;

        var aux = 
        `SELECT 
            pessoa.nome nome,
            pessoa.email email,
            departamento.nome departamento,
            historico.hora_entrada entrada
        FROM
            pessoa
                INNER JOIN
            cargo ON pessoa.cargo_id = cargo.id
                INNER JOIN
            departamento ON pessoa.departamento_id = departamento.id
                INNER JOIN
            historico ON pessoa.cpf = historico.pessoa_cpf
        WHERE
            cargo.titulo = 'Professor'
        ;`;
        db.query(aux, function (error, results, fields) {
            if (error) throw error;
            results.forEach(function(result, index){this[index].entrada = moment(this[index].entrada, 'HH:mm:ss').format('HH:mm'); }, results);
            var q3 = results;

            var aux = 
                `SELECT 
                    historico.hora_entrada entrada,
                    historico.hora_saida saida,
                    cargo.titulo cargo,
                    pessoa.matricula matricula,
                    pessoa.nome nome,
                    pessoa.email email,
                    departamento.nome departamento
                FROM
                    pessoa
                        INNER JOIN
                    cargo ON pessoa.cargo_id = cargo.id
                        INNER JOIN
                    departamento ON pessoa.departamento_id = departamento.id
                        INNER JOIN
                    historico ON pessoa.cpf = historico.pessoa_cpf
                WHERE
                    historico.hora_entrada > CURRENT_DATE() - 31;`;
            db.query(aux, function (error, results, fields) {
                if (error) throw error;
                results.forEach(function(result, index){this[index].entrada = moment(this[index].entrada).format('DD/MM/YYYY HH:mm'); }, results);
                results.forEach(function(result, index){this[index].saida = moment(this[index].saida).format('DD/MM/YYYY HH:mm'); }, results);
                var q4 = results;
                var aux = 
                `SELECT 
                    evento.sala_numero sala,
                    evento.dia data,
                    horario.inicio inicio,
                    horario.fim fim,
                    reserva.descricao descricao,
                    disciplina.nome disciplina,
                    departamento.nome departamento,
                    pessoa.nome nome
                FROM
                    reserva
                        INNER JOIN
                    evento ON reserva.id = evento.reserva_id
                        INNER JOIN
                    horario ON evento.horario_id = horario.id
                        INNER JOIN
                    disciplina ON reserva.disciplina_codigo = disciplina.codigo
                        INNER JOIN
                    departamento ON disciplina.departamento_id = departamento.id
                        INNER JOIN
                    pessoa ON reserva.pessoa_cpf = pessoa.cpf;`;
                db.query(aux, function (error, results, fields) {
                    if (error) throw error;
                    results.forEach(function(result, index){this[index].inicio = moment(this[index].inicio, 'HH:mm:ss').format('HH:mm'); }, results);
                    results.forEach(function(result, index){this[index].fim = moment(this[index].fim, 'HH:mm:ss').format('HH:mm'); }, results);
                    var q5 = results;
                    res.render('buscas', { title: 'express', q1, q2, q3, q4, q5});
                });
            });
        });
    });
  });
});


module.exports = router;
