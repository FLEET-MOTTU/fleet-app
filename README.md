# 🚀 Fleet - Sistema de Gestão de Frotas (Mottu)

> Aplicativo mobile desenvolvido em **React Native + Expo**, com perfis diferenciados de **Administrador** e **Funcionário**, para auxiliar na **gestão de frotas de motos** nos pátios da Mottu.  
> A solução foi criada como parte da **Sprint 4** do curso de Análise e Desenvolvimento de Sistemas e está disponivel na branch **fleet-sprint4**

---

## 📌 Propósito da Aplicação

O **Fleet** tem como objetivo otimizar o **controle, alocação e manutenção de motos** dentro dos pátios, oferecendo:

- ✅ **Gestão de funcionários e zonas** para administradores
- ✅ **Cadastro, rastreamento e alocação de motos** para funcionários
- ✅ **Mapeamento do pátio** em zonas delimitadas
- ✅ **Fluxo de registro via BLE (simulado com timer)** para aproximar a experiência real
- ✅ **Persistência de dados local via AsyncStorage**
- ✅ Integração com **API em JAVA** para administrador
- ✅ Integração com **API em C#** para funcionario
-

- Link do video: https://drive.google.com/file/d/1M2q1p-xtA0cGrwAtzhxfdF0dnpEYws9e/view?usp=sharing

## 👥 Equipe de Desenvolvimento

