# 📱 FLEET - Sistema de Gestão de Frotas

> Solução mobile desenvolvida em React Native com gerenciamento para administradores e funcionários. O projeto permite cadastro, listagem e visualização de motos, além da delimitação de zonas no mapa.

Com o objetivo de rastrear, organizar e gerenciar a movimentação de motos nos pátios da empresa **Mottu**.

---

## 💡 Visão Geral da Solução

O sistema _FLEET_ foi idealizado para resolver um problema real da empresa Mottu no controle de entrada, alocação e saída de motos em seus pátios. Ele utiliza como conceito base:

- Mapeamento do pátio com zonas delimitadas (ex: Manutenção, Aprovadas, Vistoria)
- Cadastro e rastreamento de motos com status atualizado em tempo real
- Alocação automática da moto em uma zona adequada
- Utilização de beacons e tags Bluetooth Low Energy (BLE) para rastreamento interno
- Interface para controle visual da localização e status das motos

---

---

## 👥 Integrantes

| Nome Completo                | RM       |
| ---------------------------- | -------- |
| Amanda Ferreira              | RM556071 |
| Beatriz Ferreira Cruz        | RM555698 |
| Journey Tiago Lopes Ferreira | RM556071 |

---

## 🧩 Funcionalidades

### 🔐 Login

- Login com autenticação local via AsyncStorage
- Acesso separado por perfil:
  - Administrador
  - Funcionário

### 👤 Administrador

- Cadastro de funcionários
- Listagem de funcionários
- Delimitação de zonas com mapa
- Visualização das zonas cadastradas

### 🛵 Funcionário

- Cadastro de motos (com modelo, placa e status)
- Listagem das motos cadastradas
- Visualização de mapa com zonas delimitadas pelo administrador

---

## 🧰 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
- [React Navigation](https://reactnavigation.org/)
- [Tailwind CSS via NativeWind](https://www.nativewind.dev/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js
- Expo CLI
- Git

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fleet-app.git

# Acesse a pasta
cd fleet-app

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```
