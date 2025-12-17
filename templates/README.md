# Sistema de Templates para Roteiros de Comics

## 🎯 Visão Geral

Este sistema de templates automatiza a criação de roteiros no estilo **Alt Shift X** para análise de personagens de comics. Ele combina pesquisa direcionada com geração estruturada de conteúdo, garantindo consistência e qualidade na produção de vídeos.

## 📁 Estrutura dos Arquivos

```
templates/
├── script_template_comics.md     # Template principal completo
├── sections/                     # Sub-templates por seção
│   ├── opening_template.md
│   ├── origin_context_template.md
│   ├── character_development_template.md
│   ├── thematic_analysis_template.md
│   ├── relations_universe_template.md
│   ├── adaptations_template.md
│   ├── theories_curiosities_template.md
│   └── conclusion_template.md
├── mapping/                      # Mapeamento API → Template
│   └── api_to_template_mapping.json
├── config/                       # Configuração do sistema
│   └── template_system_config.json
└── README.md                     # Este arquivo
```

## 🔄 Fluxo de Trabalho

### 1. Planejamento da Pesquisa (Antes da Coleta)
O template funciona como **checklist** para direcionar a pesquisa:
- Define exatamente quais dados buscar
- Otimiza queries da API Comic Vine
- Evita coleta de informações desnecessárias

### 2. Coleta Direcionada de Dados
Usando o mapeamento API → Template:
- Queries específicas para cada seção
- Foco apenas nos dados relevantes
- Validação de qualidade automática

### 3. Geração do Rascunho
- Template preenchido com dados coletados
- Estrutura consistente garantida
- Placeholders para dados ausentes

### 4. Refinamento com IA
- Gemini 2.5 refina o rascunho
- Adiciona tom Alt Shift X
- Melhora fluxo e linguagem

## 📋 Como Usar

### Passo 1: Seleção do Personagem
```bash
# Verifique se o personagem tem dados suficientes
- Score mínimo: 60
- Issues disponíveis: >10
- Anos ativos: >5
```

### Passo 2: Gerar Plano de Pesquisa
```python
# Carregue o template principal
template = load_template("script_template_comics.md")

# Extraia o checklist de pesquisa
checklist = extract_research_checklist(template)

# Gere queries específicas
api_queries = generate_api_queries(checklist, character_id)
```

### Passo 3: Coletar Dados
```python
# Execute as queries mapeadas
character_data = collect_comic_vine_data(api_queries)

# Valide qualidade
if validate_data_quality(character_data):
    proceed_to_script_generation()
else:
    select_different_character()
```

### Passo 4: Gerar Rascunho
```python
# Preencha o template
draft_script = fill_template(template, character_data)

# Adicione placeholders para dados ausentes
draft_script = add_placeholders(draft_script, missing_data)
```

### Passo 5: Refinar com IA
```python
# Envie para Gemini
refined_script = refine_with_gemini(draft_script, style="Alt Shift X")

# Valide formatação
final_script = validate_format(refined_script)
```

## 🔧 Template Variables

### Sintaxe
- **Obrigatórias**: `{variable_name}` (deve ser preenchida)
- **Opcionais**: `{variable_name?}` (pode ficar vazia)
- **Condicional**: `{if_condition}conteúdo{/if}`

### Variáveis Principais
```json
{
  "personagem": "Nome do personagem",
  "nome_completo": "Nome completo/identidade secreta",
  "criador_principal": "Writer principal",
  "co_criador": "Artista principal",
  "primeira_aparicao": "Título #número (mês, ano)",
  "editora_original": "Marvel/DC/etc",
  "poderes": "Lista de poderes e habilidades",
  "arco_inimigo": "Vilão principal",
  "aliado_principal": "Maior aliado",
  "adaptacao_cinema": "Filme principal",
  "teoria_principal": "Teoria mais popular",
  "legado_cultural": "Importância cultural"
}
```

## 📊 Estrutura do Roteiro

