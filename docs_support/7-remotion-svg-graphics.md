# Remotion - SVG & Complex Graphics Guide

## 📋 Visão Geral

Remotion fornece pacotes poderosos para trabalhar com SVG paths, shapes e gráficos complexos. Ideal para criar visualizações de dados, relationship graphs e efeitos visuais avançados.

## 📦 Pacotes Principais

### @remotion/paths
Manipulação e análise de SVG paths.

```bash
npm install @remotion/paths
```

### @remotion/shapes
Geração de formas SVG programaticamente.

```bash
npm install @remotion/shapes
```

## 🎨 @remotion/paths - Utility Functions

### getLength()
Obter comprimento total de um path SVG.

```tsx
import { getLength } from '@remotion/paths';

const path = "M 0 0 L 100 100 L 200 0";
const length = getLength(path);
console.log(length); // ~282.84
```

### cutPath()
Cortar um path em um ponto específico.

```tsx
import { cutPath } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const { path1, path2 } = cutPath(path, 50);
// path1: primeira metade
// path2: segunda metade
```

### getPointAtLength()
Obter coordenadas em um ponto específico do path.

```tsx
import { getPointAtLength } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const point = getPointAtLength(path, 50);
console.log(point); // { x: 35.35, y: 35.35 }
```

### getTangentAtLength()
Obter tangentes (direção) em um ponto do path.

```tsx
import { getTangentAtLength } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const tangent = getTangentAtLength(path, 50);
console.log(tangent); // { x: 0.707, y: 0.707 }
```

### reversePath()
Inverter direção de um path.

```tsx
import { reversePath } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const reversed = reversePath(path);
// Agora vai de (100,100) para (0,0)
```

### evolvePath()
**Animar um path sendo desenhado** (muito usado!).

```tsx
import { evolvePath } from '@remotion/paths';
import { useCurrentFrame } from 'remotion';

export const DrawPath = () => {
  const frame = useCurrentFrame();
  const path = "M 0 0 L 100 100 L 200 0";
  
  const progress = Math.min(1, frame / 60);
  const evolvedPath = evolvePath(progress, path);
  
  return (
    <svg width={200} height={100}>
      <path
        d={evolvedPath}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};
```

### interpolatePath()
Interpolar entre dois paths SVG (morphing).

```tsx
import { interpolatePath } from '@remotion/paths';
import { useCurrentFrame } from 'remotion';

export const MorphPath = () => {
  const frame = useCurrentFrame();
  
  const path1 = "M 0 0 L 100 0 L 100 100 L 0 100 Z"; // Quadrado
  const path2 = "M 50 0 L 100 50 L 50 100 L 0 50 Z"; // Diamante
  
  const progress = Math.min(1, frame / 60);
  const morphedPath = interpolatePath(progress, path1, path2);
  
  return (
    <svg width={100} height={100}>
      <path d={morphedPath} fill="blue" />
    </svg>
  );
};
```

### translatePath()
Mover path para nova posição.

```tsx
import { translatePath } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const translated = translatePath(path, 50, 50);
// Agora começa em (50, 50)
```

### scalePath()
Aumentar/diminuir tamanho do path.

```tsx
import { scalePath } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const scaled = scalePath(path, 2); // 2x maior
```

### getBoundingBox()
Obter bounding box de um path.

```tsx
import { getBoundingBox } from '@remotion/paths';

const path = "M 10 10 L 100 100";
const bbox = getBoundingBox(path);
console.log(bbox);
// { x: 10, y: 10, width: 90, height: 90 }
```

## 🔷 @remotion/shapes - Gerar Formas

### makeRect() / <Rect />
Criar retângulo.

```tsx
import { Rect, makeRect } from '@remotion/shapes';

// Usando componente
<svg>
  <Rect width={100} height={50} fill="blue" />
</svg>

// Ou path puro
const rectPath = makeRect({ width: 100, height: 50 });
<path d={rectPath} />
```

### makeCircle() / <Circle />
Criar círculo.

```tsx
import { Circle, makeCircle } from '@remotion/shapes';

<svg>
  <Circle radius={50} fill="red" />
</svg>

const circlePath = makeCircle({ radius: 50 });
```

### makeEllipse() / <Ellipse />
Criar elipse.

```tsx
import { Ellipse, makeEllipse } from '@remotion/shapes';

<Ellipse rx={100} ry={50} fill="green" />

const ellipsePath = makeEllipse({ rx: 100, ry: 50 });
```

