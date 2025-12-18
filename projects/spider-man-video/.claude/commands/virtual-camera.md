# Virtual Camera - Cria sistema de câmera virtual estilo Alt Shift X
# Uso: /virtual-camera [tipo] [descrição]
# Exemplo: /virtual-camera "comic-analysis" "Análise do Spider-Man vs Venom"

Crie uma estrutura de Virtual Camera 2D para Remotion seguindo o estilo Alt Shift X:

## Componentes Obrigatórios:

### 1. VirtualCamera
- Aceitar prop 'scenes' com: { startFrame, duration, x, y, zoom, content: ReactNode }
- Use 'interpolate' e 'spring' para movimentos suaves
- Matemática: transform inverso da coordenada (se cena está em x=500, div move para translateX(-500px))
- Transform-origin sempre no centro da tela
- Envolvido com CameraMotionBlur para efeito cinematográfico

### 2. TheWorld
- Container gigante (10.000x10.000px) para posicionamento absoluto
- Onde todas as imagens/assets ficam posicionados

### 3. ComicPanel
- Componente para posicionar imagens de quadrinhos: x, y, scale, rotation
- Otimizado para performance

### 4. Cena Específica
Tipo: {tipo}
Descrição: {descrição}

## Requisitos:
- Crie array de cenas exemplo baseado na descrição
- Inclua CameraMotionBlur com shutterAngle={180}
- Sistema ready para assets de quadrinhos Marvel/DC
- Performance otimizada para não travar

## Output:
Código TypeScript completo para Composition.tsx e componentes auxiliares

Gere o sistema completo agora.