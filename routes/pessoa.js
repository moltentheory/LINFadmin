var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({storage: multer.memoryStorage(), limits: {fileSize: 1000 * 1000 * 2}});

/* READ */
router.get('/', function(req, res, next) {
  res.redirect('/pessoa/read/');
});
router.get('/read', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT nome, cpf 
    FROM pessoa
    ORDER BY nome`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.render('pessoa', { title: 'express', pessoas: results });
  });
});
router.get('/read/:cpf', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `SELECT p.cpf, p.senha, p.nome, p.email, p.matricula, p.foto, p.foto_type, d.nome AS departamento, c.titulo AS cargo 
    FROM pessoa p
    INNER JOIN departamento d 
    ON p.departamento_id = d.id 
    INNER JOIN cargo c 
    ON p.cargo_id = c.id
    WHERE p.cpf = ${req.params.cpf} `;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    //console.log('The solution is: ', results);
    res.render('pessoar', { title: 'express', pessoa: results[0] });
  });
});

router.get('/create', function(req, res, next) {
  var cargos = [];
  var departamentos = [];

  var db = req.app.get('db');
  db.query('SELECT * FROM cargo', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { cargos.push({id: item.id, titulo: item.titulo}) });

    db.query('SELECT * FROM departamento', function (error, results, fields) {
      if (error) throw error;
      results.forEach(function(item) { departamentos.push({id: item.id, nome: item.nome}) });
      
      res.render('pessoac', { title: 'criando usuario', departamentos: departamentos, cargos: cargos });
    });
  });
});
router.post('/create', upload.single('foto'), function(req, res, next) {
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
    res.redirect('/pessoa/read/'+req.body.cpf);
  });
});

router.get('/update', function(req, res, next) {
  res.redirect('/pessoa/read/');
});
router.get('/update/:cpf', function(req, res, next) {
  var cargos = [];
  var departamentos = [];

  var db = req.app.get('db');
  db.query('SELECT * FROM cargo', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item) { cargos.push({id: item.id, titulo: item.titulo}) });

    db.query('SELECT * FROM departamento', function (error, results, fields) {
      if (error) throw error;
      results.forEach(function(item) { departamentos.push({id: item.id, nome: item.nome}) });

      var aux = 
        `SELECT *
        FROM pessoa
        WHERE cpf = ${req.params.cpf} `;
      db.query(aux, function (error, results, fields) {
        if (error) throw error;
        res.render('pessoau', { title: 'express', pessoa: results[0], departamentos: departamentos, cargos: cargos });
      });
    });
  });
});
router.post('/update', upload.single('foto'), function(req, res, next) {
  // info validation todo

  //if (req.file);
  var db = req.app.get('db');
  //cpf, senha, nome, email, matricula, foto, departamento_id, cargo_id
  var aux = 
    `UPDATE pessoa 
    SET
    senha = "${req.body.senha}", 
    nome = "${req.body.nome}", 
    email = "${req.body.email}", 
    matricula = ${req.body.matricula}, 
    ${(req.file)?(`foto = "${req.file.buffer.toString('base64')}", 
    foto_type = "${req.file.mimetype}", `):(``)}
    departamento_id = ${req.body.departamento}, 
    cargo_id = ${req.body.cargo}
    WHERE cpf = ${req.body.cpf}`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/pessoa/read/'+req.body.cpf);
  });
});

router.get('/delete', function(req, res, next) {
  res.redirect('/pessoa/read/');
});
router.get('/delete/:cpf', function(req, res, next) {
  var db = req.app.get('db');
  var aux = 
    `DELETE FROM pessoa
    WHERE cpf = ${req.params.cpf}`;
  db.query(aux, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/pessoa/read/');
  });
});


module.exports = router;
