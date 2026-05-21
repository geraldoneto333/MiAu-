import sys
import subprocess
import os

try:
    import pymysql
except ImportError:
    print("Instalando pacote 'pymysql'...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymysql", "cryptography"])
    import pymysql

# Configurações do Banco de Dados
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'autocommit': True
}
DATABASE_NAME = 'miau_db'

def reset_and_setup_database():
    try:
        print(f"Conectando ao MariaDB (Host: {DB_CONFIG['host']}, User: {DB_CONFIG['user']})...")
        
        # 1. Conexão inicial para dropar e recriar o banco
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print(f"Zerando o banco de dados '{DATABASE_NAME}' (se existir)...")
        cursor.execute(f"DROP DATABASE IF EXISTS {DATABASE_NAME};")
        
        print(f"Criando o banco de dados '{DATABASE_NAME}'...")
        cursor.execute(f"CREATE DATABASE {DATABASE_NAME};")
        
        # 2. Selecionar o banco recém-criado
        cursor.execute(f"USE {DATABASE_NAME};")
        print(f"Conectado ao banco '{DATABASE_NAME}' com sucesso!")

        # 3. Ler o arquivo schema.sql
        sql_file_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()

        # Separar os comandos por ';'
        commands = sql_script.split(';')
        
        # 4. Executar a criação das tabelas
        print("Executando script de criação das tabelas...")
        for command in commands:
            cmd = command.strip()
            if cmd:
                # print(f"Executando: {cmd.split(chr(10))[0]}...")
                cursor.execute(cmd)

        print("✅ Banco de dados zerado e tabelas recriadas com sucesso (incluindo usuário admin via schema)!")

    except pymysql.MySQLError as e:
        print(f"❌ Erro de Banco de Dados: {e}")
    except Exception as e:
        print(f"❌ Erro Inesperado: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
            print("Conexão encerrada.")

if __name__ == "__main__":
    reset_and_setup_database()
