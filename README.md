# Dalwadi Jaimin — Portfolio V2

A premium, accessible portfolio for Dalwadi Jaimin, built with plain HTML, CSS, and JavaScript. No build system, package installation or framework required.

## Features

- Responsive, editorial dark/light interface with saved theme preference
- Scroll indicator, subtle motion with reduced-motion support
- Project filters and accessible project detail dialogs
- Quick navigation / command palette (`Ctrl+K` or `⌘K`)
- Accessible mobile navigation, skip link, keyboard focus styling
- Copy-to-clipboard email action and email-client contact form
- SEO / OpenGraph metadata, SVG favicon and cover image
- Ready for Vercel static deployment

## Run locally

From this folder, run:

```bash
python -m http.server 8000
```

Visit http://localhost:8000. Alternatively, open `index.html` in a browser; serving locally is preferable for testing routing and assets.

## Deploy to GitHub and Vercel

1. Create a new GitHub repository, such as `jaimin-portfolio-v2`.
2. In this folder, run:

```bash
git init
git add .
git commit -m "Launch Jaimin portfolio v2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jaimin-portfolio-v2.git
git push -u origin main
```

3. Open [Vercel New Project](https://vercel.com/new), import the repository, select **Other** as the framework preset, leave the build command empty, and set output directory to `.` if prompted.
4. Deploy. Vercel will provide an actual `.vercel.app` domain when deployment finishes.

You can also deploy with `npx vercel --prod` after logging in with Vercel CLI.

## Customize

- Edit the name, email and GitHub links in `index.html` and `script.js`.
- Replace the sample concept project cards with your verified real work when available.
- The project dialog copy lives in `projectData` in `script.js`.
- Edit the CSS variables at the top of `styles.css` to change colors.
- If you have a real CV, add it to the project and link it from the page. No placeholder download links have been added.

## Important

**Project integrity:** Only the portfolio itself is presented as built. The e-commerce and AI workspace cards are explicitly visual concepts, not deployed products or client work. Skill entries reflect the technologies mentioned in the original uploaded site and are not certifications. The contact form uses `mailto:` and does **not** send through a backend or collect messages. No site has been published to GitHub or Vercel as part of this package.
