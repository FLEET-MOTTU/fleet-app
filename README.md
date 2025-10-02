# 🚀 Fleet - Sistema de Gestão de Frotas (Mottu)

> Aplicativo mobile desenvolvido em **React Native + Expo**, com perfis diferenciados de **Administrador** e **Funcionário**, para auxiliar na **gestão de frotas de motos** nos pátios da Mottu.  
> A solução foi criada como parte da **Sprint 3** do curso de Análise e Desenvolvimento de Sistemas e está disponivel na branch **fleet-sprint3**

---

## 📌 Propósito da Aplicação

O **Fleet** tem como objetivo otimizar o **controle, alocação e manutenção de motos** dentro dos pátios, oferecendo:

- ✅ **Gestão de funcionários e zonas** para administradores
- ✅ **Cadastro, rastreamento e alocação de motos** para funcionários
- ✅ **Mapeamento do pátio** em zonas delimitadas
- ✅ **Fluxo de registro via BLE (simulado com timer)** para aproximar a experiência real
- ✅ **Persistência de dados local via AsyncStorage**
- ✅ Integração com **API em JAVA** para cadastro e listagem de motos

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

- **Administrador**: `pateo.admin@mottu.com` / `mottu123`
- **Funcionário**: acesso direto via Magic Link

### 👨‍💼 Administrador

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

## 📂 Estrutura de Pastas

```
fleet-app/
├── assets/               # Imagens, ícones e mockups
├── components/           # Componentes reutilizáveis (AppHeader, HeaderMenu, etc.)
├── pages/                # Telas principais divididas por perfil
│   ├── admin/            # Telas do administrador
│   │   ├── Login.tsx
│   │   ├── Zonas/
│   │   └── Funcionarios/
│   └── funcionarios/     # Telas do funcionário
│       ├── Home.tsx
│       ├── Scanner.tsx
│       ├── Registro.tsx
│       ├── ResumoCadastro.tsx
│       └── ListagemMotosScreen.tsx
├── routes/               # Navegação (BottomTabs, Stack Navigators)
├── services/             # Integração com API Java
├── utils/                # Helpers (SafeAreaWrapper, hooks, etc.)
├── App.tsx               # Entrada principal
└── README.md             # Este documento
```

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**
- **[Expo](https://expo.dev/)**
- **[React Navigation](https://reactnavigation.org/)**
- **[AsyncStorage](https://github.com/react-native-async-storage/async-storage)**
- **[NativeWind (Tailwind CSS)](https://www.nativewind.dev/)**
- **[React Native SVG](https://github.com/software-mansion/react-native-svg)**
- **API em Java** para gestão de funcionários e zonas

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
git checkout fleet-sprint3
```

---

## 🌐 Configuração de Ambiente

Crie o arquivo `.env.local`:

```env
API_JAVA_URL=http://10.0.2.2:8080/api
USE_ADMIN_TOKEN=true
ADMIN_TOKEN=eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiUEFURU9fQURNSU4iLCJub21lIjoiQWRtaW4gUMOhdGlvIFRlc3RlIiwicGF0ZW9JZCI6ImVmMGNkZGNiLTdkODMtNGRkNC1iZjNkLWI3M2Q2OGFmMmIzNyIsInN1YiI6InBhdGVvLmFkbWluQG1vdHR1LmNvbSIsImlhdCI6MTc1OTM1NjY0NCwiZXhwIjoxNzU5NDQzMDQ0fQ.ryxThd5oaKcPRnNVy5nodP0fqpVI-30C_nXisUQtU6U-1h0O1IlTEeM3uPPOm_0uYuO849taiwoDKDr95Wld4A
```

- `10.0.2.2` é o equivalente a `localhost` em emuladores Android.

---

## 🌐 Projeto JAVA

> A API precisa estar rodando em `http://localhost:8080`.
> Veja mais no repositório da API: [fleet-JAVA](https://github.com/FLEET-MOTTU/JAVA-MAINAPP)

---

## 🌐 Configuração de arquivo link magico

Em `App.tsx` troque o prefixo abaixo pela porta que está rodando o app:

```
prefixes: ["exp://192.168.15.15:8081", "fleetapp://"],

```

---

## 🌐 Como abrir o link magico?

No proprio google do emulador, você deve colocar um link como no exemplo abaixo, prestando atenção para alterar a porta correta e token. Ao criar um operador na dasboard feito em java será possivel pegar o token do operador criado. Você terá acesso a essa dashboard ao ler a documentação do projeto de JAVA

```
exp://192.168.15.15:8081/--/login-success?token=ce51efd1-6f8e-4c9d-b7a5-ba9271a5f8c9

```

## 🔗 Integrações

| Funcionalidade        | API  | Endpoint             | Método |
| --------------------- | ---- | -------------------- | ------ |
| Login Administrador   | Java | `/auth/login-adm`    | POST   |
| Cadastro Funcionário  | Java | `/funcionarios`      | POST   |
| Listagem Funcionários | Java | `/usuarios`          | GET    |
| Delimitação de Zonas  | Java | `/pateos/{id}/zonas` | POST   |

---
