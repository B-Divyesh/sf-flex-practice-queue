# Demo sandbox

- URL: `https://flex-practice-queue.sociobot.in/?demo=1` or `https://flex-practice-queue.sociobot.in/demo` (local: `http://127.0.0.1:4173/?demo=1`). Both open the same isolated workspace.
- Sample: eight prompts across science, language, maths, civics, economics, and programming. They use the `warm-up`, `weak`, and `today` tags.
- Preview: **Start this sample round** always opens the same three prompts. It begins with **Explain why seasons occur.** **Start mixed round** shuffles separately.
- Try: filter by a tag, choose a prompt count and timer, run a round, import or export CSV, and save a named round plan.
- Reset: choose **Reset demo** in the persistent banner. **Start for real** deletes demo data before opening the real workspace.
- Isolation: demo prompts and rounds use IndexedDB database `demo:flex-practice-queue`. Demo plans use `demo:fpq:plans`. A `demo:fpq:seeded` flag keeps intentional empty states after reload. The demo never reads or writes the real database or `fpq:plans` key. Reset and Start for real delete every demo key and database before returning to the real workspace.
- Offline: open the demo once, wait for the page to load, then disconnect and reload it. The sample is bundled with the app.
