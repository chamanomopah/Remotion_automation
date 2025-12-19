# Deepgram API - Documentação Completa para Transcrição com Timestamps

## 📌 Visão Geral

Deepgram é uma API de Speech-to-Text (STT) avançada que oferece transcrição precisa com timestamps detalhados, identificação de falantes (speaker diarization) e segmentação de utterances. Ideal para criar aplicações de voz, legendas em tempo real e análise de conversas.

## 🎯 Casos de Uso Principais

### 1. Streaming Audio (Áudio em Tempo Real)
**Para que serve:**
- Agentes de voz com conversação em tempo real
- Transcrição turn-based (baseada em turnos)

**Benefícios:**
- Detecção de fim de turno integrada ao modelo
- Dinâmica de alternância configurável

**Exemplos:**
- Contact center agents
- Bots de suporte ao cliente
- Assistentes em tempo real

**Início rápido:** [Flux API Quickstart](https://developers.deepgram.com/docs/flux/quickstart)

**Nota:** Atualmente disponível para inglês. Para outras línguas, use [Streaming API geral](https://developers.deepgram.com/docs/live-streaming-audio).

### 2. Real-time Meeting Transcription
**Para que serve:**
- Transcrições em tempo real para reuniões e eventos

**Benefícios:**
- Transcritos em tempo real
- Disponibilidade de múltiplos idiomas
- Transcritos com diarization (identificação de falantes)

**Exemplos:**
- Legendas ao vivo
- Transcrição de eventos
- Monitoramento de feeds de áudio

### 3. Pre-recorded Audio (Áudio Pré-gravado)
**Para que serve:**
- Transcrição de arquivos previamente gravados

**Benefícios:**
- Implementação simples
- Ampla disponibilidade de idiomas
- Custo-efetivo

**Exemplos:**
- Transcrição de entrevistas
- Podcasts
- Reuniões gravadas
- Chamadas de suporte

## 🔧 Configuração Básica

### Chamada API Simples (cURL)

```bash
curl -X POST \
  -H "Authorization: Token YOUR_DEEPGRAM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav"}' \
  "https://api.deepgram.com/v1/listen?model=nova-3&language=en&utterances=true&diarize=true&smart_format=true"
```

### Python SDK

```python
from deepgram import DeepgramClient, PrerecordedOptions

# Inicializar cliente
dg = DeepgramClient("YOUR_SECRET")

# URL do áudio
AUDIO_URL = {
    "url": "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav"
}

# Configurar opções
opts = PrerecordedOptions(
    model="nova-3",
    language="en",
    smart_format=True,
    utterances=True,
    diarize=True,
)

# Fazer transcrição
res = dg.listen.prerecorded.v("1").transcribe_url(AUDIO_URL, opts)

# Imprimir resultado
print(res.to_json(indent=2))
```

## 🎛️ Parâmetros Principais

### Flags Essenciais

| Flag | Propósito | Quando Usar |
|------|-----------|-------------|
| `utterances=true` | Retorna `results.utterances[]` com start, end, speaker, transcript, words[] | Sempre que precisar de segmentação contextual |
| `diarize=true` | Adiciona IDs de falante para cada utterance e palavra (áudio single-channel) | Para conversas com múltiplos falantes |
| `smart_format=true` | Auto-capitalização, pontuação, normalização numérica | Para transcritos mais legíveis |
| `utt_split` | Ajusta sensibilidade de divisão de utterances (ex: `utt_split=1.0`) | Para controlar granularidade de segmentação |

### Modelos Disponíveis

**Nova-2 e Nova-3:**
- Modelos mais recentes
- Suporte completo para utterances e diarization
- Melhor precisão

**Escolha do Modelo:**
```python
model="nova-3"  # Recomendado para melhor precisão
model="nova-2"  # Alternativa estável
```

## 📊 Estrutura da Resposta

### Exemplo de Utterance

```json
{
  "start": 10.0713,
  "end": 11.6713,
  "confidence": 0.9994,
  "channel": 0,
  "transcript": "Life moves pretty fast.",
  "words": [
    {
      "word": "Life",
      "start": 10.0713,
      "end": 10.3113,
      "confidence": 0.9990,
      "speaker": 0
    },
    {
      "word": "moves",
      "start": 10.3113,
      "end": 10.6313,
      "confidence": 0.9997,
      "speaker": 0
    }
  ],
  "speaker": 0,
  "id": "35404fd9-12ed-4b58-a9a9-9eaf93475ef6"
}
```

### Campos Importantes

**Nível de Utterance:**
- `start`: Timestamp de início (segundos)
- `end`: Timestamp de fim (segundos)
- `confidence`: Confiança da transcrição (0-1)
- `channel`: Canal de áudio
- `transcript`: Texto completo da utterance
- `speaker`: ID do falante
- `id`: Identificador único

**Nível de Palavra:**
- `word`: Texto da palavra
- `start`: Início da palavra (segundos)
- `end`: Fim da palavra (segundos)
- `confidence`: Confiança da palavra
- `speaker`: Falante da palavra

## ⏱️ Trabalhando com Timestamps

### Tipos de Timestamps

**1. Word-level Timestamps (Nível de Palavra)**
- Precisão máxima
- Útil para sincronização exata
- Permite highlight palavra por palavra

**2. Utterance-level Timestamps (Nível de Segmento)**
- Segmentos semânticos completos
- Mais fácil de trabalhar
- Bom para navegação de conteúdo

### Casos de Uso por Tipo

| Uso | Timestamp Recomendado | Razão |
|-----|---------------------|--------|
| Legendas | Utterance + Word | Utterance para blocos, word para cueing preciso |
| Busca | Utterance | Índice por segmento semântico |
| Analytics | Utterance | Métricas por turno de fala |
| Karaoke-style | Word | Destaque palavra por palavra |

### Exemplo: Calcular Talk Time

```python
from deepgram import DeepgramClient, PrerecordedOptions

def compute_speaking_time(transcript_data):
    """Calcula tempo de fala por speaker"""
    speaker_times = {}
    
    for utterance in transcript_data['results']['utterances']:
        speaker = utterance['speaker']
        duration = utterance['end'] - utterance['start']
        
        if speaker not in speaker_times:
            speaker_times[speaker] = 0
        
        speaker_times[speaker] += duration
    
    return speaker_times

# Uso
dg = DeepgramClient("YOUR_KEY")
response = dg.listen.prerecorded.v("1").transcribe_url(
    {"url": "audio.wav"},
    PrerecordedOptions(
        model="nova-3",
        diarize=True,
        utterances=True
    )
)

times = compute_speaking_time(response.to_dict())
print(f"Speaker times: {times}")
```

## 🎤 Speaker Diarization (Identificação de Falantes)

### O Que É
Processo de identificar "quem falou quando" em uma gravação de áudio com múltiplos falantes.

### Quando Usar

**Single-channel Audio (Áudio de Canal Único):**
```python
PrerecordedOptions(
    diarize=True,  # Ativa diarization
    model="nova-3"
)
```

**Multi-channel Audio (Áudio Multi-canal):**
```python
PrerecordedOptions(
    channels=2,  # Especifica número de canais
    # NÃO usar diarize=True
)
```

> **Dica:** Gravações de call center geralmente têm 2 canais separados (agente e cliente). Nesse caso, use multichannel ao invés de diarization.

### Precisão e Limitações

**Casos com Alta Precisão:**
- Falantes distintos
- Pouca sobreposição
- Áudio limpo
- Turnos claros

**Casos Desafiadores:**
- Back-channels curtos ("uh-huh", "mm-hmm")
- Fala sobreposta
- Ruído de fundo
- Vozes similares

**Solução para Back-channels:**
```python
# Mesclar utterances muito curtas
def merge_short_utterances(utterances, min_duration=0.5):
    merged = []
    current = None
    
    for utt in utterances:
        duration = utt['end'] - utt['start']
        
        if duration < min_duration and current:
            # Mesclar com anterior
            current['end'] = utt['end']
            current['transcript'] += ' ' + utt['transcript']
        else:
            if current:
                merged.append(current)
            current = utt
    
    if current:
        merged.append(current)
    
    return merged
```

## 📝 Gerando Legendas (WebVTT e SRT)

### Usando Helper Library

```python
from deepgram import DeepgramClient, PrerecordedOptions
from deepgram_captions import DeepgramConverter, webvtt, srt

# Transcrever
dg = DeepgramClient()
with open("audio.mp4", "rb") as f:
    payload = f.read()

opts = PrerecordedOptions(
    model="nova-3",
    language="en",
    smart_format=True,
    utterances=True,
    diarize=True,
)

res = dg.listen.rest.v("1").transcribe_file(payload, opts)
dg_tx = DeepgramConverter(res.to_dict())

# Gerar WebVTT
with open("output.vtt", "w", encoding="utf-8") as out:
    out.write(webvtt(dg_tx))

# Gerar SRT
with open("output.srt", "w", encoding="utf-8") as out:
    out.write(srt(dg_tx))
```

### Formato WebVTT vs SRT

| Característica | WebVTT | SRT |
|----------------|--------|-----|
| **Sintaxe de Tempo** | `HH:MM:SS.mmm` | `HH:MM:SS,mmm` |
| **Tags de Speaker** | `<v Speaker N>` nativo | Embutido no texto |
| **Melhor Para** | HTML5 `<track>` + CSS styling | Editores offline, players legados |
| **Suporte Web** | Excelente | Bom |
| **Styling** | Via `::cue` CSS | Limitado |

### Exemplo WebVTT Manual

```python
from datetime import timedelta

def format_timestamp(seconds: float, format_type="vtt") -> str:
    """Converte float seconds para timestamp"""
    td = timedelta(seconds=seconds)
    hours, remainder = divmod(td.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int(td.microseconds / 1000)

    if format_type == "srt":
        return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"
    else:  # WebVTT
        return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

def write_webvtt_file(utterances, output_file="output.vtt"):
    """Gera arquivo WebVTT"""
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for utt in utterances:
            start = format_timestamp(utt['start'], "vtt")
            end = format_timestamp(utt['end'], "vtt")
            speaker = utt.get('speaker', 0)
            transcript = utt['transcript']

            f.write(f"{start} --> {end}\n")
            f.write(f"<v Speaker {speaker}>{transcript}\n\n")
    
    print(f"✓ WebVTT file saved as: {output_file}")
```

## 🎨 Sincronização de Áudio em React

### Problema
Sincronizar transcrição visual com áudio reproduzindo em tempo real, mantendo 60fps em dispositivos de baixa potência.

### Solução: Usar Refs (Não State)

**❌ Approach Ruim (State):**
```javascript
// NÃO FAZER ISSO
const [currentTime, setCurrentTime] = useState(0);

useEffect(() => {
  const onTimeUpdate = () => {
    setCurrentTime(playerRef.current.currentTime); // Trigger render!
  };
  playerRef.current.addEventListener("timeupdate", onTimeUpdate);
}, []);
```

**Problema:** `timeupdate` dispara 4-66Hz, causando renders frequentes e FPS baixo.

**✅ Approach Bom (Refs + DOM Direto):**
```javascript
const Transcript = ({ transcript }) => {
  const playerRef = useRef(null);
  const wordsRef = useRef(null);

  useEffect(() => {
    const onTimeUpdate = () => {
      const currentTime = playerRef.current.currentTime;
      
      // Encontrar palavra ativa
      const activeWordIndex = transcript.words.findIndex(
        word => word.startTime <= currentTime && word.endTime > currentTime
      );
      
      // Modificar DOM diretamente (fora do React render)
      if (activeWordIndex !== -1) {
        const wordElement = wordsRef.current.childNodes[activeWordIndex];
        
        // Remover highlight anterior
        wordsRef.current.querySelectorAll('.active-word')
          .forEach(el => el.classList.remove('active-word'));
        
        // Adicionar novo highlight
        wordElement.classList.add('active-word');
      }
    };
    
    playerRef.current.addEventListener("timeupdate", onTimeUpdate);
    return () => playerRef.current.removeEventListener("timeupdate", onTimeUpdate);
  }, [transcript]);

  return (
    <div>
      <span ref={wordsRef}>
        {transcript.words.map((word, i) => (
          <span key={i}>{word.text} </span>
        ))}
      </span>
      <audio controls src={audioSrc} ref={playerRef} />
    </div>
  );
};
```

### Performance: State vs Refs

| Método | Event Handler Time | FPS | Responsividade |
|--------|-------------------|-----|----------------|
| **State** | >400ms | <15 FPS | Lenta, laggy |
| **Refs + DOM** | <1ms | 60 FPS | Suave, instantânea |

## 🔍 Analytics e Métricas

### Talk Time por Speaker

```python
def calculate_talk_time_analytics(utterances):
    """Calcula métricas detalhadas de fala"""
    analytics = {}
    
    for utt in utterances:
        speaker = utt['speaker']
        duration = utt['end'] - utt['start']
        word_count = len(utt['transcript'].split())
        
        if speaker not in analytics:
            analytics[speaker] = {
                'total_time': 0,
                'utterance_count': 0,
                'word_count': 0,
                'utterances': []
            }
        
        analytics[speaker]['total_time'] += duration
        analytics[speaker]['utterance_count'] += 1
        analytics[speaker]['word_count'] += word_count
        analytics[speaker]['utterances'].append(utt)
    
    # Calcular métricas derivadas
    for speaker, data in analytics.items():
        data['avg_utterance_duration'] = (
            data['total_time'] / data['utterance_count']
        )
        data['words_per_minute'] = (
            data['word_count'] / (data['total_time'] / 60)
        )
    
    return analytics
```

### Detecção de Interrupções

```python
def detect_interruptions(utterances, overlap_threshold=0.2):
    """Detecta quando speakers se interrompem"""
    interruptions = []
    
    for i in range(len(utterances) - 1):
        current = utterances[i]
        next_utt = utterances[i + 1]
        
        # Verifica sobreposição
        if current['end'] > next_utt['start']:
            overlap = current['end'] - next_utt['start']
            
            if overlap > overlap_threshold:
                interruptions.append({
                    'speaker_interrupted': current['speaker'],
                    'speaker_interrupting': next_utt['speaker'],
                    'timestamp': next_utt['start'],
                    'overlap_duration': overlap
                })
    
    return interruptions
```

## 🔐 Best Practices de Produção

### 1. Escolha de Canal vs Diarization

```python
# Para call center com 2 canais separados
opts = PrerecordedOptions(
    channels=2,
    model="nova-3"
)

# Para reunião com múltiplos falantes em 1 canal
opts = PrerecordedOptions(
    diarize=True,
    model="nova-3"
)
```

### 2. Smoothing de Utterances

```python
def smooth_utterances(utterances, min_gap=0.1):
    """Remove gaps muito pequenos entre utterances"""
    smoothed = []
    
    for i, utt in enumerate(utterances):
        if i > 0:
            prev = smoothed[-1]
            gap = utt['start'] - prev['end']
            
            if gap < min_gap and utt['speaker'] == prev['speaker']:
                # Mesclar com anterior
                prev['end'] = utt['end']
                prev['transcript'] += ' ' + utt['transcript']
                continue
        
        smoothed.append(utt.copy())
    
    return smoothed
```

### 3. Schema de Dados Normalizado

```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Word:
    text: str
    start: float
    end: float
    confidence: float
    speaker: int

@dataclass
class Turn:
    id: str
    start: float
    end: float
    speaker: int
    text: str
    words: List[Word]
    channel: int
    confidence: float

def normalize_deepgram_response(response):
    """Converte resposta Deepgram em schema normalizado"""
    turns = []
    
    for utt in response['results']['utterances']:
        words = [
            Word(
                text=w['word'],
                start=w['start'],
                end=w['end'],
                confidence=w['confidence'],
                speaker=w['speaker']
            )
            for w in utt['words']
        ]
        
        turn = Turn(
            id=utt['id'],
            start=utt['start'],
            end=utt['end'],
            speaker=utt['speaker'],
            text=utt['transcript'],
            words=words,
            channel=utt['channel'],
            confidence=utt['confidence']
        )
        
        turns.append(turn)
    
    return turns
```

## 🚀 Recursos Avançados

### Detecção Automática de Idioma

```python
opts = PrerecordedOptions(
    detect_language=True,
    model="nova-3"
)
```

### Redação de PII (Informações Pessoais)

```python
opts = PrerecordedOptions(
    redact=["pii"],  # Remove informações pessoais
    model="nova-3"
)
```

### Filtro de Profanidade

```python
opts = PrerecordedOptions(
    profanity_filter=True,
    model="nova-3"
)
```

## 📊 Monitoramento e Logging

### Estrutura de Log Recomendada

```python
import logging
from datetime import datetime

def log_transcription_job(
    job_id: str,
    audio_duration: float,
    speaker_count: int,
    word_count: int,
    processing_time: float
):
    """Log de job de transcrição"""
    logger = logging.getLogger('deepgram_jobs')
    
    logger.info({
        'job_id': job_id,
        'timestamp': datetime.now().isoformat(),
        'audio_duration_seconds': audio_duration,
        'speaker_count': speaker_count,
        'word_count': word_count,
        'processing_time_seconds': processing_time,
        'words_per_second': word_count / audio_duration if audio_duration > 0 else 0
    })
```

## 🔗 Links Úteis

### Documentação Oficial
- [Deepgram Getting Started](https://developers.deepgram.com/docs/stt/getting-started)
- [Pre-recorded Audio Guide](https://developers.deepgram.com/docs/pre-recorded-audio)
- [Live Streaming Audio](https://developers.deepgram.com/docs/live-streaming-audio)
- [Speaker Diarization](https://developers.deepgram.com/docs/diarization)
- [Utterances Feature](https://developers.deepgram.com/docs/utterances)

### SDKs
- [Python SDK](https://github.com/deepgram/deepgram-python-sdk)
- [JavaScript SDK](https://github.com/deepgram/deepgram-js-sdk)
- [Go SDK](https://github.com/deepgram/deepgram-go-sdk)

### Helpers
- [deepgram-captions (Python)](https://github.com/deepgram/deepgram-python-captions)

### Comunidade
- [Deepgram Community Forum](https://community.deepgram.com/)
- [GitHub Discussions](https://github.com/orgs/deepgram/discussions)

## 💡 Exemplos de Projetos

### 1. Player de Vídeo com Legendas por Speaker
```
Funcionalidades:
- Carrega vídeo + WebVTT
- Cores diferentes por speaker
- Atualização em tempo real
- Busca por palavra-chave
```

### 2. Meeting Assistant
```
Funcionalidades:
- Transcrição de reunião
- Sumário por speaker
- Action items detectados
- Exportação de relatório
```

### 3. Compliance & QA
```
Funcionalidades:
- Verificação de cobertura de políticas
- Redação automática de PII
- Métricas de qualidade
- Fila de revisão
```

### 4. Analytics Dashboard
```
Funcionalidades:
- Talk-time por speaker
- Taxa de interrupção
- Pausa média
- Tópicos detectados
```

---

**Conclusão**: Deepgram fornece uma API poderosa e flexível para transcrição de áudio com recursos avançados de timestamps, diarization e análise. Com a documentação e exemplos deste guia, você pode construir aplicações de voz sofisticadas mantendo alta performance e precisão.

**Créditos:** $200 grátis para começar em [console.deepgram.com](https://console.deepgram.com/)
