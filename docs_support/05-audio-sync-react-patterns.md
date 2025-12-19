# Audio Sync Patterns para React - Sincronização Palavra-a-Palavra

## 📌 Visão Geral

Este documento explora padrões e técnicas para sincronizar transcrições de áudio com reprodução em tempo real usando React, focando em performance, precisão e experiência do usuário.

## 🎯 Desafios Principais

### 1. Performance em Dispositivos Variados
- Manter 60 FPS em dispositivos de baixa potência
- Evitar re-renders desnecessários
- Lidar com evento `timeupdate` de alta frequência (4-66Hz)

### 2. Precisão de Sincronização
- Highlight palavra exata no momento certo
- Smooth transitions entre palavras
- Handling de timestamps em diferentes formatos

### 3. Experiência do Usuário
- Visual feedback instantâneo
- Scroll automático para palavra ativa
- Navegação clicável (seek to timestamp)

## 🏗️ Arquitetura Recomendada

### Estrutura de Dados

```typescript
// Tipos TypeScript para type safety
type Seconds = number & { __brand: 'Seconds' };
type Milliseconds = number & { __brand: 'Milliseconds' };

interface Word {
  text: string;
  startTime: Seconds;
  endTime: Seconds;
  speaker?: number;
  confidence?: number;
}

interface Utterance {
  id: string;
  startTime: Seconds;
  endTime: Seconds;
  text: string;
  words: Word[];
  speaker: number;
}

interface Transcript {
  utterances: Utterance[];
  speakers: number[];
  duration: Seconds;
}
```

### Componente Base

```typescript
import React, { useRef, useEffect, useState } from 'react';

interface TranscriptPlayerProps {
  audioSrc: string;
  transcript: Transcript;
}

const TranscriptPlayer: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<Seconds>(0 as Seconds);
  
  // Setup do player e sync
  useEffect(() => {
    // Implementação detalhada abaixo
  }, [transcript]);

  return (
    <div className="transcript-player">
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        controls 
      />
      <div 
        ref={wordsContainerRef} 
        className="transcript-text"
      >
        {/* Renderizar palavras */}
      </div>
    </div>
  );
};
```

## ⚡ Padrão 1: Modificação Direta do DOM (Máxima Performance)

### Conceito
Modificar estilos DOM diretamente, pulando o ciclo de render do React para máxima performance.

### Implementação

```typescript
const TranscriptWithDirectDOM: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wordsRef = useRef<HTMLSpanElement>(null);
  const activeWordRef = useRef<number>(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime as Seconds;
      
      // Encontrar palavra ativa usando binary search (O(log n))
      const activeIndex = findActiveWordIndex(
        transcript.utterances.flatMap(u => u.words),
        currentTime
      );
      
      // Apenas atualizar se mudou
      if (activeIndex !== activeWordRef.current) {
        updateActiveWord(wordsRef.current, activeIndex, activeWordRef.current);
        activeWordRef.current = activeIndex;
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <span ref={wordsRef}>
        {transcript.utterances.flatMap(utt => 
          utt.words.map((word, i) => (
            <span 
              key={`${utt.id}-${i}`}
              className="word"
              data-start={word.startTime}
              data-end={word.endTime}
            >
              {word.text}{' '}
            </span>
          ))
        )}
      </span>
    </div>
  );
};

// Função helper para encontrar palavra ativa (Binary Search)
function findActiveWordIndex(words: Word[], currentTime: Seconds): number {
  let left = 0;
  let right = words.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const word = words[mid];
    
    if (currentTime >= word.startTime && currentTime < word.endTime) {
      return mid;
    } else if (currentTime < word.startTime) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  
  return -1;
}

// Função helper para atualizar palavra ativa
function updateActiveWord(
  container: HTMLElement | null,
  newIndex: number,
  oldIndex: number
) {
  if (!container) return;
  
  const words = container.childNodes;
  
  // Remover highlight anterior
  if (oldIndex >= 0 && oldIndex < words.length) {
    (words[oldIndex] as HTMLElement).classList.remove('active-word');
  }
  
  // Adicionar novo highlight
  if (newIndex >= 0 && newIndex < words.length) {
    const activeElement = words[newIndex] as HTMLElement;
    activeElement.classList.add('active-word');
    
    // Scroll into view se necessário
    activeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}
```

### CSS para Highlight

```css
.word {
  display: inline;
  padding: 2px 4px;
  margin: 0 2px;
  border-radius: 3px;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
}

.word:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.active-word {
  background-color: rgba(59, 130, 246, 0.2);
  font-weight: 600;
}

/* Smooth scroll behavior */
.transcript-text {
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
```

## 🎨 Padrão 2: Highlight Movível (Moving Highlight)

