import sys
import subprocess

try:
    from colorthief import ColorThief
except ImportError:
    print("Instalando biblioteca 'colorthief'...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "colorthief"])
    from colorthief import ColorThief

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def main():
    image_path = "/home/Cadu/Área de trabalho/Faculdade/Henning 2026.1/AuMiau/frontend/imagens/identidade_visual.png"
    output_path = "/home/Cadu/Área de trabalho/Faculdade/Henning 2026.1/AuMiau/frontend/css/palette.css"
    
    print("Extraindo cores com ColorThief...")
    color_thief = ColorThief(image_path)
    
    # Extrair cor dominante
    dominant_color = color_thief.get_color(quality=1)
    
    # Extrair paleta de 5 cores
    palette = color_thief.get_palette(color_count=6, quality=1)
    
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w") as f:
        f.write("/* Paleta de Cores extraída da Identidade Visual */\n")
        f.write(":root {\n")
        f.write(f"  /* Cor Dominante */\n")
        f.write(f"  --cor-dominante: {rgb_to_hex(dominant_color)};\n\n")
        
        f.write(f"  /* Paleta Extraída */\n")
        for i, color in enumerate(palette):
            f.write(f"  --cor-paleta-{i+1}: {rgb_to_hex(color)};\n")
        f.write("}\n")
        
    print(f"Arquivo CSS gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    main()
