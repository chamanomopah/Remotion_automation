# Remotion - Animation Patterns Guide

## 📋 Visão Geral

Este guia cobre padrões de animação no Remotion, desde básico até técnicas avançadas usadas em vídeos profissionais estilo Alt Shift X e outros creators.

## 🎬 Fundamentos de Animação

### Como Animação Funciona no Remotion

Animação funciona alterando propriedades ao longo do tempo baseado no **frame atual**.

```tsx
import { useCurrentFrame } from 'remotion';

export const BasicAnimation = () => {
  const frame = useCurrentFrame();
  
  // Alterar opacidade de 0 a 1 em 60 frames
  const opacity = Math.min(1, frame / 60);
  
  return (
    <div style={{ opacity }}>
      Hello World!
    </div>
  );
};
```

### ⚠️ Regra Crucial

**SEMPRE use `useCurrentFrame()` para animações!**

❌ **NÃO USE:**
- CSS transitions
- CSS animations
- setTimeout/setInterval
- requestAnimationFrame

✅ **USE:**
- `useCurrentFrame()`
- `interpolate()`
- `spring()`

**Por quê?** Remotion renderiza frame por frame. CSS transitions causam flickering.

## 🎨 Interpolate - O Coração das Animações

### Sintaxe Básica

```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

const opacity = interpolate(
  frame,        // Valor a interpolar
  [0, 60],      // Input range (frames)
  [0, 1],       // Output range (valores)
  {
    extrapolateRight: 'clamp'  // Não passar de 1
  }
);
```

### Extrapolation Options

```tsx
// Clamp - Para no limite
extrapolateRight: 'clamp'
// Output: frame 70 = 1 (não passa de 1)

// Extend - Continua crescendo
extrapolateRight: 'extend'
// Output: frame 70 = 1.16

// Identity - Retorna o input original
extrapolateRight: 'identity'
// Output: frame 70 = 70
```

### Easing Functions

```tsx
import { Easing } from 'remotion';

// Ease In (começa devagar)
const opacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.in(Easing.ease)
});

// Ease Out (termina devagar)
const opacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.out(Easing.ease)
});

// Ease In Out (suave nos dois lados)
const opacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.inOut(Easing.ease)
});

// Bezier customizado
const opacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.bezier(0.42, 0, 0.58, 1)
});
```

### Easing Types Disponíveis

```tsx
Easing.linear
Easing.ease
Easing.quad      // Suave
Easing.cubic     // Mais suave
Easing.poly(n)   // Customizável
Easing.sin       // Sinusoidal
Easing.circle
Easing.exp       // Exponencial
Easing.elastic(bounciness)  // Elástico
Easing.back(overshoot)      // Overshoot
Easing.bounce    // Pula
```

## 🌸 Spring Animations

### Spring Básico

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SpringExample = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    fps,
    frame,
    config: {
      damping: 10,    // Amortecimento (padrão: 10)
      stiffness: 100, // Rigidez (padrão: 100)
      mass: 1         // Massa (padrão: 1)
    }
  });
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      Bounce!
    </div>
  );
};
```

### Spring Presets

```tsx
import { springTiming } from 'remotion';

// Gentle (suave)
const gentle = spring({
  fps,
  frame,
  config: { damping: 200, stiffness: 90, mass: 10 }
});

// Wobbly (bamboleante)
const wobbly = spring({
  fps,
  frame,
  config: { damping: 10, stiffness: 100, mass: 1 }
});

// Stiff (rígido)
const stiff = spring({
  fps,
  frame,
  config: { damping: 26, stiffness: 170, mass: 1 }
});

// Slow (lento)
const slow = spring({
  fps,
  frame,
  config: { damping: 26, stiffness: 170, mass: 3 }
});
```

### Spring com Delay

```tsx
const delayedSpring = spring({
  fps,
  frame: frame - 30,  // Começa após 30 frames
  config: { damping: 10, stiffness: 100 }
});
```

### Spring Reverso

```tsx
const reverse = spring({
  fps,
  frame,
  reverse: true,  // Anima de 1 para 0
  config: { damping: 10, stiffness: 100 }
});
```

## 🎭 Padrões de Animação Comuns

### 1. Fade In/Out

```tsx
// Fade In
const fadeIn = interpolate(
  frame,
  [0, 30],
  [0, 1],
  { extrapolateRight: 'clamp' }
);

// Fade Out
const fadeOut = interpolate(
  frame,
  [90, 120],
  [1, 0],
  { extrapolateLeft: 'clamp' }
);

// Fade In e Out
const fadeInOut = interpolate(
  frame,
  [0, 30, 90, 120],
  [0, 1, 1, 0]
);
```

### 2. Slide In

```tsx
// Slide from right
const slideX = interpolate(
  frame,
  [0, 60],
  [100, 0],
  { easing: Easing.out(Easing.cubic) }
);

<div style={{ transform: `translateX(${slideX}%)` }}>
  Slide!
</div>
```

### 3. Scale & Rotate

```tsx
const scale = spring({ fps, frame });
const rotate = interpolate(frame, [0, 60], [0, 360]);

<div style={{
  transform: `scale(${scale}) rotate(${rotate}deg)`
}}>
  Scale & Rotate
</div>
```

### 4. Sequenced Animations

```tsx
// Animar múltiplos elementos em sequência
const elements = ['A', 'B', 'C', 'D'];