### Conceito
Um elemento de highlight que se move suavemente de palavra para palavra, animando posição e tamanho.

### Implementação

```typescript
const MovingHighlight: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime as Seconds;
      const words = transcript.utterances.flatMap(u => u.words);
      const activeIndex = findActiveWordIndex(words, currentTime);
      
      if (activeIndex >= 0 && wordsRef.current && highlightRef.current) {
        const wordElement = wordsRef.current.children[activeIndex] as HTMLElement;
        updateHighlightPosition(highlightRef.current, wordElement);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript]);

  return (
    <div className="transcript-player">
      <audio ref={audioRef} src={audioSrc} controls />
      <div className="transcript-container">
        <div ref={highlightRef} className="moving-highlight" />
        <div ref={wordsRef} className="words-layer">
          {transcript.utterances.flatMap(utt => 
            utt.words.map((word, i) => (
              <span 
                key={`${utt.id}-${i}`}
                className="word"
              >
                {word.text}{' '}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function updateHighlightPosition(
  highlight: HTMLElement, 
  wordElement: HTMLElement
) {
  const rect = wordElement.getBoundingClientRect();
  const container = wordElement.parentElement?.getBoundingClientRect();
  
  if (!container) return;
  
  highlight.style.transform = `translate(${rect.left - container.left}px, ${rect.top - container.top}px)`;
  highlight.style.width = `${rect.width}px`;
  highlight.style.height = `${rect.height}px`;
}
```

### CSS para Moving Highlight

```css
.transcript-container {
  position: relative;
  padding: 20px;
}

.moving-highlight {
  position: absolute;
  background-color: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  pointer-events: none;
  transition: transform 0.2s ease-out, 
              width 0.2s ease-out, 
              height 0.2s ease-out;
  z-index: 1;
}

.words-layer {
  position: relative;
  z-index: 2;
}

.word {
  display: inline;
  padding: 4px 2px;
  cursor: pointer;
}
```

## 🎤 Padrão 3: Highlight por Speaker (Com Cores)

### Conceito
Diferentes cores para diferentes falantes, mantendo contexto visual de quem está falando.

### Implementação

```typescript
const SpeakerColoredTranscript: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const [speakerColors] = useState(() => generateSpeakerColors(transcript.speakers));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime as Seconds;
      
      transcript.utterances.forEach((utt, uttIndex) => {
        const isActive = currentTime >= utt.startTime && currentTime < utt.endTime;
        
        utt.words.forEach((word, wordIndex) => {
          const wordActive = currentTime >= word.startTime && currentTime < word.endTime;
          const element = wordsRef.current?.querySelector(
            `[data-utt="${uttIndex}"][data-word="${wordIndex}"]`
          ) as HTMLElement;
          
          if (element) {
            element.classList.toggle('active', wordActive);
            element.classList.toggle('utterance-active', isActive);
          }
        });
      });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <div ref={wordsRef} className="transcript-by-speaker">
        {transcript.utterances.map((utt, uttIndex) => (
          <div 
            key={utt.id}
            className="utterance"
            style={{ 
              borderLeft: `4px solid ${speakerColors[utt.speaker]}` 
            }}
          >
            <span className="speaker-label" style={{ color: speakerColors[utt.speaker] }}>
              Speaker {utt.speaker}
            </span>
            {utt.words.map((word, wordIndex) => (
              <span
                key={`${utt.id}-${wordIndex}`}
                className="word"
                data-utt={uttIndex}
                data-word={wordIndex}
                style={{ 
                  '--speaker-color': speakerColors[utt.speaker] 
                } as React.CSSProperties}
              >
                {word.text}{' '}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Gerar cores únicas por speaker
function generateSpeakerColors(speakers: number[]): Record<number, string> {
  const colors: Record<number, string> = {};
  
  speakers.forEach((speaker, index) => {
    // Golden angle for color distribution
    const hue = (index * 137.5) % 360;
    colors[speaker] = `hsl(${hue}, 70%, 60%)`;
  });
  
  return colors;
}
```

### CSS para Speaker Colors

```css
.transcript-by-speaker {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.utterance {
  padding: 12px;
  padding-left: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.speaker-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.word {
  transition: background-color 0.15s ease;
}

.word.utterance-active {
  opacity: 1;
}

.word:not(.utterance-active) {
  opacity: 0.6;
}

.word.active {
  background-color: var(--speaker-color);
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 3px;
}
```

## 🖱️ Padrão 4: Navegação Clicável (Seek on Click)

### Conceito
Permitir que usuário clique em qualquer palavra para pular para aquele ponto no áudio.

### Implementação

