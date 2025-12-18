# About Remotion

Remotion is a framework that can create videos programmatically.
It is based on React.js. All output should be valid React code and be written in TypeScript.

# Project structure

A Remotion Project consists of an entry file, a Root file and any number of React component files.
A project can be scaffolded using the "npx create-video@latest --blank" command.
The entry file is usually named "src/index.ts" and looks like this:

```tsx
import {registerRoot} from 'remotion';
import {Root} from './Root';

registerRoot(Root);

```

The Root file is usually named "src/Root.tsx" and looks like this:

```tsx
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={120}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};

```

A `<Composition>` defines a video that can be rendered. It consists of a React "component", an "id", a "durationInFrames", a "width", a "height" and a frame rate "fps".
The default frame rate should be 30.
The default height should be 1080 and the default width should be 1920.
The default "id" should be "MyComp".
The "defaultProps" must be in the shape of the React props the "component" expects.

Inside a React "component", one can use the "useCurrentFrame()" hook to get the current frame number.
Frame numbers start at 0.

```tsx
export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	return <div>Frame {frame}</div>;
};

```

# Component Rules

Inside a component, regular HTML and SVG tags can be returned.
There are special tags for video and audio.
Those special tags accept regular CSS styles.

If a video is included in the component it should use the "<Video>" tag.

```tsx
import {Video} from '@remotion/media';

export const MyComp: React.FC = () => {
	return (
		<div>
			<Video
				src="<https://remotion.dev/bbb.mp4>"
				style={{width: '100%'}}
			/>
		</div>
	);
};

```

Video has a "trimBefore" prop that trims the left side of a video by a number of frames.
Video has a "trimAfter" prop that limits how long a video is shown.
Video has a "volume" prop that sets the volume of the video. It accepts values between 0 and 1.

If an non-animated image is included In the component it should use the "<Img>" tag.

```tsx
import {Img} from 'remotion';

export const MyComp: React.FC = () => {
	return <Img src="<https://remotion.dev/logo.png>" style={{width: '100%'}} />;
};

```

If an animated GIF is included, the "@remotion/gif" package should be installed and the "<Gif>" tag should be used.

```tsx
import {Gif} from '@remotion/gif';

export const MyComp: React.FC = () => {
	return (
		<Gif
			src="<https://media.giphy.com/media/l0MYd5y8e1t0m/giphy.gif>"
			style={{width: '100%'}}
		/>
	);
};

```

If audio is included, the "<Audio>" tag should be used.

```tsx
import {Audio} from '@remotion/media';

export const MyComp: React.FC = () => {
	return <Audio src="<https://remotion.dev/audio.mp3>" />;
};

```

Asset sources can be specified as either a Remote URL or an asset that is referenced from the "public/" folder of the project.
If an asset is referenced from the "public/" folder, it should be specified using the "staticFile" API from Remotion

```tsx
import {staticFile} from 'remotion';
import {Audio} from '@remotion/media';

export const MyComp: React.FC = () => {
	return <Audio src={staticFile('audio.mp3')} />;
};

```

Audio has a "trimBefore" prop that trims the left side of a audio by a number of frames.
Audio has a "trimAfter" prop that limits how long a audio is shown.
Audio has a "volume" prop that sets the volume of the audio. It accepts values between 0 and 1.

If two elements should be rendered on top of each other, they should be layered using the "AbsoluteFill" component from "remotion".

```tsx
import {AbsoluteFill} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>This is in the back</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>This is in front</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

```

Any Element can be wrapped in a "Sequence" component from "remotion" to place the element later in the video.

```tsx
import {Sequence} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<div>This only appears after 10 frames</div>
		</Sequence>
	);
};

```

A Sequence has a "from" prop that specifies the frame number where the element should appear.
The "from" prop can be negative, in which case the Sequence will start immediately but cut off the first "from" frames.

A Sequence has a "durationInFrames" prop that specifies how long the element should appear.

If a child component of Sequence calls "useCurrentFrame()", the enumeration starts from the first frame the Sequence appears and starts at 0.

```tsx
import {Sequence} from 'remotion';

export const Child: React.FC = () => {
	const frame = useCurrentFrame();

	return <div>At frame 10, this should be 0: {frame}</div>;
};

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<Child />
		</Sequence>
	);
};

```

For displaying multiple elements after another, the "Series" component from "remotion" can be used.

