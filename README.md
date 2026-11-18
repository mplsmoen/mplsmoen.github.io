# mplsmoen.github.io
 
A collection of simple, standalone HTML apps, hosted for free with GitHub Pages at **https://mplsmoen.github.io/**. No build step or server needed: each project is just HTML (plus CSS and JavaScript) that runs in the browser.
 
## Projects
 
| Project | Description | Live Link |
|---|---|---|
| [Minnesota Sports Dashboard](./mn-sports-dashboard/) | A dashboard for following Minnesota sports teams: scores, schedules, and standings in one place. | [View live](https://mplsmoen.github.io/mn-sports-dashboard/) |
 
## Minnesota Sports Dashboard
 
A single-page dashboard for keeping up with Minnesota pro teams.
 
### Features
 
- Scores and schedules for Minnesota teams
- Standings at a glance
- Works on desktop and mobile
- Runs entirely in the browser, no install required
### Run it locally
 
1. Clone the repo
```bash
git clone https://github.com/mplsmoen/mplsmoen.github.io.git
```
 
2. Open `mn-sports-dashboard/index.html` in your browser. That's it.
## Repository Structure
 
```text
mplsmoen.github.io/
├── README.md
├── index.html                 (optional landing page linking to all projects)
└── mn-sports-dashboard/
    └── index.html
```
 
Each new project gets its own folder with an `index.html` inside.
 
## Hosting with GitHub Pages
 
Because this repo is named `mplsmoen.github.io`, it is a GitHub user site, and everything on the `main` branch is served from the root of https://mplsmoen.github.io/.
 
1. Push your files to the `main` branch.
2. In the repo, go to **Settings → Pages** and confirm **Source** is **Deploy from a branch**, with the `main` branch and `/ (root)` folder selected.
3. After a minute or two, your changes are live.
Each project folder gets its own URL:
 
```text
https://mplsmoen.github.io/mn-sports-dashboard/
```
 
## Adding a New Project
 
1. Create a new folder, such as `my-new-project/`.
2. Add an `index.html` inside it.
3. Add a row to the Projects table above.
4. Commit and push. GitHub Pages updates automatically.
## License
 
Distributed under the MIT License. See `LICENSE` for details.
 
