# Hijingo
haha

## https://hijingo.uk

## Blog

### Writing Blog Posts

1. Create a new Markdown file in `blog/posts/markdown/` directory
2. Add front matter at the top of your file:
   ```markdown
   ---
   title: Your Post Title
   date: YYYY-MM-DD
   ---
   ```
3. Write your blog post content in Markdown format below the front matter

### Building the Blog

To update the blog after adding or modifying posts:

1. Navigate to the blog directory:
   ```bash
   cd blog
   ```

2. Run the build script:
   ```bash
   npm run build
   ```

This will:
- Process all Markdown files in `posts/markdown/`
- Generate `posts.json` with your blog content
- Display a success message with the number of processed posts

The blog will automatically display your new or updated posts after building.
