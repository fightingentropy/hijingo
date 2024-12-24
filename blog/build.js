const fs = require('fs').promises;
const path = require('path');

async function buildBlog() {
    try {
        // Read all files in the markdown directory
        const markdownDir = path.join(__dirname, 'posts', 'markdown');
        const files = await fs.readdir(markdownDir);
        
        // Filter for markdown files
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        // Read and process each markdown file
        const posts = await Promise.all(mdFiles.map(async filename => {
            const content = await fs.readFile(path.join(markdownDir, filename), 'utf-8');
            
            // Parse front matter
            const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
            const match = content.match(frontMatterRegex);
            
            if (!match) {
                console.warn(`Warning: No front matter found in ${filename}`);
                return null;
            }
            
            const [, frontMatter, markdown] = match;
            const data = {};
            
            // Parse front matter into data object
            frontMatter.split('\n').forEach(line => {
                const [key, ...values] = line.split(':');
                if (key && values.length) {
                    data[key.trim()] = values.join(':').trim();
                }
            });
            
            // Generate post ID from filename
            const id = path.basename(filename, '.md');
            
            return {
                id,
                title: data.title || id,
                date: data.date || new Date().toISOString().split('T')[0],
                content: content
            };
        }));
        
        // Filter out any null posts and sort by date
        const validPosts = posts
            .filter(post => post !== null)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Write to posts.json
        await fs.writeFile(
            path.join(__dirname, 'posts', 'posts.json'),
            JSON.stringify({ posts: validPosts }, null, 2)
        );
        
        console.log(`✅ Successfully built posts.json with ${validPosts.length} posts`);
        
    } catch (error) {
        console.error('❌ Error building blog:', error);
        process.exit(1);
    }
}

buildBlog();