```typescript
const ClickableTranscript: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  const handleWordClick = useCallback((startTime: Seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const words = transcript.utterances.flatMap(u => u.words);
      const index = findActiveWordIndex(words, audio.currentTime as Seconds);
      setActiveWordIndex(index);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <div className="clickable-transcript">
        {transcript.utterances.flatMap((utt, uttIndex) => 
          utt.words.map((word, wordIndex) => {
            const globalIndex = transcript.utterances
              .slice(0, uttIndex)
              .reduce((acc, u) => acc + u.words.length, 0) + wordIndex;
            
            return (
              <span
                key={`${utt.id}-${wordIndex}`}
                className={`word ${globalIndex === activeWordIndex ? 'active' : ''}`}
                onClick={() => handleWordClick(word.startTime)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleWordClick(word.startTime);
                  }
                }}
              >
                {word.text}{' '}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};
```

### CSS para Clickable Words

```css
.clickable-transcript .word {
  cursor: pointer;
  padding: 3px 4px;
  border-radius: 3px;
  transition: all 0.15s ease;
  user-select: none;
}

.clickable-transcript .word:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.clickable-transcript .word:active {
  transform: translateY(0);
}

.clickable-transcript .word.active {
  background-color: rgba(59, 130, 246, 0.3);
  font-weight: 600;
}

.clickable-transcript .word:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
```

## ⌨️ Padrão 5: Keyboard Shortcuts

### Conceito
Atalhos de teclado para controle de reprodução e navegação.

### Implementação

```typescript
import Mousetrap from 'mousetrap';

const TranscriptWithShortcuts: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTimeRef = useRef<Seconds>(0 as Seconds);

  // Atualizar currentTimeRef sem trigger render
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      currentTimeRef.current = audio.currentTime as Seconds;
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Espaço: Play/Pause
    Mousetrap.bind('space', (e) => {
      e.preventDefault();
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    // J: Skip back 10 seconds
    Mousetrap.bind('j', () => {
      audio.currentTime = Math.max(0, currentTimeRef.current - 10);
    });

    // L: Skip forward 10 seconds
    Mousetrap.bind('l', () => {
      audio.currentTime = Math.min(audio.duration, currentTimeRef.current + 10);
    });

    // K: Toggle play/pause
    Mousetrap.bind('k', () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    // Left arrow: Skip back 5 seconds
    Mousetrap.bind('left', () => {
      audio.currentTime = Math.max(0, currentTimeRef.current - 5);
    });

    // Right arrow: Skip forward 5 seconds
    Mousetrap.bind('right', () => {
      audio.currentTime = Math.min(audio.duration, currentTimeRef.current + 5);
    });

    // 0-9: Jump to percentage
    for (let i = 0; i <= 9; i++) {
      Mousetrap.bind(i.toString(), () => {
        audio.currentTime = (audio.duration * i) / 10;
      });
    }

    return () => {
      Mousetrap.unbind(['space', 'j', 'l', 'k', 'left', 'right']);
      for (let i = 0; i <= 9; i++) {
        Mousetrap.unbind(i.toString());
      }
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <div className="shortcuts-help">
        <h4>Keyboard Shortcuts:</h4>
        <ul>
          <li><kbd>Space</kbd> / <kbd>K</kbd>: Play/Pause</li>
          <li><kbd>J</kbd>: -10 seconds</li>
          <li><kbd>L</kbd>: +10 seconds</li>
          <li><kbd>←</kbd>: -5 seconds</li>
          <li><kbd>→</kbd>: +5 seconds</li>
          <li><kbd>0-9</kbd>: Jump to 0%-90%</li>
        </ul>
      </div>
      {/* Transcript rendering */}
    </div>
  );
};
```

## 📊 Performance Benchmarks

### Comparação de Padrões

| Padrão | FPS (Low-end) | FPS (High-end) | CPU Usage | Complexity |
|--------|---------------|----------------|-----------|------------|
| **Direct DOM** | 60 | 60 | Baixo | Média |
| **Moving Highlight** | 55-60 | 60 | Médio | Alta |
| **Speaker Colors** | 50-55 | 60 | Médio | Alta |
| **State-based** | 15-20 | 45-50 | Alto | Baixa |

### Otimizações Recomendadas

**1. Throttle/Debounce Updates**
```typescript
import { throttle } from 'lodash';

const onTimeUpdate = throttle(() => {
  // Update logic
}, 100); // Update at most every 100ms
```

**2. Virtual Scrolling para Transcritos Longos**
```typescript
import { FixedSizeList } from 'react-window';

const VirtualizedTranscript = ({ words, currentTime }) => (
  <FixedSizeList
    height={400}
    itemCount={words.length}
    itemSize={30}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <Word 
          word={words[index]} 
          isActive={/* check if active */}
        />
      </div>
    )}
  </FixedSizeList>
);
```

