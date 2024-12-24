---
title: Getting Started with Markdown Blogging
date: 2023-12-24
---

# Writing Blog Posts in Markdown

Welcome to our blog system! This post will show you how to write beautiful blog posts using Markdown.

## Why Markdown?

Markdown makes it easy to write formatted content without dealing with HTML. Here are some examples:

### Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also add `inline code` like this.

### Lists

Here's how to create lists:

1. First item
2. Second item
   - Sub-item 1
   - Sub-item 2
3. Third item

### Code Blocks

```javascript
// You can add syntax-highlighted code
function greet(name) {
    console.log(`Hello, ${name}!`);
}
```

### Links and Images

You can add [links](https://hijingo.uk) and images:

![Alt text](image-url.jpg)

## Publishing Your Post

After writing your post:

1. Save it as a .md file in the `posts` directory
2. Run `npm run build` to update posts.json
3. Commit your .md file
4. Deploy your site

That's it! Your post will appear on the blog, sorted by date.
