# 📆 Aplicación de Gestión de Tareas

Una aplicación de gestión de tareas basada en un calendario, desarrollada con **React Native** y utilizando **Firebase** para autenticación y almacenamiento de datos. Esta aplicación permite a los usuarios gestionar tareas mediante funcionalidades como agregar, actualizar, completar y eliminar tareas, todo integrado en una interfaz de calendario intuitiva.

---

## 🚀 Funcionalidades
- Autenticación de usuarios mediante Firebase.
- Gestión de tareas vinculadas a fechas específicas.
- Integración con un calendario para visualización de tareas.
- Niveles de prioridad para tareas: Alta, Media y Baja.
- Actualizaciones en tiempo real con Firebase Firestore.
- Modos oscuro y claro personalizables.
- Notificaciones de tareas personalizables.

---

## 🛠️ Instalación y Configuración

### Prerrequisitos
Asegúrate de tener instalado lo siguiente:
- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo CLI**: Instálalo globalmente con `npm install -g expo-cli`
- Proyecto de Firebase con Firestore habilitado.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instalar Dependencias
```bash
npm install
```
o
```bash
yarn install
```

### 3. Configurar Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita **Firestore** y **Authentication**.
3. Agrega una aplicación web a tu proyecto de Firebase y copia la configuración.
4. Crea un archivo `.env` en el directorio raíz:
   ```env
   FIREBASE_API_KEY=tu-api-key
   FIREBASE_AUTH_DOMAIN=tu-auth-domain
   FIREBASE_PROJECT_ID=tu-project-id
   FIREBASE_STORAGE_BUCKET=tu-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
   FIREBASE_APP_ID=tu-app-id
   FIREBASE_MEASUREMENT_ID=tu-measurement-id
   ```
5. Actualiza `firebaseConfig.js` para leer las variables de entorno.

### 4. Ejecutar la Aplicación
Inicia el servidor de desarrollo:
```bash
npm start
```
o
```bash
expo start
```

Sigue las instrucciones en la terminal para abrir la aplicación en la app **Expo Go** en tu dispositivo o emulador.

---

## 🌐 Estructura del Proyecto
```plaintext
src/
├── components/          # Componentes reutilizables de la interfaz
├── context/             # Contexto global y temas
├── screens/             # Pantallas de la aplicación (e.g., CalendarScreen, HomeScreen)
├── utils/               # Utilidades de Firebase y funciones auxiliares
└── constants/           # Configuración de Firebase y otras constantes
```

---

## 📚 Cómo Funciona
1. **Autenticación**:
   - Los usuarios deben iniciar sesión o registrarse utilizando email/contraseña.
   - Los datos de los usuarios se almacenan en la colección `users` de Firestore.

2. **Gestión de Tareas**:
   - Las tareas están vinculadas a usuarios específicos mediante su `uid`.
   - Cada tarea se almacena en la colección `tasks` con atributos como `title`, `description`, `date`, `time`, `priority`, y `completed`.

3. **Temas**:
   - La aplicación soporta modos oscuro y claro, personalizables mediante el `ThemeContext`.

4. **Integración con Calendario**:
   - Las tareas se marcan visualmente en el calendario.
   - Las tareas completadas se indican con puntos verdes, y las pendientes con puntos rojos.

---

## 🔧 Personalización

### Agregar Nuevas Funcionalidades
- Extiende los atributos de las tareas (e.g., agrega recordatorios o categorías).
- Implementa notificaciones push utilizando Firebase Cloud Messaging.
- Agrega tareas recurrentes.

### Modificar Temas
Ajusta el objeto `themes` en `src/context/ThemeContext.js` para cambiar colores o agregar nuevos temas.

---

## 📄 Licencia
Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Por favor, realiza un fork del repositorio y envía un pull request para cualquier nueva funcionalidad o corrección de errores.

---

## ✨ Créditos
Desarrollado con ❤️ por Julian Emiliano.

---

## 📧 Contacto
Para consultas o soporte, puedes contactarme en:
- **Email**: julianemiliano.dev@gmail.com
- **GitHub**: [JulianDev404]([https://github.com/tu-usuario](https://github.com/JulianDev404))