### makeTriangle() / <Triangle />
Criar triângulo.

```tsx
import { Triangle, makeTriangle } from '@remotion/shapes';

<Triangle
  length={100}
  direction="up" // "up", "down", "left", "right"
  fill="yellow"
/>
```

### makeStar() / <Star />
Criar estrela.

```tsx
import { Star, makeStar } from '@remotion/shapes';

<Star
  points={5}
  innerRadius={30}
  outerRadius={60}
  fill="gold"
/>
```

### makePolygon() / <Polygon />
Criar polígono regular.

```tsx
import { Polygon, makePolygon } from '@remotion/shapes';

<Polygon
  points={6}  // Hexágono
  radius={50}
  fill="purple"
/>
```

### makeHeart() / <Heart />
Criar coração.

```tsx
import { Heart, makeHeart } from '@remotion/shapes';

<Heart width={100} fill="red" />
```

### makePie() / <Pie />
Criar fatia de pizza/gráfico.

```tsx
import { Pie, makePie } from '@remotion/shapes';

<Pie
  radius={100}
  progress={0.75}  // 75% do círculo
  fill="orange"
/>
```

## 🎬 Animação de SVG - Padrões Avançados

### Pattern 1: Draw Line Animation

```tsx
import { evolvePath, getLength } from '@remotion/paths';
import { useCurrentFrame } from 'remotion';

export const DrawLine = () => {
  const frame = useCurrentFrame();
  const path = "M 10 10 L 200 10 L 200 200 L 10 200 Z";
  
  const length = getLength(path);
  const progress = Math.min(1, frame / 120);
  const drawnPath = evolvePath(progress, path);
  
  return (
    <svg width={210} height={210}>
      <path
        d={drawnPath}
        stroke="black"
        strokeWidth={3}
        fill="none"
      />
    </svg>
  );
};
```

### Pattern 2: Animated Pie Chart

```tsx
import { Pie } from '@remotion/shapes';
import { interpolate, useCurrentFrame } from 'remotion';

export const AnimatedPieChart = () => {
  const frame = useCurrentFrame();
  
  const data = [
    { value: 30, color: '#FF6384' },
    { value: 50, color: '#36A2EB' },
    { value: 20, color: '#FFCE56' }
  ];
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  
  return (
    <svg width={400} height={400} viewBox="0 0 400 400">
      {data.map((item, i) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (item.value / total);
        currentAngle = endAngle;
        
        // Animar cada fatia
        const progress = interpolate(
          frame,
          [i * 10, i * 10 + 30],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        return (
          <g key={i} transform="translate(200, 200)">
            <Pie
              radius={150}
              progress={endAngle * progress}
              rotation={startAngle * 360}
              fill={item.color}
            />
          </g>
        );
      })}
    </svg>
  );
};
```

### Pattern 3: Morphing Shapes

```tsx
import { interpolatePath } from '@remotion/paths';
import { makeCircle, makeRect, makeStar } from '@remotion/shapes';
import { interpolate, useCurrentFrame } from 'remotion';

export const MorphingShapes = () => {
  const frame = useCurrentFrame();
  
  const shapes = [
    makeCircle({ radius: 50 }),
    makeRect({ width: 100, height: 100 }),
    makeStar({ points: 5, innerRadius: 30, outerRadius: 60 })
  ];
  
  // Ciclar entre shapes
  const cycle = (frame % 180) / 60; // 0-3
  const currentShape = Math.floor(cycle);
  const nextShape = (currentShape + 1) % shapes.length;
  const progress = cycle - currentShape;
  
  const morphedPath = interpolatePath(
    progress,
    shapes[currentShape],
    shapes[nextShape]
  );
  
  return (
    <svg width={200} height={200} viewBox="-60 -60 120 120">
      <path d={morphedPath} fill="blue" />
    </svg>
  );
};
```

### Pattern 4: Path Following Animation

```tsx
import { getPointAtLength, getTangentAtLength, getLength } from '@remotion/paths';
import { interpolate, useCurrentFrame } from 'remotion';

export const PathFollower = () => {
  const frame = useCurrentFrame();
  const path = "M 0 100 Q 100 0 200 100 T 400 100";
  
  const length = getLength(path);
  const distance = interpolate(frame, [0, 120], [0, length]);
  
  const point = getPointAtLength(path, distance);
  const tangent = getTangentAtLength(path, distance);
  const angle = Math.atan2(tangent.y, tangent.x) * (180 / Math.PI);
  
  return (
    <svg width={400} height={200}>
      {/* Caminho guia */}
      <path d={path} stroke="gray" strokeWidth={1} fill="none" />
      
      {/* Objeto seguindo */}
      <g transform={`translate(${point.x}, ${point.y}) rotate(${angle})`}>
        <circle r={10} fill="red" />
        <polygon points="10,0 -5,5 -5,-5" fill="red" />
      </g>
    </svg>
  );
};
```