```tsx
import {Series} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={20}>
				<div>This only appears immediately</div>
			</Series.Sequence>
			<Series.Sequence durationInFrames={30}>
				<div>This only appears after 20 frames</div>
			</Series.Sequence>
			<Series.Sequence durationInFrames={30} offset={-8}>
				<div>This only appears after 42 frames</div>
			</Series.Sequence>
		</Series>
	);
};

```

The "Series.Sequence" component works like "Sequence", but has no "from" prop.
Instead, it has a "offset" prop shifts the start by a number of frames.

For displaying multiple elements after another another and having a transition inbetween, the "TransitionSeries" component from "@remotion/transitions" can be used.

```tsx
import {
	linearTiming,
	springTiming,
	TransitionSeries,
} from '@remotion/transitions';

import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

export const MyComp: React.FC = () => {
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="blue" />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={springTiming({config: {damping: 200}})}
				presentation={fade()}
			/>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="black" />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={linearTiming({durationInFrames: 30})}
				presentation={wipe()}
			/>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="white" />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};

```

"TransitionSeries.Sequence" works like "Series.Sequence" but has no "offset" prop.
The order of tags is important, "TransitionSeries.Transition" must be inbetween "TransitionSeries.Sequence" tags.

Remotion needs all of the React code to be deterministic. Therefore, it is forbidden to use the Math.random() API.
If randomness is requested, the "random()" function from "remotion" should be used and a static seed should be passed to it.
The random function returns a number between 0 and 1.

```tsx
import {random} from 'remotion';

export const MyComp: React.FC = () => {
	return <div>Random number: {random('my-seed')}</div>;
};

```

Remotion includes an interpolate() helper that can animate values over time.

```tsx
import {interpolate} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const value = interpolate(frame, [0, 100], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<div>
			Frame {frame}: {value}
		</div>
	);
};

```

The "interpolate()" function accepts a number and two arrays of numbers.
The first argument is the value to animate.
The first array is the input range, the second array is the output range.
The fourth argument is optional but code should add "extrapolateLeft: 'clamp'" and "extrapolateRight: 'clamp'" by default.
The function returns a number between the first and second array.

If the "fps", "durationInFrames", "height" or "width" of the composition are required, the "useVideoConfig()" hook from "remotion" should be used.

```tsx
import {useVideoConfig} from 'remotion';

export const MyComp: React.FC = () => {
	const {fps, durationInFrames, height, width} = useVideoConfig();
	return (
		<div>
			fps: {fps}
			durationInFrames: {durationInFrames}
			height: {height}
			width: {width}
		</div>
	);
};

```

Remotion includes a "spring()" helper that can animate values over time.
Below is the suggested default usage.

```tsx
import {spring} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const value = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});
	return (
		<div>
			Frame {frame}: {value}
		</div>
	);
};

```

## Rendering

To render a video, the CLI command "npx remotion render [id]" can be used.
The composition "id" should be passed, for example:

$ npx remotion render MyComp

To render a still image, the CLI command "npx remotion still [id]" can be used.
For example:

$ npx remotion still MyComp

## Rendering on Lambda

Videos can be rendered in the cloud using AWS Lambda.
The setup described under https://www.remotion.dev/docs/lambda/setup must be completed.

Rendering requires a Lambda function and a site deployed on S3.

If the user is using the CLI:

- A Lambda function can be deployed using `npx remotion lambda functions deploy`: https://www.remotion.dev/docs/lambda/cli/functions/deploy
- A site can be deployed using `npx remotion lambda sites create`: https://www.remotion.dev/docs/lambda/cli/sites/create. The first argument must refer to the entry point.
- A video can be rendered using `npx remotion lambda render [comp-id]`. The composition ID must be referenced.

If the user is using the Node.js APIs:

- A Lambda function can be deployed using `deployFunction()`: https://www.remotion.dev/docs/lambda/deployfunction
- A site can be deployed using `deploySite()`: https://www.remotion.dev/docs/lambda/deploysite
- A video can be rendered using `renderMediaOnLambda()`: https://www.remotion.dev/docs/lambda/rendermediaonlambda.
- If a video is rendered, the progress must be polled using `getRenderProgress()`: https://www.remotion.dev/docs/lambda/getrenderprogress

## 📊 **VISÃO GERAL DA API**

A **Comic Vine API** é uma das bases de dados mais completas sobre quadrinhos. Ela cobre:

- **Marvel, DC, Image, Dark Horse, IDW** e centenas de outras editoras
- **Personagens, edições, volumes, arcos, criadores, localizações, conceitos, objetos**
- **Relações entre personagens** (amigos, inimigos, times)
- **Histórico completo**: primeira aparição, mortes, ressurreições
- **Metadados ricos**: imagens, descrições, cronologias

