-- 1. USUÁRIOS (Para acessar o sistema)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TUTORES (Os donos)
CREATE TABLE tutores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    contato VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PETS (Apenas Cachorro e Gato, vinculados ao Tutor)
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    -- Aqui garantimos que o sistema só aceite essas duas espécies
    especie ENUM('Cachorro', 'Gato') NOT NULL, 
    raca VARCHAR(50),
    sexo ENUM('M', 'F') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pet_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
);

-- 4. SERVIÇOS (O que é feito na clínica)
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL, -- Ex: "Banho e Tosa Completa - Gato"
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. AGENDAMENTOS (O núcleo do sistema)
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    pet_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    status ENUM('Agendado', 'Em Andamento', 'Concluido', 'Cancelado') DEFAULT 'Agendado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agend_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE,
    CONSTRAINT fk_agend_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    CONSTRAINT fk_agend_servico FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);

-- 6. AVISOS (O Mural da Tela Inicial)
CREATE TABLE avisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Urgente', 'Aviso', 'Lembrete') NOT NULL,
    mensagem TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DADOS INICIAIS (DEFAULT)
-- ==========================================================

-- Inserindo o Usuário Administrador Padrão (Conforme solicitado)
INSERT INTO usuarios (username, email, senha_hash) 
VALUES ('ShardCadu', 'cadu.sport@miau.com', 'cadu123');
