DROP DATABASE IF EXISTS linf;
CREATE DATABASE linf;
USE linf;

CREATE TABLE IF NOT EXISTS departamento
	(id int primary key auto_increment not null,
    nome varchar(72) not null);

CREATE TABLE IF NOT EXISTS cargo
	(id int primary key auto_increment not null,
    titulo varchar(72) not null);

CREATE TABLE IF NOT EXISTS horario
	(id int primary key auto_increment not null,
    inicio time not null,
    fim time not null);
    
CREATE TABLE IF NOT EXISTS sala
	(numero int primary key auto_increment not null);

CREATE TABLE IF NOT EXISTS pessoa
	(cpf bigint(11) primary key auto_increment not null,
    senha varchar(32) not null,
    nome varchar(128) not null,
    email varchar(128) not null,
    matricula int not null,
    foto mediumtext,
    foto_type varchar(32),
    departamento_id int not null references departamento (id),
    cargo_id int not null references cargo (id));

CREATE TABLE IF NOT EXISTS reserva
	(id int primary key auto_increment not null,
    pessoa_cpf int not null references pessoa (cpf),
    estado boolean,
    descricao varchar(144),
    disciplina_codigo int references disciplina (codigo));

CREATE TABLE IF NOT EXISTS evento
	(reserva_id int not null references reserva (id),
    id int auto_increment not null primary key,
    dia date not null,
    horario_id int not null references horario (id),
    sala_numero int not null references sala (numero));

CREATE TABLE IF NOT EXISTS curso
	(codigo int primary key auto_increment not null,
    nome varchar(72) not null,
    turno int not null);

CREATE TABLE IF NOT EXISTS disciplina
	(codigo int primary key auto_increment not null,
    nome varchar(72) not null,
    departamento_id int references departamento (id));
        
CREATE TABLE IF NOT EXISTS historico
	(id int primary key auto_increment not null,
    hora_entrada timestamp not null,
    hora_saida timestamp,
    pessoa_cpf int references pessoa (cpf));
    
CREATE TABLE IF NOT EXISTS disciplina_curso
	(disciplina_codigo int references disciplina (codigo),
    curso_codigo int references curso (codigo),
    primary key (`disciplina_codigo`, `curso_codigo`));
