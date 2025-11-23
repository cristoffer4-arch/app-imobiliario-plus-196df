# 🏠 Imobiliário GO - Gestão Imobiliária Inteligente

Plataforma de gestão imobiliária com Inteligência Artificial para corretores em Portugal e Brasil.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+ instalado
- npm ou yarn
- Chave API OpenAI

### Instalação

```bash
# Clonar repositório
git clone <seu-repositorio>
cd imobiliario-go

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves
```

### Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Porta da aplicação
PORT=3001

# OpenAI (Obrigatório)
OPENAI_API_KEY="sua-chave-openai"

# Supabase (Opcional - para funcionalidades futuras)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service"
```

### Rodando na porta 3001 por padrão

Este projeto está configurado para rodar na **porta 3001** tanto em desenvolvimento quanto em produção.

### Executar em Desenvolvimento

```bash
# Porta padrão (3001)
npm run dev

# Abrir navegador
# http://localhost:3001
```

### Build e Produção

```bash
# Build
npm run build

# Iniciar servidor de produção (porta 3001)
npm start

# Abrir navegador
# http://localhost:3001
```

## 📖 Documentação Completa

- **[Relatório Técnico Detalhado](./RELATORIO-TECNICO.md)** - Arquitetura, stack, endpoints, configurações
- **[Guia de Porta 3001](./README-PORT-3001.md)** - Como rodar na porta 3001 (dev, prod, Docker, PM2, Nginx)
- **[Status do Projeto](./STATUS-PROJETO.md)** - Tarefas concluídas e pendentes
- **[Checklist de Deploy](./CHECKLIST-DEPLOY.md)** - Passo a passo para deploy

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15.4.6 (App Router)
- **UI:** React 19.1.0 + TypeScript
- **Styling:** Tailwind CSS v4
- **Componentes:** Shadcn/ui + Radix UI
- **IA:** OpenAI GPT-4o
- **Database:** Supabase (configurado)
- **Deploy:** Vercel (recomendado)

## 📁 Estrutura do Projeto

```
projeto/
├── src/
│   ├── app/              # App Router (páginas e API)
│   │   ├── api/chat/     # Endpoint OpenAI
│   │   ├── layout.tsx    # Layout raiz
│   │   └── page.tsx      # Página principal (Chat)
│   ├── components/       # Componentes React
│   │   └── ui/          # Shadcn/ui components
│   ├── lib/             # Bibliotecas e utilitários
│   │   └── openai.ts    # Cliente OpenAI
│   └── hooks/           # React Hooks customizados
├── public/              # Assets estáticos
├── .env.local           # Variáveis de ambiente (criar)
└── package.json         # Dependências e scripts
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (porta 3001)
npm run dev

# Build
npm run build            # Compilar para produção

# Produção (porta 3001)
npm start

# Linting
npm run lint             # Verificar código
```

## 🌐 Configuração de Porta

### Porta Padrão: 3001

O projeto está configurado para usar a **porta 3001** por padrão em todos os ambientes:

- **Desenvolvimento:** `npm run dev` abre em `http://localhost:3001`
- **Produção:** `npm start` abre em `http://localhost:3001`

### Alterando a Porta (se necessário)

**Opção 1: Variável de ambiente (.env.local)**
```bash
PORT=3002
```

**Opção 2: Flag inline (desenvolvimento)**
```bash
npm run dev -- -p 3002
```

**Opção 3: Editar package.json**
```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3002",
    "start": "next start -p 3002"
  }
}
```

📚 **[Guia Completo de Porta 3001](./README-PORT-3001.md)** - Inclui Docker, PM2, Nginx

## 🐳 Docker

```bash
# Build
docker build -t imobiliario-go .

# Run (porta 3001)
docker run -p 3001:3001 --env-file .env.local imobiliario-go

# Ou usar docker-compose
docker-compose up -d
```

## 🔄 PM2 (Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar
pm2 start ecosystem.config.js

# Status
pm2 status

# Logs
pm2 logs imobiliario-go
```

## 🌐 Nginx (Proxy Reverso)

```nginx
upstream nextjs_backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ☁️ Deploy

### Vercel (Recomendado)

```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel --prod

# Configurar variáveis no dashboard
# https://vercel.com/seu-projeto/settings/environment-variables
```

### Outras Plataformas

- **Railway:** Conectar repositório Git
- **Render:** Deploy automático via Git
- **AWS/GCP/Azure:** Usar Docker ou PM2

## 🔐 Segurança

⚠️ **IMPORTANTE:**

- **NUNCA** commite `.env.local` no Git
- Use variáveis de ambiente para chaves sensíveis
- Configure CORS adequadamente em produção
- Implemente rate limiting para APIs

## 🧪 Testes

```bash
# Testes unitários (quando implementados)
npm run test

# Testes E2E (quando implementados)
npm run test:e2e

# Cobertura (quando implementados)
npm run test:coverage
```

## 📊 Monitoramento

### Logs

```bash
# Desenvolvimento
# Logs aparecem no terminal

# Produção com PM2
pm2 logs imobiliario-go

# Docker
docker logs -f imobiliario-go
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação:** [RELATORIO-TECNICO.md](./RELATORIO-TECNICO.md)
- **Issues:** Abra uma issue no GitHub
- **Email:** suporte@imobiliario-go.com

## 🗺️ Roadmap

### ✅ Concluído
- [x] Setup Next.js 15 + React 19
- [x] Integração OpenAI GPT-4o
- [x] Interface de chat funcional
- [x] Design responsivo
- [x] SEO otimizado

### 🔄 Em Desenvolvimento
- [ ] Sistema de autenticação (Supabase)
- [ ] CRUD de imóveis
- [ ] Dashboard de gestão
- [ ] Integração Casafari API

### 📋 Planejado
- [ ] Sistema de deduplicação com IA
- [ ] Análise preditiva
- [ ] Relatórios automatizados
- [ ] App mobile (React Native)

## 📈 Status do Projeto

**Versão:** 0.1.0  
**Status:** 🟡 Em Desenvolvimento  
**Última atualização:** 22/11/2024

---

**Desenvolvido com ❤️ para corretores de imóveis em Portugal e Brasil**
