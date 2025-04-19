# LinkSage

LinkSage es una aplicación web que recopila y muestra enlaces a sorteos (giveaways) semanales o mensuales de cualquier videojuego o artículo disponible en la tienda de Instant Gaming. El objetivo es ofrecer a los usuarios una forma sencilla y centralizada de descubrir y acceder a estos sorteos.

---

## Características principales

- **Listado actualizado** de sorteos activos de Instant Gaming.
- **Temporizador** que muestra el tiempo restante para cada sorteo.
- **Interfaz moderna y responsiva** para una experiencia de usuario óptima.
- **Soporte multilenguaje** (español, inglés, francés).

---

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Ezequiel-Morena/LinkSage.git
   cd LinkSage
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
---

## Estructura del proyecto

El código fuente se encuentra en la carpeta `src`. A continuación, se describe el propósito de cada componente, hook y utilidad principal:

### Componentes (`src/components/`)

- **LinkList.tsx**  
  Muestra la lista de sorteos activos, obteniendo los datos de los enlaces y renderizando cada uno como un elemento interactivo. Gestiona el estado de carga y posibles errores.

- **LinkButton.tsx**  
  Componente reutilizable para renderizar botones de enlace estilizados, utilizado para acceder a los sorteos o realizar acciones relacionadas.

- **LoadingSpinner.tsx**  
  Indicador visual de carga, mostrado mientras se obtienen los datos de los sorteos.

### Hooks personalizados (`src/hooks/`)

- **useGiveawayTimer.ts**  
  Hook que gestiona la lógica del temporizador para cada sorteo, obtiene el temporizador, calcula el tiempo restante y actualiza el temporizador.

- **useFetchGiveaways.ts**  
  Encapsula la lógica para obtener los datos de los sorteos desde la API, manejando estados de carga y error.

### Utilidades (`src/utils/`)

- **scrapeGiveaway.ts**  
  Función encargada de extraer (scrapear) la información relevante de los sorteos directamente desde la página de Instant Gaming, utilizando `axios` y `cheerio`.

- **dateUtils.ts**  
  Utilidades para formatear y manipular fechas y horas, especialmente para mostrar correctamente el tiempo restante en los temporizadores.

### Datos (`src/data/`)

- **instantGamingLinks.ts**  
  Archivo que contiene los enlaces de los sorteos actuales de Instant Gaming.

### Estilos (`src/styles/`)

- Archivos CSS para personalizar la apariencia de los componentes y la disposición general de la aplicación.

### Páginas y API (`src/pages/`)

- **index.tsx**  
  Página principal que integra todos los componentes y muestra la interfaz al usuario.

- **api/giveaway-timer/[giveawayId].ts**  
  Endpoint de API que provee información actualizada sobre el temporizador de cada sorteo, consultado por los hooks y componentes.

---

## ¿Cómo funciona?

1. Al cargar la página, se obtienen los enlaces de los sorteos activos.
2. Por cada sorteo, se consulta el endpoint de temporizador para mostrar el tiempo restante.
3. Los usuarios pueden hacer clic en los enlaces para acceder directamente al sorteo correspondiente en Instant Gaming.
4. El temporizador se actualiza en tiempo real para reflejar el tiempo exacto hasta el final de cada sorteo.

---

## Licencia

Este proyecto está bajo la Licencia MIT.

**¿Qué significa esto?**  
Puedes usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, siempre que incluyas el aviso de copyright y la licencia original.  
El software se proporciona "tal cual", sin garantías de ningún tipo.

---
