# FinanceAI - Intelligent Financial Analysis System

## Overview

FinanceAI is a comprehensive financial analysis system that combines artificial intelligence with document processing to provide intelligent credit scoring, risk assessment, and financial consultancy services. The application processes bank statements, invoices, and other financial documents to detect patterns, assess creditworthiness, and identify potential risks including gambling activities.

## Multi-Version Architecture

The project is designed as a unified codebase supporting three distinct deployment versions, each optimized for specific use cases while sharing core functionality and algorithms.

### 1. SERVER WEB VERSION (Enterprise Complete)
**Target:** Dedicated servers, enterprise environments
**Status:** Currently implemented and functional

**Architecture:**
- **Backend:** Full Node.js + Express + PostgreSQL stack
- **Features:** Complete admin panel, knowledge base system, multi-user support
- **Processing:** Advanced document analysis with multiple LLM providers
- **Storage:** Full relational database with comprehensive audit trails
- **Scalability:** Horizontal scaling, load balancing ready

**Core Components:**
- Financial-analyzer with full algorithm suite
- Multi-LLM orchestrator (OpenAI, Anthropic, Google, xAI)
- Complete admin panel with user management
- Knowledge base with semantic search
- Advanced monitoring and analytics

### 2. PWA VERSION (Progressive Web App)
**Target:** Web browsers, installable app experience
**Status:** Basic structure exists, needs optimization

**Architecture:**
- **Frontend:** Optimized React with service worker
- **Backend:** Lightweight API endpoints (/api/lite/)
- **Features:** Core analysis functions, simplified admin
- **Processing:** Essential financial analysis algorithms
- **Storage:** IndexedDB + optional cloud sync
- **Offline:** Basic functionality without connection

**Core Components:**
- Same financial-analyzer algorithms (lightweight mode)
- Single primary LLM provider + backup
- Installable PWA with app-like behavior
- Chat-based upload interface only
- Local caching with sync capabilities

**PWA Installation Features:**
- Web app manifest with installation prompts
- Standalone mode (no browser UI)
- Custom splash screen and app icons
- Offline-first architecture with service worker
- Push notifications support

### 3. ANDROID APK VERSION (Native Hybrid)
**Target:** Android devices, Google Play Store
**Status:** Build structure created, needs native integration

**Architecture:**
- **Wrapper:** Kotlin + optimized WebView
- **Core:** PWA embedded with native enhancements
- **Features:** Native file handling, system integration
- **Processing:** Same algorithms with local storage
- **Storage:** SQLite + Room database
- **Sync:** Background upload when online

**Core Components:**
- Same financial-analyzer algorithms (mobile optimized)
- Native Android file picker integration
- SQLite local database with Room ORM
- WebView with native API bridges
- Automatic sync with cloud when available

**Native Enhancements:**
- Deep linking for financial documents
- Native file sharing integration
- Android-specific UI optimizations
- Background processing capabilities
- System notification integration

### Shared Core Architecture (80% Code Reuse)

**Financial Analysis Engine:**
- `financial-analyzer.ts`: Credit scoring, risk assessment, pattern detection
- `multi-llm-orchestrator.ts`: Intelligent LLM routing and backup
- Transaction extraction and categorization algorithms
- Suspicious activity detection (gambling, high-risk patterns)
- Automated report generation with natural language

**Unified Upload System:**
- Chat-based file upload interface (no camera integration)
- Drag & drop support across all versions
- Universal file type support (PDF, Excel, images, Word)
- Consistent processing pipeline: Upload → Extract → Analyze → Report

**Shared Components:**
- React UI components (responsive design)
- TypeScript schemas and types
- Authentication and session management
- Chat interface with conversation management
- Theme system (light/dark mode)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: Express sessions with bcrypt password hashing
- **File Processing**: Multer for file uploads with Python integration for document analysis

### AI/ML Integration
- **LLM Providers**: Multi-provider support including:
  - OpenAI (GPT-4o)
  - Anthropic Claude (claude-sonnet-4-20250514)
  - Google Gemini (gemini-2.5-flash)
