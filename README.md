
  # instant-gaming-sweepstakes

Is a web application that collects and displays links to weekly or monthly giveaways for any video game or item available on the Instant Gaming store. The goal is to provide users with a simple and centralized way to discover and access these giveaways.

---

## Main Features

- **Up-to-date list** of active giveaways from Instant Gaming.
- **Countdown timer** showing the remaining time for each giveaway.
- **Modern and responsive interface** for an optimal user experience.

---

## Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/Ezequiel-Morena/instant-gaming-sweepstakes.git
   cd instant-gaming-sweepstakes
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```

---

## Project Structure

The source code is located in the `src` folder. Below is a description of the purpose of each main component, hook, and utility:

### Components (`src/components/`)

- **LinkList.tsx**  
  Displays the list of active giveaways, fetching link data and rendering each one as an interactive item. Manages loading states and possible errors.

- **LinkButton.tsx**  
  Reusable component to render styled link buttons, used to access giveaways or trigger related actions.

- **LoadingSpinner.tsx**  
  Visual loading indicator, shown while giveaway data is being fetched.

### Custom Hooks (`src/hooks/`)

- **useGiveawayTimer.ts**  
  Manages the timer logic for each giveaway, calculates the remaining time, and updates the timer.

- **useFetchGiveaways.ts**  
  Encapsulates the logic for fetching giveaway data from the API, handling loading and error states.

- **useCountdown.ts**
  Custom hook that manages countdown logic, returning the remaining time in a format easily consumable by components. Useful for displaying real-time timers.

- **useTextTruncation.ts**
  Hook for intelligently truncating long text, adding ellipses if the content exceeds a character limit. Ideal for keeping the UI clean and preventing text overflow.

- **useGiveawayItems.ts**
  Encapsulates the logic for retrieving and managing the list of giveaway items, making it easier to reuse and separate concerns in components that display the giveaways.

### Utilities (`src/utils/`)

- **scrapeGiveaway.ts**  
  Function responsible for scraping relevant giveaway information directly from the Instant Gaming website using `axios` and `cheerio`.

- **dateUtils.ts**  
  Utilities for formatting and handling dates and times, especially to display countdowns correctly.

### Data (`src/data/`)

- **instantGamingLinks.ts**  
  File containing the current giveaway links from Instant Gaming.

### Styles (`src/styles/`)

- CSS files to customize the appearance of components and the overall layout of the application.

### Pages and API (`src/pages/`)

- **index.astro**  
  Main page that integrates all components and displays the user interface.

- **api/giveaway-timer/[giveawayId].ts**  
  API endpoint that provides updated countdown information for each giveaway, queried by the hooks and components.

---

## How It Works

1. When the page loads, it fetches the active giveaway links.
2. For each giveaway, it queries the countdown endpoint to display the time remaining.
3. Users can click on the links to directly access the corresponding giveaway on Instant Gaming.
4. The timer updates in real time to reflect the exact time left until the end of each giveaway.   