### Pattern 5: Network Graph / Relationship Graph

```tsx
import { getPointAtLength } from '@remotion/paths';
import { interpolate, useCurrentFrame, spring } from 'remotion';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

export const NetworkGraph = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const nodes: Node[] = [
    { id: 'A', x: 200, y: 100, label: 'Character A' },
    { id: 'B', x: 400, y: 150, label: 'Character B' },
    { id: 'C', x: 300, y: 300, label: 'Character C' },
  ];
  
  const edges: Edge[] = [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
  ];
  
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  return (
    <svg width={600} height={400}>
      {/* Edges com animação */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from)!;
        const to = nodeMap.get(edge.to)!;
        
        const progress = interpolate(
          frame,
          [i * 15, i * 15 + 30],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.x}
            y1={from.y}
            x2={from.x + (to.x - from.x) * progress}
            y2={from.y + (to.y - from.y) * progress}
            stroke="#666"
            strokeWidth={2}
          />
        );
      })}
      
      {/* Nodes com spring */}
      {nodes.map((node, i) => {
        const scale = spring({
          fps,
          frame: frame - i * 10,
          config: { damping: 10 }
        });
        
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r={30 * scale}
              fill="#4CAF50"
              stroke="white"
              strokeWidth={3}
            />
            <text
              textAnchor="middle"
              dy="0.3em"
              fill="white"
              fontSize={14}
              style={{ opacity: scale }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
```

## 🎨 Importar de Figma

Você pode exportar designs do Figma como SVG e importar no Remotion.

```tsx
// 1. Exporte do Figma como SVG
// 2. Copie o código SVG
// 3. Use no Remotion:

export const FigmaDesign = () => {
  return (
    <svg viewBox="0 0 100 100">
      {/* Cole o código SVG do Figma aqui */}
      <path d="..." fill="..." />
    </svg>
  );
};

// 4. Anime usando evolvePath ou interpolatePath
```

## 🔧 Helpers Úteis

### createSmoothSvgPath()
Criar paths suaves a partir de pontos.

```tsx
import { createSmoothSvgPath } from '@remotion/media-utils';

const points = [
  { x: 0, y: 0 },
  { x: 50, y: 100 },
  { x: 100, y: 50 },
  { x: 150, y: 100 }
];

const smoothPath = createSmoothSvgPath(points);
```

### parsePath()
Parse string SVG em array de instruções.

```tsx
import { parsePath } from '@remotion/paths';

const path = "M 0 0 L 100 100";
const instructions = parsePath(path);
console.log(instructions);
// [{ type: 'M', x: 0, y: 0 }, { type: 'L', x: 100, y: 100 }]
```

### serializeInstructions()
Converter instruções de volta para string.

```tsx
import { serializeInstructions } from '@remotion/paths';

const instructions = [
  { type: 'M', x: 0, y: 0 },
  { type: 'L', x: 100, y: 100 }
];

const path = serializeInstructions(instructions);
// "M 0 0 L 100 100"
```

## 💡 Tips & Best Practices

1. ✅ **Use @remotion/paths** para animações de SVG
2. ✅ **evolvePath** é perfeito para draw animations
3. ✅ **interpolatePath** para morphing suave
4. ✅ **Combine shapes para criar gráficos complexos**
5. ✅ **Use getPointAtLength** para path following
6. ✅ **Otimize SVG paths** antes de importar
7. ⚠️ **Paths complexos são mais pesados de renderizar**
8. ⚠️ **Use viewBox corretamente** para escala responsiva

## 🔗 Recursos

- [@remotion/paths Docs](https://www.remotion.dev/docs/paths/)
- [@remotion/shapes Docs](https://www.remotion.dev/docs/shapes/)
- [Figma Import Guide](https://www.remotion.dev/docs/figma)
- [SVG Path Spec](https://www.w3.org/TR/SVG/paths.html)

---

**Nota:** SVG é extremamente poderoso para visualizações de dados, infográficos e motion graphics profissionais!