| Seção | Duração | Timestamp | Propósito |
|-------|---------|-----------|-----------|
| Abertura | 15s | 00:00:01-00:00:15 | Patrocínio e gancho |
| Contexto | 90s | 00:00:16-00:01:45 | Origem e criação |
| Desenvolvimento | 5min | 00:01:46-00:06:45 | Evolução do personagem |
| Análise | 4min | 00:06:46-00:10:45 | Temas e simbolismo |
| Relações | 3min | 00:10:46-00:13:45 | Universo e conexões |
| Adaptações | 2min | 00:13:46-00:15:45 | Outras mídias |
| Teorias | 2min | 00:15:46-00:17:45 | Curiosidades |
| Conclusão | 90s | 00:17:46-00:19:15 | Resumo e CTA |

## 🔍 API Integration

### Comic Vine API Endpoints
```javascript
// Dados básicos do personagem
GET /character/4005-{id}/?field_list=...

// Histórias do personagem
GET /issues/?filter=character:{id}&sort=cover_date

// Arcos narrativos
GET /story_arcs/?filter=character:{id}

// Séries/volumes
GET /volumes/?filter=character:{id}
```

### Rate Limiting
- **Limite**: 200 requisições por 15 minutos
- **Delay**: 1200ms entre requisições
- **Estratégia**: Requisições em lote com retentativa

## 🎬 Integração com n8n

### Workflow 1 Modificado
```
1. Character Selection
2. ↓ [NOVO] Define Research Template
3. Targeted Data Collection
4. ↓ [NOVO] Generate Script Draft
5. Save Formatted Data
```

### Workflow 2 Modificado
```
1. Load Script Draft
2. Refine with Gemini (Alt Shift X style)
3. Validate Format
4. Generate Storyboard Instructions
5. Final Output
```

## ⚙️ Configuração

### Qualidade Mínima
```json
{
  "character_score": 60,
  "min_issues": 10,
  "min_years_active": 5,
  "required_creators": 1
}
```

### Estilo e Tom
- **Voz**: Conversacional mas informada
- **Tom**: Analítico, geek, apaixonado
- **Formatação**: **Negrito** para ênfase, *itálico* para citações
- **Timestamps**: [HH:MM:SS] obrigatórios

## 🧪 Teste e Validação

### Personagens para Teste
1. **Dados Completos**: Spider-Man, Batman, Superman
2. **Dados Médios**: Personagens B-list dos anos 90
3. **Dados Limitados**: Personagens novos ou obscuros

### Checklist de Validação
- [ ] Todos os timestamps presentes
- [ ] Datas específicas para eventos
- [ ] Nomes exatos de issues
- [ ] Declaração de patrocínio
- [ ] Chamada para ação clara
- [ ] Tese central definida

## 🚀 Melhorias Futuras

### Versão 1.1
- [ ] Integração com mais APIs (Marvel, DC oficial)
- [ ] Templates para diferentes formatos (Top 10, VS, etc)
- [ ] Validação automática de fatos

### Versão 1.2
- [ ] Geração de visual suggestions
- [ ] Integração direta com Remotion
- [ ] Múltiplos idiomas

### Versão 2.0
- [ ] IA treinada especificamente no estilo Alt Shift X
- [ ] Análise automática de temas
- [ ] Geração de título e thumbnail suggestions

## 📞 Suporte

### Problemas Comuns
1. **Dados Insuficientes**: Use placeholders ou selecione outro personagem
2. **API Rate Limit**: Implemente exponential backoff
3. **Formatação Incorreta**: Valide com script validator

### Contato
- Para dúvidas sobre templates: Ver documentação específica da seção
- Para problemas de API: Ver mapping/api_to_template_mapping.json
- Para integração n8n: Ver config/template_system_config.json

---

## 📝 Licença e Uso

Este sistema foi desenvolvido para o projeto Remotion_automation e segue as diretrizes de uso estabelecidas pelo projeto. Os templates podem ser modificados conforme necessidade, mas mantenha a estrutura base para garantir consistência.