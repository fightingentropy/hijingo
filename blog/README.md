# Hijingo Blog System

This is a static blog system that uses Markdown files for content and generates a JSON file for the website.

## How it Works

1. Blog posts are written as Markdown (.md) files in the `posts/` directory
2. Each post must have front matter at the top:
   ```markdown
   ---
   title: Your Post Title
   date: 2023-12-24
   ---
   
   Your content here...
   ```
3. The build script (`build.js`) converts these Markdown files into `posts.json`
4. The website loads posts from `posts.json`

## Writing a New Post

1. Create a new .md file in the `posts/` directory, e.g., `my-new-post.md`
2. Add front matter at the top:
   ```markdown
   ---
   title: My New Post
   date: 2023-12-24
   ---

   # My New Post

   Write your content here using Markdown.
   ```
3. Run the build script:
   ```bash
   npm run build
   ```
4. The post will appear on the blog

## File Structure

```
blog/
├── posts/           # Your Markdown blog posts
│   ├── post1.md
│   ├── post2.md
│   └── posts.json   # Generated file (git ignored)
├── build.js         # Build script
├── index.html       # Blog homepage
├── script.js        # Blog functionality
├── styles.css       # Blog styles
└── package.json     # NPM configuration
```

## Important Notes

- `posts.json` is generated automatically - don't edit it manually
- Always run `npm run build` after adding or editing posts
- The build script must be run before deploying to GitHub Pages
- Posts are sorted by date (newest first)
- Filenames are used as post IDs, so use URL-friendly names (e.g., `my-first-post.md`)

## Example Post Format

```markdown
---
title: My First Blog Post
date: 2023-12-24
---

# My First Blog Post

This is a paragraph of text.

## Subheading

- You can use all Markdown features
- Like lists
- And **bold** or *italic* text

### Code Blocks

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
```
