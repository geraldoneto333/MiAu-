import sys
import os
import pymysql

# Configurações do Banco de Dados
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'miau_db',
    'autocommit': True
}

def popular_banco_teste():
    try:
        print("Conectando ao banco 'miau_db' para inserção de dados de teste...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()

        # 1. Inserir Tutores
        print("Inserindo Tutores...")
        tutores_data = [
            ('João Silva', 'joao@email.com', '(11) 98888-1111', 'Rua das Flores, 123'),
            ('Maria Oliveira', 'maria@email.com', '(11) 97777-2222', 'Av. Paulista, 1000'),
            ('Carlos Souza', 'carlos@email.com', '(11) 96666-3333', 'Rua Augusta, 500')
        ]
        cursor.executemany(
            "INSERT INTO tutores (nome, contato, telefone, endereco) VALUES (%s, %s, %s, %s)",
            tutores_data
        )

        # 2. Inserir Pets
        print("Inserindo Pets...")
        pets_data = [
            (1, 'Rex', 'Cachorro', 'Golden Retriever', 'M'),
            (1, 'Mia', 'Gato', 'Siamês', 'F'),
            (2, 'Thor', 'Cachorro', 'Bulldog', 'M'),
            (3, 'Luna', 'Gato', 'Persa', 'F')
        ]
        cursor.executemany(
            "INSERT INTO pets (tutor_id, nome, especie, raca, sexo) VALUES (%s, %s, %s, %s, %s)",
            pets_data
        )

        # 3. Inserir Serviços
        print("Inserindo Serviços...")
        servicos_data = [
            ('Banho e Tosa - Porte Pequeno', 'Banho completo, tosa higiênica e corte de unhas.', 80.00),
            ('Consulta Veterinária', 'Consulta clínica geral com médico veterinário.', 150.00),
            ('Vacinação V10', 'Aplicação de vacina V10 importada.', 120.00)
        ]
        cursor.executemany(
            "INSERT INTO servicos (nome, descricao, preco) VALUES (%s, %s, %s)",
            servicos_data
        )

        # 4. Inserir Agendamentos
        print("Inserindo Agendamentos...")
        agendamentos_data = [
            (1, 1, 2, '2026-06-15 10:00:00', 'Agendado'),
            (2, 3, 1, '2026-06-15 14:30:00', 'Agendado'),
            (3, 4, 3, '2026-06-16 09:00:00', 'Agendado')
        ]
        cursor.executemany(
            "INSERT INTO agendamentos (tutor_id, pet_id, servico_id, data_hora, status) VALUES (%s, %s, %s, %s, %s)",
            agendamentos_data
        )

        # 5. Inserir Avisos
        print("Inserindo Avisos (Mural)...")
        avisos_data = [
            ('Urgente', 'Falta de água programada para amanhã às 14h. Remarcar banhos.'),
            ('Aviso', 'A Dra. Ana estará de licença médica nesta sexta-feira.'),
            ('Lembrete', 'Checar validade das vacinas no estoque da sala 2.')
        ]
        cursor.executemany(
            "INSERT INTO avisos (tipo, mensagem) VALUES (%s, %s)",
            avisos_data
        )

        print("✅ Dados de teste inseridos com sucesso!")

    except pymysql.MySQLError as e:
        print(f"❌ Erro ao popular banco: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()

if __name__ == "__main__":
    popular_banco_teste()
