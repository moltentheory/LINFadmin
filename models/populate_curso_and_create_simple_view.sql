insert into curso (curso.codigo, curso.nome, curso.turno)
values
	(1, 'Ciência da Computação', 0),
    (2, 'Computação', 1),
    (3, 'Engenharia da Computação', 0);
    
insert into disciplina_curso (disciplina_curso.curso_codigo, disciplina_curso.disciplina_codigo)
values
	(1, 1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),
    (2,3),(2,5),(2,6),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),
    (2,21),(3,3),(3,20),(3,21),(3,23),(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(3,30),(3,31),(3,32),(3,33);

CREATE OR REPLACE VIEW curso_relacoes AS
    SELECT 
        curso.codigo 'Cód.',
        curso.nome 'Nome',
        CASE
            WHEN (curso.turno = 0) THEN 'Diurno'
            ELSE 'Noturno'
        END 'Turno',
        disciplina.nome 'Disciplina',
        departamento.nome 'Departamento'
    FROM
        curso
            INNER JOIN
        disciplina_curso ON curso.codigo = disciplina_curso.curso_codigo
            INNER JOIN
        disciplina ON disciplina.codigo = disciplina_curso.disciplina_codigo
            INNER JOIN
        departamento ON disciplina.departamento_id = departamento.id
    ORDER BY curso.nome;

select * from curso_relacoes;