-- Tabela de Usuários para autenticação do sistema - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL
);

-- Tabela para cadastrar os donos dos pets - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Tutores (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Contato VARCHAR(100),
    Endereco VARCHAR(255),
    Telefone VARCHAR(20)
);

-- Tabela de Pets com relacionamento (Foreign Key) para a tabela Tutores - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Pets (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Especie VARCHAR(50) NOT NULL,
    Raca VARCHAR(50),
    Sexo CHAR(1),
    TutorId INT,
    FOREIGN KEY (TutorId) REFERENCES Tutores(Id) ON DELETE CASCADE
);

-- Tabela de Serviços oferecidos pelo Petshop - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Servicos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT,
    Preco DECIMAL(10, 2) NOT NULL
);

-- Tabela de Produtos vendidos no Petshop - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Produtos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT,
    Preco DECIMAL(10, 2) NOT NULL,
    Estoque INT DEFAULT 0
);

-- Tabela de Agendamentos conectando Tutor, Pet e Serviço - [Carlos Eduardo]
CREATE TABLE IF NOT EXISTS Agendamentos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TutorId INT,
    PetId INT,
    ServicoId INT,
    DataHora DATETIME NOT NULL,
    Status VARCHAR(50) DEFAULT 'Pendente',
    FOREIGN KEY (TutorId) REFERENCES Tutores(Id) ON DELETE CASCADE,
    FOREIGN KEY (PetId) REFERENCES Pets(Id) ON DELETE CASCADE,
    FOREIGN KEY (ServicoId) REFERENCES Servicos(Id) ON DELETE CASCADE
);

-- Inserção do usuário administrador padrão em texto puro - [Carlos Eduardo]
-- INSERT INTO Usuarios (Id, Username, Email, Senha) VALUES (1, 'ShardCadu', 'cadu.sport@gmail.com', 'cadu123');
