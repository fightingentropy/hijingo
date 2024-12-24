class Blog {
    constructor() {
        this.posts = [];
        this.baseUrl = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
            ? 'posts/'  // Local development
            : '/blog/posts/';  // Production at hijingo.uk
        this.loadPosts();
        this.setupEventListeners();
    }

    parseFrontMatter(content) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) return { data: {}, content };
        
        const [, frontMatter, markdown] = match;
        const data = {};
        
        frontMatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
                data[key.trim()] = values.join(':').trim();
            }
        });
        
        return { data, content: markdown.trim() };
    }

    async loadPosts() {
        try {
            const posts = [
                'digital-minimalism.md',
                'web-development-trends.md',
                'side-projects.md'
            ];

            const postPromises = posts.map(async filename => {
                try {
                    const response = await fetch(`${this.baseUrl}${filename}`);
                    if (!response.ok) {
                        console.error(`Failed to load ${filename}:`, response.status, response.statusText);
                        throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
                    }
                    const content = await response.text();
                    const { data, content: markdown } = this.parseFrontMatter(content);
                    return {
                        id: filename,
                        content: markdown,
                        ...data
                    };
                } catch (error) {
                    console.error(`Error loading ${filename}:`, error);
                    throw error;
                }
            });

            this.posts = await Promise.all(postPromises);
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.renderPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('new-post-btn')?.addEventListener('click', () => this.showPostEditor());
        document.getElementById('post-form')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showPostsList());
        });
    }

    showPostEditor() {
        document.querySelector('.post-editor').classList.add('active');
        document.querySelector('.blog-list').classList.remove('active');
        document.querySelector('.post-view').classList.remove('active');
    }

    showPostsList() {
        document.querySelector('.post-editor').classList.remove('active');
        document.querySelector('.blog-list').classList.add('active');
        document.querySelector('.post-view').classList.remove('active');
    }

    showPost(post) {
        const postView = document.querySelector('.post-view');
        postView.querySelector('h2').textContent = post.title;
        postView.querySelector('.date').textContent = this.formatDate(post.date);
        postView.querySelector('.content').innerHTML = marked.parse(post.content);
        
        document.querySelector('.post-editor').classList.remove('active');
        document.querySelector('.blog-list').classList.remove('active');
        postView.classList.add('active');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            ordinal: true
        }).replace(/(\d+)(?=(,|\s))/, (match) => {
            const day = parseInt(match);
            const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || day / 10 == 1) ? 0 : day % 10];
            return day + suffix;
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        
        const newPost = {
            id: `post-${Date.now()}.md`,
            title,
            content,
            date: new Date().toISOString().split('T')[0]
        };

        this.posts.unshift(newPost);
        this.renderPosts();
        this.showPostsList();
        
        // Reset form
        e.target.reset();
    }

    renderPosts() {
        const blogList = document.querySelector('.blog-list');
        blogList.innerHTML = '';
        
        if (this.posts.length === 0) {
            blogList.innerHTML = '<p>No posts yet. Create your first post!</p>';
            return;
        }

        this.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            const preview = post.content.split('\n')[0]; // First paragraph as preview
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p class="date">${this.formatDate(post.date)}</p>
                <p>${preview}</p>
            `;
            postElement.addEventListener('click', () => this.showPost(post));
            blogList.appendChild(postElement);
        });
    }
}

// Initialize the blog when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Blog();
});
