# 📱 FLEET - Sistema de Gestão de Frotas

> Solução mobile desenvolvida com **React Native** para gerenciar a movimentação de motos nos pátios da empresa **Mottu**, com acesso diferenciado para **administradores** e **funcionários**.

---

## 💡 Visão Geral da Solução

O sistema **FLEET** visa resolver problemas reais de logística e controle da Mottu:

- Mapeamento do pátio com zonas delimitadas (ex: Manutenção, Aprovadas, Vistoria)
- Cadastro e rastreamento de motos com status atualizados em tempo real
- Alocação automática de motos em zonas adequadas
- Utilização de beacons com tags BLE (Bluetooth Low Energy) para rastreamento interno
- Interface moderna para visualização e gerenciamento

---

## 👥 Equipe de Desenvolvimento

| Nome Completo                | RM       |
| ---------------------------- | -------- |
| Amanda Ferreira              | RM556071 |
| Beatriz Ferreira Cruz        | RM555698 |
| Journey Tiago Lopes Ferreira | RM556071 |

---

## 🧹 Funcionalidades da Aplicação

### 🔐 Login com Perfis Diferenciados

- Autenticação local com `AsyncStorage`
- Escolha entre dois perfis:

  - **Administrador:** `admin@fleet.com` / `Admin123`
  - **Funcionário:** acesso direto via botão

### 👨‍💼 Funcionalidades do Administrador

- 📋 Cadastro de funcionários
- 👥 Listagem e edição de funcionários
- 🗺️ Delimitação de zonas no pátio
- 🔍 Visualização das zonas cadastradas

### 🛠️ Funcionalidades do Funcionário

- 🙵 Cadastro de motos (modelo, placa e status)
- 📃 Listagem das motos cadastradas
- 🗺️ Visualização do mapa com as zonas definidas pelo administrador

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

- Node.js
- Expo CLI
- Git

### Passos para Iniciar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fleet-app.git

# Acesse a pasta do projeto
cd fleet-app

# Instale as dependências
npm install

# Inicie a aplicação
npx expo start
```

---

## 🌐 Configuração de Ambiente (`.env.local`)

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
API_CSHARP_URL=http://10.0.2.2:8080/api
```

### 🧐 Observações:

- `10.0.2.2` é o equivalente a `localhost` em emuladores Android.
- Esse endpoint é usado para comunicação com a **API em C#**.

---

## 🔗 Integração com API em C\#

As seguintes **telas do app** consomem a API construída em ASP.NET C#:

| Tela              | Endpoint      | Método |
| ----------------- | ------------- | ------ |
| Cadastro de Motos | `POST /motos` | POST   |
| Listagem de Motos | `GET /motos`  | GET    |

> A API precisa estar rodando em `http://localhost:8080`.
> Veja mais no repositório da API: [fleet-api-csharp](https://github.com/FLEET-MOTTU/C--POC)

---

## ✅ Considerações Finais

- A aplicação **não depende de backend** para login e zonas — essas funcionalidades são mockadas com **AsyncStorage**.
- Para o cadastro e listagem de motos, a comunicação ocorre com a API **em C#**.
- O código está estruturado para permitir fácil evolução, como futura autenticação real via backend.

---
