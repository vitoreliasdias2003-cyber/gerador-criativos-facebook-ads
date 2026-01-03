# Gerador de Criativos para Facebook Ads - TODO

## Backend (API)
- [x] Criar tabela de histórico de criativos gerados (opcional para futuro)
- [x] Implementar procedimento tRPC para gerar criativo com LLM
- [x] Integrar prompt especializado em Facebook Ads
- [x] Validar entrada de dados do formulário
- [x] Testar geração com LLM

## Frontend (Interface)
- [x] Criar layout principal com título e subtítulo
- [x] Implementar formulário com todos os campos:
  - [x] Campo de texto: Nicho do produto
  - [x] Campo de texto: Público-alvo
  - [x] Select: Objetivo do anúncio (Vendas/Leads/WhatsApp)
  - [x] Select: Nível de consciência (Frio/Morno/Quente)
  - [x] Select: Tom da comunicação (Emocional/Profissional/Direto/Urgente)
- [x] Implementar botão "Gerar Criativo"
- [x] Criar tela de resultado com exibição de:
  - [x] Headline (com botão copiar)
  - [x] Texto do Anúncio (com botão copiar)
  - [x] CTA (com botão copiar)
  - [x] Ângulo Emocional
  - [x] Ideia de Criativo
- [x] Adicionar estado de carregamento durante geração
- [x] Implementar feedback visual para cópia bem-sucedida

## Testes
- [x] Teste unitário para procedimento de geração
- [x] Teste de integração do formulário

## Deployment
- [x] Criar checkpoint final
- [x] Validar funcionamento completo