- **Document Processing**: Python-based modules for extracting data from PDFs, spreadsheets, and images
- **Financial Analysis**: Custom algorithms for credit scoring and risk assessment

## Key Components

### Data Flow
1. **Document Upload**: Users upload financial documents through the web interface
2. **File Processing**: Python modules extract structured data from documents
3. **AI Analysis**: LLM providers analyze extracted data for patterns and insights
4. **Risk Assessment**: Custom algorithms calculate credit scores and detect suspicious activities
5. **Report Generation**: AI generates comprehensive financial reports and recommendations

### Database Schema
- **Users**: User accounts with authentication and role management
- **Conversations**: Chat-like interface for user interactions
- **Messages**: Individual messages in conversations with AI responses
- **File Uploads**: Metadata and processing status for uploaded documents
- **Financial Analyses**: Structured analysis results with scoring and risk indicators

### Authentication & Authorization
- Session-based authentication using Express sessions
- Password hashing with bcrypt
- Role-based access control (user/admin roles)
- Protected API routes requiring authentication

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon Database
- **File Storage**: Local file system with configurable upload limits
- **AI Services**: API keys required for OpenAI, Anthropic, and Google AI
- **Document Processing**: Python runtime with specialized libraries

## Development Strategy

### Version-Specific Implementations

**SERVER WEB (Current Focus):**
- Implement knowledge base system with semantic search
- Expand admin panel with user activity monitoring
- Add advanced LLM configuration and prompt management
- Optimize database performance and caching

**PWA VERSION (Next Phase):**
- Create lightweight API endpoints (/api/lite/)
- Implement IndexedDB for local storage
- Add service worker for offline functionality
- Optimize bundle size and loading performance
- Enable PWA installation prompts

**ANDROID APK (Final Phase):**
- Integrate native file picker with WebView
- Implement SQLite local storage with Room
- Add background sync capabilities
- Optimize WebView performance for mobile
- Implement deep linking for document handling

### Code Organization Strategy
```
/shared (80% reused)
  /components (React UI)
  /analysis (Financial algorithms)
  /types (TypeScript schemas)
  /utils (Common utilities)

/server-web (Enterprise version)
  /backend (Full Express server)
  /admin (Complete admin panel)
  /knowledge-base (Semantic search)

/pwa (Progressive Web App)
  /lite-api (Optimized endpoints)
  /offline (Service worker + cache)
  /manifest (PWA configuration)

/android (Hybrid App)
  /kotlin (Native wrapper)
  /webview (Optimized web layer)
  /storage (SQLite + Room)
```

### File Processing Support
- PDF documents
- Excel/CSV spreadsheets  
- Images (JPEG, PNG)
- Word documents
- File size limit: 10MB per upload

### Security Features
- Input validation and sanitization
- File type restrictions
- SQL injection protection via parameterized queries
- Session security with configurable secrets

## Deployment Strategy

### Development Environment
- Replit-optimized configuration with hot reloading
- Vite development server with HMR
- Automatic database migrations
- Environment variable management

### Production Build Process
1. Frontend build: `vite build` compiles React app to static assets
2. Backend build: `esbuild` bundles Node.js server with external packages
3. Database setup: Drizzle migrations ensure schema consistency
4. Asset optimization: Static files served efficiently

### Environment Requirements
- Node.js 20+ runtime
- PostgreSQL 16+ database
- Python runtime for document processing
- Required environment variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `SESSION_SECRET`: Session encryption key
  - AI provider API keys (optional but recommended)

### Scalability Considerations
- Database connection pooling for high concurrency
- Stateless session management for horizontal scaling
- Modular AI provider system for load distribution
- Efficient file processing with async operations