return elements.map((el, index) => {
  const delay = index * 10;  // 10 frames de delay cada
  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <div key={el} style={{ opacity }}>
      {el}
    </div>
  );
});
```

### 5. Staggered Grid Animation

```tsx
const StaggeredGrid = () => {
  const frame = useCurrentFrame();
  const gridSize = 5;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {Array.from({ length: gridSize * gridSize }, (_, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const delay = (row + col) * 3;
        
        const scale = interpolate(
          frame,
          [delay, delay + 20],
          [0, 1],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
        );
        
        return (
          <div key={i} style={{ transform: `scale(${scale})` }}>
            {i}
          </div>
        );
      })}
    </div>
  );
};
```

## 🎬 Padrões Avançados

### 1. Typewriter Effect

```tsx
const TypeWriter = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(interpolate(frame, [0, 60], [0, text.length]));
  
  return <div>{text.slice(0, charsToShow)}</div>;
};
```

### 2. Count Up Animation

```tsx
const CountUp = ({ target }: { target: number }) => {
  const frame = useCurrentFrame();
  const value = Math.floor(
    interpolate(frame, [0, 60], [0, target], {
      easing: Easing.out(Easing.quad)
    })
  );
  
  return <div>{value.toLocaleString()}</div>;
};
```

### 3. Wave Effect

```tsx
const WaveText = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  
  return (
    <div style={{ display: 'flex' }}>
      {text.split('').map((char, i) => {
        const y = Math.sin((frame + i * 5) * 0.1) * 20;
        
        return (
          <span key={i} style={{ transform: `translateY(${y}px)` }}>
            {char}
          </span>
        );
      })}
    </div>
  );
};
```

### 4. Progress Bar

```tsx
const ProgressBar = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  
  const progress = interpolate(
    frame,
    [0, duration],
    [0, 100],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <div style={{ width: '100%', height: 20, background: '#ddd' }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: '#4CAF50',
        transition: 'none'  // Importante!
      }} />
    </div>
  );
};
```

### 5. Parallax Scrolling

```tsx
const Parallax = () => {
  const frame = useCurrentFrame();
  
  const backgroundY = interpolate(frame, [0, 300], [0, -100]);
  const foregroundY = interpolate(frame, [0, 300], [0, -300]);
  
  return (
    <>
      <div style={{ transform: `translateY(${backgroundY}px)` }}>
        Background (slow)
      </div>
      <div style={{ transform: `translateY(${foregroundY}px)` }}>
        Foreground (fast)
      </div>
    </>
  );
};
```

### 6. Path Drawing (SVG)

```tsx
import { evolvePath } from '@remotion/paths';

const PathDraw = () => {
  const frame = useCurrentFrame();
  const path = "M 0 0 L 100 100";
  
  const progress = interpolate(frame, [0, 60], [0, 1]);
  const evolution = evolvePath(progress, path);
  
  return (
    <svg viewBox="0 0 100 100">
      <path
        d={evolution}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};
```

## 🎯 Timing & Sequencing

### 1. Usando useCurrentFrame com Offset

```tsx
const Scene1 = () => {
  const frame = useCurrentFrame();
  const sceneStart = 0;
  const sceneDuration = 120;
  
  const localFrame = frame - sceneStart;
  
  if (localFrame < 0 || localFrame > sceneDuration) {
    return null;
  }
  
  const opacity = interpolate(localFrame, [0, 20], [0, 1]);
  
  return <div style={{ opacity }}>Scene 1</div>;
};
```

### 2. Multiple Sequences

```tsx
const MultiScene = () => {
  const frame = useCurrentFrame();
  
  // Scene 1: 0-120
  const scene1Opacity = interpolate(
    frame,
    [0, 20, 100, 120],
    [0, 1, 1, 0]
  );
  
  // Scene 2: 120-240
  const scene2Opacity = interpolate(
    frame,
    [120, 140, 220, 240],
    [0, 1, 1, 0]
  );
  
  return (
    <>
      <div style={{ opacity: scene1Opacity }}>Scene 1</div>
      <div style={{ opacity: scene2Opacity }}>Scene 2</div>
    </>
  );
};
```

## 📐 Math Helpers para Animação

```tsx
// Ease In Quad (custom)
const easeInQuad = (t: number) => t * t;

// Ease Out Quad (custom)
const easeOutQuad = (t: number) => t * (2 - t);

// Bounce (custom)
const bounce = (t: number) => {
  if (t < 0.5) {
    return 8 * t * t * t * t;
  } else {
    return 1 - 8 * (--t) * t * t * t;
  }
};

// Usar
const progress = frame / 60;
const value = easeInQuad(progress);
```

## 💡 Tips & Best Practices

1. **Use clamp para evitar valores fora do range**
2. **Spring para animações naturais**
3. **Interpolate para controle preciso**
4. **Combine múltiplas animações**
5. **Use easing para polish profissional**
6. **Teste diferentes configs de spring**
7. **Sempre use useCurrentFrame()**
8. **Evite CSS transitions/animations**

## 📚 Recursos

- [Remotion Animation Docs](https://www.remotion.dev/docs/animating-properties)
- [Interpolate API](https://www.remotion.dev/docs/interpolate)
- [Spring API](https://www.remotion.dev/docs/spring)
- [Easing](https://www.remotion.dev/docs/easing)

---

**Next:** Explore motion blur e SVG animations para nível profissional!