| Nome Completo                | RM       | GitHub                                                |
| ---------------------------- | -------- | ----------------------------------------------------- |
| Amanda Ferreira              | RM556071 | [@amandamesq](https://github.com/mandyy14)            |
| Beatriz Ferreira Cruz        | RM555698 | [@beatrizfcruz](https://github.com/BeatrizFerreira01) |
| Journey Tiago Lopes Ferreira | RM556071 | [@JourneyTiago](https://github.com/JouTiago)          |

---

## 🧹 Funcionalidades da Aplicação

### 🔐 Login

- **Administrador**: `clarice@email.com.br` / `teste123`
- **Funcionário**: acesso direto

### 👨💼 Administrador

- 📋 Cadastro de funcionários
- 👥 Listagem e edição de funcionários
- 🗺️ Delimitação de zonas do pátio (manutenção, aprovadas etc.)
- 🔍 Visualização de zonas no mapa

### 🛵 Funcionário

- 📡 Simulação de **scaneamento BLE** (timer de 3s → registro)
- 📝 Cadastro de motos (placa e estado)
- 📃 Listagem das motos cadastradas
- ✅ Finalização do fluxo com resumo

---

## 📂 Estrutura de Pastas (atualizada)

Abaixo está a árvore de diretórios atual do projeto, com descrições rápidas de cada pasta/arquivo relevante.

```
fleet-app/
├── App.tsx                      # Entrada principal do aplicativo (Expo)
├── app/                         # Código da aplicação organizado por domínio
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ActiveItem/
│   │   │   └── index.tsx
│   │   ├── AppHeader/
│   │   │   └── index.tsx
│   │   ├── BackButton/
│   │   │   └── index.tsx
│   │   ├── Button/
│   │   │   └── index.tsx
│   │   ├── Input/
│   │   │   └── index.tsx
│   │   ├── QuickCard/
│   │   │   └── index.tsx
│   │   └── common/               # Componentes genéricos compartilhados
│   │       └── HeaderMenu/
│   │           └── index.tsx
│   ├── contexts/                 # Contextos (ThemeContext, etc.)
│   │   └── ThemeContext.tsx
│   ├── hooks/                    # Hooks customizados (useMagicLink)
│   │   └── useMagicLink.ts
│   ├── locales/                  # Traduções e i18n
│   │   ├── i18n.ts
│   │   ├── es/
│   │   └── pt/
│   ├── pages/                    # Telas organizadas por área/perfil
│   │   ├── admin/
│   │   │   ├── About/
│   │   │   │   └── SobreAppScreen.tsx
│   │   │   ├── CadastroFuncionario/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   │       ├── FuncionarioFrom/
│   │   │   │       └── UploadPhoto/
│   │   │   ├── ChangePassword/
│   │   │   ├── ForgotPassword/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Pateo/
│   │   │   └── Zonas/
│   │   │       └── DelimitacaoZonasScreen.tsx
│   │   └── funcionarios/
│   │       ├── Home/
│   │       ├── Login/
│   │       ├── LoginMagicLink/
│   │       ├── Motos/
│   │       ├── Registro/
│   │       ├── ResumoCadastro/
│   │       ├── Scanner/
│   │       └── ZonaDestinada/
│   ├── routes/                    # Arquivos de navegação
│   │   └── (vinculados da raiz: see /routes)
│   └── services/                  # Serviços de nível de app (p.ex. wrappers locais)
├── assets/                        # Imagens, ícones e assets estáticos
├── routes/                        # Navegação e stacks compartilhados
│   ├── AppNavigator.tsx
│   ├── BottomTabsAdm.js
│   ├── BottomTabsFuncionario.js
│   ├── CadastroMotoStack.tsx
│   └── navigation.ts
├── services/                      # Integração com APIs e mocks
│   ├── apiCsharp.ts
│   ├── apiCSharpMock.ts
│   ├── apiJava.jsx
│   ├── loginMock.ts
│   ├── mockDb.ts
│   ├── motoMockService.ts
│   └── motoService.ts
│   └── auth/
│       └── session.ts
├── contexts/                      # (também sob app/) contexto global do app
├── types/                         # Tipos TypeScript e declarações (assets.d.ts)
├── utils/                         # Utilitários e helpers (env.ts, notificationService.ts, safeAreaWrapper.tsx)
├── env.d.ts                       # Tipagens de variáveis de ambiente
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── README.md                      # Documentação do projeto (este arquivo)
└── global.css                      # Estilos globais / utilitários

```

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**
- **[Expo](https://expo.dev/)**
- **[React Navigation](https://reactnavigation.org/)**
- **[AsyncStorage](https://github.com/react-native-async-storage/async-storage)**
- **[NativeWind (Tailwind CSS)](https://www.nativewind.dev/)**
- **[React Native SVG](https://github.com/software-mansion/react-native-svg)**

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Git

### Passos

```bash
# Clone o repositório
git clone https://github.com/FLEET-MOTTU/fleet-app.git

# Acesse a pasta
cd fleet-app

# Instale dependências
npm install

# Inicie a aplicação
npx expo start

# Acesse a branch correta
git checkout fleet-sprint4
```

---

## 🌐 Configuração de Ambiente

Crie o arquivo `.env.local`:

```env
# === Deep Links ===
DEEPLINK_BASE_URL_DEV=exp://192.168.15.21:8081/--/
DEEPLINK_BASE_URL_PROD=fleetapp://

# === API Java ===
API_JAVA_URL=http://fleet-app-journeytiago7.westus2.azurecontainer.io:8080/api

# === API C# ===
API_CS_URL=http://mottu-csharp-api-tiago.westus2.azurecontainer.io/api

# === Configurações de debug ===
USE_ADMIN_TOKEN=false
ADMIN_TOKEN=

USE_CS_MOCK=true
# === Mock para funcionário (para evitar erro 401) ===
USE_FUNC_TOKEN=true
FUNC_TOKEN=eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiT1BFUkFDSU9OQUwiLCJub21lIjoiVWR5ciIsInBhdGVvSWQiOiIyODg4YjBjZC04MDhkLTQ2YmQtODhmNS05NjczZDI0NzdiYzAiLCJzdWIiOiIxMTk4NzY1NDMzMSIsImlhdCI6MTc2MjU3MzUyNiwiZXhwIjoxNzYyNjU5OTI2fQ.Km92T-xyjkSNziDaADPUALSRm5sOgCvzTBft-euPKk4EvDjgSsR_H7x4ZpzazaM0HeHUuawvN_p_erz0A5Z5pw


APP_NAME=Fleet
APP_VERSION=1.0.0
COMMIT_RESUMIDO=2f95984
COMMIT_HASH=2f95984125aed809581664ce44e9647b9004a84d

```
