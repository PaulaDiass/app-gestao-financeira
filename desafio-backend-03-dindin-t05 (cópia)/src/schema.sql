CREATE DATABASE dindin;

CREATE TABLE IF NOT EXISTS usuarios(
    id serial primary key,
    nome varchar(100) not null,
    email varchar(80) unique not null,
    senha text not null
 );

CREATE TABLE IF NOT EXISTS categorias(
    id serial primary key,
    descricao varchar(80)
);

CREATE TABLE IF NOT EXISTS transacoes(
    id serial primary key,
    descricao varchar(100),
    valor bigint not null,
    data text not null,
    categoria_id integer not null,
    usuario_id integer not null,
    tipo varchar(10) not null,
    foreign key (categoria_id) references categorias(id),
    foreign key (usuario_id) references usuarios(id)
);

INSERT INTO categorias(descricao) VALUES('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');