## Changelog
- June 26, 2025. Initial setup
- June 26, 2025. Frontend ChatGPT-style interface completed (95% fidelity)
- June 26, 2025. File upload system with progress tracking implemented
- June 26, 2025. Conversation management system with sidebar navigation
- June 26, 2025. Message layout with user/AI distinction and file attachments
- June 26, 2025. Interface ChatGPT 100% finalizada com todas as funcionalidades
- June 26, 2025. Sistema de notificações, validação de arquivos, e controles funcionais
- June 26, 2025. Sidebar comportamento corrigido, perfil reorganizado, funcionalidades ativas
- June 26, 2025. Backend completo implementado: banco de dados, IA real, autenticação
- June 26, 2025. Sistema de análise financeira com OpenAI integrado e funcionando
- June 26, 2025. API completa para conversas, mensagens, uploads e relatórios
- June 26, 2025. Sistema de autenticação completo implementado com login/registro
- June 26, 2025. Interface simplificada criada para resolver conflitos de compilação
- June 26, 2025. Componentes SimpleSidebar e SimpleChatArea funcionais
- June 26, 2025. Android APK project structure created with native WebView wrapper
- June 26, 2025. Complete Android build configuration with Gradle, Kotlin, and resources
- June 26, 2025. Native file upload support and deep linking for document handling
- June 26, 2025. Interface melhorada: botões de envio com fundo transparente
- June 26, 2025. Seletor de tema movido para barra superior dos chats
- June 26, 2025. Bordas melhoradas na caixa de digitação para melhor visibilidade
- June 26, 2025. Sistema de áudio completo: gravação, preview, transcrição automática
- June 26, 2025. Botão de gravação adicionado ao GeminiChatArea com interface roxa
- June 26, 2025. Linhas de cabeçalho removidas do ChatArea, botões flutuantes implementados
- June 26, 2025. Correções de rolagem móvel implementadas com CSS específico
- June 26, 2025. Modal de configurações reorganizado com seções expansíveis
- June 26, 2025. Campos para APIs OpenAI, Anthropic e Google adicionados
- June 26, 2025. Acesso administrativo implementado para funções sensíveis
- June 26, 2025. Sistema Multi-LLM completo implementado com orquestração inteligente
- June 26, 2025. Configurações de estratégias: Econômico, Balanceado e Premium
- June 26, 2025. Sistema de prompts com até 12 campos configuráveis em cadeia
- June 26, 2025. Roteamento inteligente por assunto, backup e validação cruzada
- June 26, 2025. Interface administrativa expandida para gerenciar LLMs e prompts
- June 26, 2025. Financial-analyzer integrado com orquestrador Multi-LLM
- June 27, 2025. AdminPanel implementado com estrutura completa e funcional
- June 27, 2025. Sistema de verificação de permissões de acesso administrativo
- June 27, 2025. Interface de abas para diferentes seções administrativas
- June 27, 2025. Browserslist atualizado para resolver warnings de compatibilidade
- June 27, 2025. Sistema de versionamento unificado implementado (v2.0.0)
- June 27, 2025. PWA completo com manifesto, service worker e funcionalidade offline
- June 27, 2025. Android APK atualizado para versão 2.0.0 (versionCode 2)
- June 27, 2025. Configuração centralizada de versões em version.json
- June 27, 2025. Sistema completo de correções implementado: duplicações removidas, autenticação unificada
- June 27, 2025. Context API implementado para gerenciamento centralizado de configurações
- June 27, 2025. Componentes duplicados removidos (SettingsModal antigo, componentes obsoletos)
- June 27, 2025. Sistema de usuários unificado - removidos hardcoded, usando apenas banco de dados
- June 27, 2025. Middleware de autenticação aprimorado com validação robusta
- June 27, 2025. UnifiedSettingsModal criado substituindo múltiplas implementações
- June 27, 2025. Layout mobile-first implementado: configurações em barra vertical única
- June 27, 2025. AdminPanel redesenhado para mobile com tabs horizontais responsivas
- June 27, 2025. Base de Conhecimento implementada com upload e gerenciamento de documentos
- June 27, 2025. Sistema de gerenciamento de usuários funcional no AdminPanel
- June 27, 2025. Interface otimizada para dispositivos móveis conforme solicitado
- June 27, 2025. Correções de extensões .jsx → .tsx para compatibilidade com servidor
- June 27, 2025. Sistema completo de upload no chat com drag & drop implementado
- June 27, 2025. Análise financeira integrada ao sistema de upload em tempo real
- June 27, 2025. Sistema de Prompts implementado: configuração de 12 campos de cadeia
- June 27, 2025. Estratégias Multi-LLM funcionais: Econômico, Balanceado e Premium
- June 27, 2025. Configurações do Sistema completas: upload, performance, segurança
- June 27, 2025. Interface de upload com preview, progress e validação de arquivos
- June 27, 2025. Orquestração inteligente por assunto com backup e validação cruzada
- June 27, 2025. Sistema de notificações visuais para processamento de arquivos
- June 28, 2025. Botão de tema implementado na página de login com localStorage
- June 28, 2025. Campos de entrada atualizados para bordas rounded-3xl seguindo padrão
- June 28, 2025. PWA manifest atualizado com suporte a tema escuro (theme_color_dark)
- June 28, 2025. Android APK: tema escuro completo implementado com values-night
- June 28, 2025. Sistema de cores unificado para todas as plataformas (Web, PWA, Android)
- June 28, 2025. Versão atualizada para 2.1.0 em todas as plataformas
- June 28, 2025. Sistema de login opcional implementado nas configurações do sistema
- June 28, 2025. Cantos arredondados (rounded-3xl) aplicados em todos os botões e campos de entrada
- June 28, 2025. Botões do modal de configurações reorganizados verticalmente com cores consistentes
- June 28, 2025. AdminPanel redesenhado: layout responsivo, cores dos temas e rolagem corrigida
- June 28, 2025. Todos os formulários e botões seguem agora o padrão de cores claro/escuro
- June 28, 2025. Rodapé da página de login removido (linha divisória e botão "Usar conta de teste")
- June 28, 2025. Nome do usuário agora aparece abaixo da saudação "Olá" na página do chat
- June 28, 2025. Sistema de limpeza automática de cache implementado ao finalizar aplicação
- June 28, 2025. Bordas laterais removidas da página inicial de login para visual mais limpo
- June 28, 2025. Versões atualizadas para v2.2.0 em todas as plataformas (WEB, PWA, Android APK)
- June 28, 2025. Sistema de versionamento unificado atualizado com codename "CleanInterface"
- June 28, 2025. Sistema de cores unificado v2.3.0: botões roxos/azuis substituídos por cinza-600 consistente
- June 28, 2025. AdminPanel header corrigido: fundo roxo removido, ícones cinza aplicados
- June 28, 2025. CleanSettingsModal aprimorado: edição de nome habilitada, estilos consistentes
- June 28, 2025. Bordas rounded-3xl aplicadas uniformemente em todos elementos de formulário
- June 28, 2025. Layout vertical de botões implementado para evitar compressão lateral
- June 28, 2025. Sistema de áudio/transcrição mantido inalterado conforme solicitado
- June 28, 2025. Hierarquia visual melhorada com paleta de cores cinza consistente
- June 28, 2025. Versão atualizada para v2.3.0 codename "ConsistentDesign" em todas plataformas
- June 28, 2025. xAI Grok LLM integrado: suporte completo para modelos Grok-2-1212 e Grok-Vision
- June 28, 2025. Multi-LLM orchestrator atualizado com provider XAI usando OpenAI SDK compatível
- June 28, 2025. Botão "Novo Provedor" removido do AdminPanel conforme solicitado pelo usuário
- June 28, 2025. AdminPanel layout fullscreen implementado para melhor aproveitamento de espaço
- June 28, 2025. Toggle switches corrigidos: cores azuis substituídas por cinza consistente
- June 28, 2025. Sistema de nomes inteligentes: conversas nomeadas pelas primeiras palavras da mensagem
- June 28, 2025. Confirmação de exclusão removida para experiência mais fluida
- June 28, 2025. Comportamento da sidebar corrigido: fecha apenas em ações específicas
- June 28, 2025. Cores do tema escuro aprimoradas: texto claro em configurações e menus
- June 28, 2025. Versão atualizada para v2.5.0 codename "SmartNaming" em todas plataformas
- June 28, 2025. Context API criado para gerenciamento unificado de estado global
- June 28, 2025. Cores do CleanSettingsModal corrigidas no tema escuro com data-modal="settings"
- June 28, 2025. Linha separadora removida entre configurações e botão sair
- June 28, 2025. CSS específico implementado para texto claro em modais de configuração
- June 28, 2025. Sidebar corrigida: não fecha automaticamente após exclusão de conversas
- June 28, 2025. Sistema de atualização de títulos em tempo real implementado
- June 28, 2025. Limpeza de chat ao criar nova conversa ou excluir conversa atual
- June 28, 2025. Versão atualizada para v2.6.0 codename "UXPerfection" em todas plataformas
- June 28, 2025. Sistema de nomes inteligentes implementado: conversas nomeadas automaticamente pelas primeiras 4-6 palavras
- June 28, 2025. Rota PATCH /api/conversations/:id criada para atualização de títulos em tempo real
- June 28, 2025. Análise completa de 17+ problemas arquiteturais identificados e corrigidos
- June 28, 2025. Consistência visual total: todas bordas padronizadas para rounded-3xl
- June 28, 2025. Esquema de cores unificado: substituição completa de azul/roxo por cinza-600 consistente
- June 28, 2025. Sistema de conversas refatorado com estado unificado e props TypeScript corrigidas
- June 28, 2025. Interface do Sidebar corrigida com tipos adequados e fluxo de dados unificado
- June 28, 2025. Versão atualizada para v2.7.0 codename "SmartConversations" em todas plataformas
- June 28, 2025. Sistema de análise financeira completo testado e funcionando com documentos reais
- June 28, 2025. Upload de documentos PDF funcionando: drag & drop, UUIDs, banco de dados
- June 28, 2025. OpenAI LLM provider integrado e funcionando corretamente 
- June 28, 2025. Processamento completo de documentos financeiros: upload → análise → relatório automático
- June 28, 2025. Interface visual de progress e botões de análise financeira implementados
- June 28, 2025. Sistema testado com documentos reais do usuário (extratos PDF, faturas)
- June 29, 2025. Arquitetura multi-versão definida: SERVER WEB, PWA e ANDROID APK
- June 29, 2025. Estratégia unificada de upload via chat (sem câmera) para todas versões
- June 29, 2025. Compartilhamento de 80% do código entre versões mantendo algoritmos core
- June 29, 2025. PWA configurado como app instalável com service worker e offline
- June 29, 2025. Android APK simplificado sem APIs de câmera para máxima compatibilidade
- June 29, 2025. Organização de código definida: /shared, /server-web, /pwa, /android
- June 29, 2025. Versão atual (SERVER WEB) mantida como base enterprise completa

