SELECT 
    evento.sala_numero Sala,
    evento.dia 'Data',
    horario.inicio 'Hora de Início',
    horario.fim 'Hora do Término',
    pessoa.nome 'Reservado por',
    cargo.titulo Cargo,
    reserva.descricao Descrição
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
    dia > CURRENT_DATE() + 14
;

SELECT 
    evento.sala_numero Sala,
    evento.dia 'Data',
    horario.inicio 'Hora de Início',
    horario.fim 'Hora de Término',
    reserva.descricao Descrição
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
;

SELECT 
    pessoa.nome Nome,
    pessoa.email 'E-mail',
    -- pessoa.foto Foto,
    -- pessoa.foto_type Fototype,
    departamento.nome Departamento,
    historico.hora_entrada 'Hora de Entrada'
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
;

SELECT 
    historico.hora_entrada 'Horário de Entrada',
    historico.hora_saida 'Horário de Saída',
    cargo.titulo Cargo,
    pessoa.matricula Matrícula,
    pessoa.nome Nome,
    pessoa.email 'E-mail',
    -- pessoa.foto Foto,
    -- pessoa.foto_type Fototype,
    departamento.nome Departamento
FROM
    pessoa
        INNER JOIN
    cargo ON pessoa.cargo_id = cargo.id
        INNER JOIN
    departamento ON pessoa.departamento_id = departamento.id
        INNER JOIN
    historico ON pessoa.cpf = historico.pessoa_cpf
WHERE
    historico.hora_entrada > CURRENT_DATE() - 31;
    
SELECT 
    evento.sala_numero Sala,
    evento.dia 'Data',
    horario.inicio 'Hora de Início',
    horario.fim 'Hora do Término',
    reserva.descricao Descrição,
    disciplina.nome Disciplina,
    departamento.nome Departamento,
    pessoa.nome 'Reservado por'
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
    pessoa ON reserva.pessoa_cpf = pessoa.cpf;