---

## 🔑 **ENDPOINTS ESSENCIAIS PARA SEU PROJETO**

### **1. `/character` - O CORAÇÃO DO SEU SISTEMA**

**Para que serve?** Pegar informações **COMPLETAS** de um personagem específico.

**Campos que você vai AMAR (e usar em 90% dos vídeos):**

| Campo | Descrição | Uso no Vídeo |
| --- | --- | --- |
| `name` | Nome do personagem | Título/Referências |
| `real_name` | Nome real | Comparações comics vs filmes |
| `aliases` | Apelidos (ex: "Spidey, Web-Head") | Curiosidades/Easter eggs |
| `deck` | Resumo breve | Intro do vídeo |
| `description` | Biografia COMPLETA (HTML) | Script base automatizado |
| `powers` | Lista de poderes | Análises de poder |
| `origin` | Origem (Human, Alien, Mutant, etc.) | Contexto narrativo |
| `publisher` | Editora (Marvel, DC) | Comparações |
| `creators` | **CRIADORES REAIS** (Stan Lee, etc.) | **Contexto dos criadores** (estilo Alt Shift X) |
| `character_friends` | Lista de aliados | Relações/Dinâmicas |
| `character_enemies` | Lista de inimigos | Conflitos/Arcos |
| `teams` | Times (Avengers, Justice League) | Afiliações |
| `first_appeared_in_issue` | **Primeira aparição** | História de publicação |
| `count_of_issue_appearances` | Número de aparições | Relevância/Popularidade |
| `issue_credits` | **TODAS as edições** | Cronologia completa |
| `story_arc_credits` | Arcos narrativos | Análises profundas |
| `movies` | Filmes relacionados | **Comparações comics vs filmes** |
| `image` | Imagens oficiais | B-roll/Thumbnails |

**Exemplo de uso:**

```
GET /character/1443/?api_key=YOUR_KEY&format=json&field_list=name,real_name,powers,creators,description,movies

```

**Resultado:** Dados do **Spider-Man** com TUDO que você precisa para o vídeo "Spider-Man Comics vs Movies".

---

### **2. `/issue` - DETALHES DE EDIÇÕES ESPECÍFICAS**

**Para que serve?** Investigar **edições específicas** mencionadas no vídeo (ex: Amazing Spider-Man #121 - morte da Gwen Stacy).

**Campos úteis:**

- `character_credits`: Quem aparece
- `characters_died_in`: Mortes importantes
- `first_appearance_characters`: Estreias
- `person_credits`: Escritores/Artistas (John Romita, etc.)
- `story_arc_credits`: Parte de qual arco
- `cover_date` vs `store_date`: Datas de publicação

**Uso no vídeo:** "Na edição #121 de Amazing Spider-Man (1973), escrita por Gerry Conway e desenhada por Gil Kane, a morte de Gwen Stacy revolucionou os quadrinhos..."

---

### **3. `/characters` (plural) - BUSCA E COMPARAÇÕES**

**Para que serve?** Buscar múltiplos personagens com **filtros**.

**Filtros poderosos:**

```
filter=name:spider
filter=publisher:10 (Marvel)
filter=gender:Female

```

**Exemplo:** "Todos os personagens DC Absolute"

```
GET /characters/?api_key=YOUR_KEY&filter=name:absolute,publisher:DC&format=json

```

---

### **4. `/story_arc` - ARCOS NARRATIVOS**

**Para que serve?** Analisar **arcos completos** (Civil War, Knightfall, Infinity Gauntlet).

**Campos:**

- `description`: História completa do arco
- `issue_credits`: Todas as edições envolvidas
- `publisher`: Editora
- `first_appeared_in_issue`: Início do arco

**Uso:** "Durante o arco 'Clone Saga' (1994-1996), que envolveu 47 edições..."

---

### **5. `/concept` - CONCEITOS NARRATIVOS**

**Para que serve?** Explicar **conceitos recorrentes** (Symbiotes, Multiverse, Phoenix Force).

**Uso:** "O conceito de 'Spider-Verse' apareceu pela primeira vez em..."

---

### **6. `/movie` - ADAPTAÇÕES CINEMATOGRÁFICAS**

**Para que serve?** Comparar **filmes com os quadrinhos**.

**Campos:**

- `characters`: Personagens do filme
- `budget` / `box_office_revenue`: Contexto de produção
- `description`: Sinopse
- `rating`: Classificação