## User Preferences

Preferred communication style: Simple, everyday language.

### Project Scope & Design Principles

**Core Restrictions:**
- No integration with Brazilian bank APIs
- No chat sharing functionality
- No camera integration (simplified upload via chat only)
- Focus on core financial analysis and consultation features

**Unified Upload Strategy:**
- Single chat-based upload interface across all versions
- Drag & drop file support universally
- User controls document quality and scanning externally
- Consistent processing pipeline in all environments

**Version-Specific Optimization:**
- SERVER WEB: Maximum functionality for enterprise use
- PWA: Installable app experience with offline capabilities
- ANDROID: Native integration without camera complexity

### User System
- **Standard User:** Admin / admin123 (default login, configurable via admin panel)
- **Administrator:** Leonardo / L30n4rd0@1004 (access to admin panel only)

### Admin Panel Features (Pending Implementation)
- Configuration management (API keys, prompts)
- User credential management
- Knowledge base management (upload/manage documents, books, articles)
- File upload access and management
- User activity monitoring
- System settings

### Knowledge Base System (Pending Implementation)
- Document upload and indexing (PDFs, books, articles)
- Semantic search with OpenAI embeddings
- Categorization and metadata management
- Integration with AI for contextual responses
- Admin interface for content management
- Vector database for efficient searching