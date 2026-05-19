# Locker Toggle Algorithm Visualizer

A browser-based educational visualizer for the classic locker toggle puzzle. The page compares two approaches side by side:

- **Brute Force**: simulates every pass across every locker and toggles doors according to the puzzle rules.
- **Decrease and Conquer**: skips the full simulation and directly identifies the locker positions that remain open, which are the perfect squares.

The goal of the project is to help students understand the logic behind the puzzle, compare algorithmic strategies, and see the final state of the lockers in an interactive way.

## Problem Statement

There are `n` lockers in a hallway, numbered from `1` to `n`. Initially, all locker doors are closed.

You make `n` passes by the lockers. On pass `i`, you toggle every `i`th locker:

- If the door is closed, you open it.
- If the door is open, you close it.

After all passes are complete, only the lockers at perfect-square positions remain open.

Examples for `n = 16`:

- Open lockers: `1, 4, 9, 16`
- Number of open lockers: `4`

## Algorithms Demonstrated

### 1. Brute Force

This version follows the literal puzzle procedure.

Pseudo behavior:

- Start with all lockers closed.
- For each pass `i` from `1` to `n`:
  - Toggle every `i`th locker.
- Count the lockers that remain open.

This approach is useful for showing how the puzzle works step by step, but it is not the most efficient way to solve the final question.

### 2. Decrease and Conquer

This version uses the number theory observation that only perfect squares remain open.

Key idea:

- A locker ends up open if it is toggled an odd number of times.
- The number of toggles equals the number of divisors of the locker number.
- Most numbers have divisors in pairs.
- Perfect squares have one unpaired divisor, so they are toggled an odd number of times.

Therefore, the open lockers are exactly the lockers at positions:

- `1^2, 2^2, 3^2, ...` up to `n`

This makes the problem much faster to solve and easier to explain mathematically.

## Features

- Side-by-side comparison of both approaches
- Adjustable locker count `n`
- Adjustable animation speed
- Animated locker states:
  - closed
  - open
  - just toggled
- Pass/step counters and progress bars
- Final result banner showing open locker positions
- Complexity summary for both algorithms
- Responsive layout for smaller screens

## Project Structure

```text
Locker-Toggle-Algorithm-Visualizer/
+-- index.html
+-- styles.css
+-- script.js
+-- README.md
```

### File Roles

- `index.html`: page structure and game layout
- `styles.css`: all visual styling, colors, layout, and transitions
- `script.js`: the animation logic and algorithm behavior
- `README.md`: project documentation

## Requirements

### Minimum Requirements

- A modern web browser such as:
  - Google Chrome
  - Microsoft Edge
  - Mozilla Firefox
  - Safari
- JavaScript enabled in the browser
- No build tools are required
- No package installation is required

### Optional Requirement for Icons

The HTML uses icon class names such as `ti ti-player-play` and `ti ti-refresh`.

If those icons do not appear in your browser, add the Tabler Icons stylesheet or replace the icon elements with plain text or your own icon set.

## How to Run

### Option 1: Open Directly

1. Open the project folder.
2. Double-click `index.html`.
3. The game should open in your browser.

### Option 2: Use a Local Server

If you prefer to serve the page locally, use any simple static server, such as the Live Server extension in Visual Studio Code.

This is optional, but it can be helpful if you want a smoother development workflow.

## How to Use the Visualizer

- Use the **Lockers (n)** slider to choose the number of lockers.
- Use the **Speed** slider to adjust animation speed.
- Click **Run both** to animate both algorithms.
- Click **Step** to advance the algorithms one step at a time.
- Click **Reset** to restart the visualizer with the current `n` value.

## What the Counters Mean

### Brute Force Panel

- **Pass**: the current pass number being simulated
- **Toggles**: how many locker toggles have occurred in total
- **Open**: how many lockers are currently open

### Decrease and Conquer Panel

- **Step (l)**: the current integer being tested, where the algorithm checks `l^2`
- **Checks**: how many perfect-square positions have been tested
- **Open**: how many lockers have been opened so far

## Complexity Summary

### Brute Force

- Time: `Theta(n log n)` in the current display
- Space: `Theta(n)`

### Decrease and Conquer

- Time: `Theta(sqrt(n))`
- Space: `Theta(sqrt(n))`

## Notes for Instructors or Presenters

- This project is well suited for classroom demonstrations of algorithm design.
- The side-by-side view helps students compare a direct simulation with a mathematical shortcut.
- The final result makes the perfect-square pattern visually obvious.

## Known Implementation Notes

- The current version is a front-end only project.
- The behavior is controlled entirely in `script.js`.
- If you change element IDs in `index.html`, make sure the same IDs are updated in `script.js`.
- If you modify the number of lockers allowed by the slider, make sure the locker rendering logic still fits the layout on smaller screens.

## Future Improvements

Possible enhancements for later versions:

- add sound effects for toggles and completion
- highlight the current pass more clearly
- show a live explanation of why each locker changes state
- add a theory panel explaining divisor pairing
- add a toggle for showing or hiding complexity notes
- connect the icons to a reliable icon CDN or embed local icons

## License

If you plan to share this project publicly, add your preferred license here.

## Author

Add your name, class, or institution here if you want the project to be submitted or shared formally.
