# Focus & Site Blocker (Chrome Extension)

#### Author: Onur Karatas
#### Video Demo: <BURAYA_YOUTUBE_LINKINI_YAPISTIR>

#### Description:
Focus & Site Blocker is a productivity-oriented browser extension built with Chrome Manifest V3. Designed to minimize digital distractions and maintain deep work sessions, it combines an automated Pomodoro-style interval timer with real-time website blocking capabilities.

During an active focus session, the extension communicates with the background service worker to block access to user-defined domains (such as social media platforms, entertainment websites, or streaming portals). If an active session is in progress, any attempt to visit or navigate restricted websites immediately redirects the user to a custom blocked page. When the timer is paused or reset, access to those websites is immediately restored without requiring page reloads or browser restarts.

#### Core Architecture & File Structure:

* **manifest.json**: Configures the extension metadata, declares necessary permissions (`storage`, `declarativeNetRequest`, `tabs`), and registers the background service worker and popup action menu under the Manifest V3 standard.
* **background.js**: Acts as the persistent service worker. It listens for runtime messages triggered by timer state updates, creates dynamic blocking rules using `chrome.declarativeNetRequest`, and queries active tabs to redirect currently open blacklisted websites.
* **popup.html**: Defines the visual layout of the extension popup. It includes the live countdown timer display, control buttons (Start/Pause, Reset), a domain input form, and the dynamic list of blocked domains.
* **popup.js**: Manages user interaction and timing logic. It coordinates the countdown, handles input normalization (extracting clean domain names), synchronizes state with `chrome.storage.local`, and dispatches messages to the background script.
* **style.css**: Provides modern dark-themed aesthetics utilizing flexbox, consistent typography, custom scrollbars, and interactive button states.
* **blocked.html**: A minimalist notification page served locally whenever a user navigates to a restricted website during a running focus session.

#### Installation & Setup:
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" via the top-right toggle switch.
3. Click "Load unpacked" and select the project directory containing this repository.
4. Pin the extension to your toolbar, open the popup, customize your blocked websites, and hit "Start".

#### Design Choices & Technical Challenges:
* **Manifest V3 DeclarativeNetRequest**: Instead of legacy, performance-heavy webRequest blocking APIs, declarative rules were implemented for native, browser-level request filtering.
* **Session Persistence**: Because extension popups completely unload when closed, timestamp diffing logic was implemented using `chrome.storage.local` to calculate true elapsed time across sessions without losing timer accuracy.

#### Author & Acknowledgments:
Developed by Onur Karatas for CS50x 2026. AI tools were utilized as learning assistants for debugging Manifest V3 API transitions and CSS styling principles.