**3. Memoization**
```typescript
const MemoizedWord = React.memo<WordProps>(({ word, isActive }) => (
  <span className={isActive ? 'active' : ''}>
    {word.text}{' '}
  </span>
), (prev, next) => {
  // Only re-render if active status changed
  return prev.isActive === next.isActive;
});
```

## 🔧 Utilidades e Helpers

### Conversão de Unidades de Tempo

```typescript
// Type branding for type safety
type Seconds = number & { __brand: 'Seconds' };
type Milliseconds = number & { __brand: 'Milliseconds' };

const secondsToMilliseconds = (s: Seconds): Milliseconds => 
  (s * 1000) as Milliseconds;

const millisecondsToSeconds = (ms: Milliseconds): Seconds => 
  (ms / 1000) as Seconds;

const formatTimestamp = (seconds: Seconds): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

### Busca Binária Otimizada

```typescript
function binarySearchWord(
  words: Word[], 
  currentTime: Seconds,
  lastIndex: number = -1
): number {
  // Optimization: Check if still in same word
  if (lastIndex >= 0 && lastIndex < words.length) {
    const word = words[lastIndex];
    if (currentTime >= word.startTime && currentTime < word.endTime) {
      return lastIndex;
    }
  }
  
  // Binary search
  let left = 0;
  let right = words.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const word = words[mid];
    
    if (currentTime >= word.startTime && currentTime < word.endTime) {
      return mid;
    } else if (currentTime < word.startTime) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  
  return -1;
}
```

## 📱 Responsividade e Mobile

### Considerações Mobile

```typescript
const ResponsiveTranscript: React.FC<TranscriptPlayerProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? (
    <MobileTranscriptView {...props} />
  ) : (
    <DesktopTranscriptView {...props} />
  );
};

// Mobile: Scroll automático mais agressivo
const MobileTranscriptView: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  // Sempre manter palavra ativa no centro da tela
  const scrollToActiveWord = (element: HTMLElement) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  };
  
  // ... rest of implementation
};
```

### Touch Gestures

```typescript
import { useSwipeable } from 'react-swipeable';

const TouchEnabledTranscript: React.FC<TranscriptPlayerProps> = ({ 
  audioSrc, 
  transcript 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Skip forward
      if (audioRef.current) {
        audioRef.current.currentTime += 5;
      }
    },
    onSwipedRight: () => {
      // Skip backward
      if (audioRef.current) {
        audioRef.current.currentTime -= 5;
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div {...handlers}>
      <audio ref={audioRef} src={audioSrc} controls />
      {/* Transcript */}
    </div>
  );
};
```

## 🎨 Temas e Customização

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .word {
    color: #e5e7eb;
  }
  
  .word.active {
    background-color: rgba(59, 130, 246, 0.4);
  }
  
  .utterance {
    background: rgba(255, 255, 255, 0.05);
  }
}
```

### Customização via CSS Variables

```css
.transcript-player {
  --primary-color: #3b82f6;
  --highlight-opacity: 0.3;
  --transition-speed: 0.15s;
  --word-spacing: 2px;
}

.word.active {
  background-color: color-mix(
    in srgb, 
    var(--primary-color) var(--highlight-opacity), 
    transparent
  );
  transition: background-color var(--transition-speed) ease;
}
```

## 📚 Bibliotecas Úteis

### Audio Visualization
- **Wavesurfer.js** - Waveform com regions
- **Peaks.js** - Audio waveform UI
- **Tone.js** - Web Audio framework

### React Helpers
- **react-window** - Virtual scrolling
- **react-use** - Hooks úteis (useAudio, useDebounce)
- **react-hotkeys-hook** - Keyboard shortcuts

### Performance
- **react-virtualized** - Virtualized lists
- **web-vitals** - Performance monitoring

## 🔗 Recursos Adicionais

### Artigos
- [Syncing a Transcript with Audio in React - Metaview](https://www.metaview.ai/resources/blog/syncing-a-transcript-with-audio-in-react)
- [CSS Text Animations - Prismic](https://prismic.io/blog/css-text-animations)
- [Building a Voice Reactive Orb in React - Medium](https://medium.com/@therealmilesjackson/building-a-voice-reactive-orb-in-react-audio-visualization-for-voice-assistants-2bee12797b93)

### Repositórios
- [Metaview Transcript Player Example](https://github.com/metaview-ai/transcript-player)
- [Awesome Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization)

---

**Conclusão**: Sincronizar áudio com transcrição em React requer balancear performance, precisão e UX. O padrão de modificação direta do DOM oferece a melhor performance, enquanto padrões mais visuais como moving highlight criam experiências mais ricas. Escolha baseado nas necessidades específicas do seu projeto.

**Recomendação**: Comece com Direct DOM pattern, adicione features incrementalmente, e sempre teste em dispositivos de baixa potência.
