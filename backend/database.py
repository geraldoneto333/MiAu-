# Configuração e conexão com o banco de dados MariaDB/MySQL - [João Paulo Paz]
# Inicializa conexão e gerencia pool de conexões usando variáveis de ambiente. Licença MIT [João Paulo Paz]
import os
import pymysql

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'root'),
    'database': os.getenv('DB_NAME', 'miau_db'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'cursorclass': pymysql.cursors.DictCursor,
    'autocommit': True
}

def get_db():
    connection = pymysql.connect(**DB_CONFIG)
    try:
        yield connection
    finally:
        connection.close()
