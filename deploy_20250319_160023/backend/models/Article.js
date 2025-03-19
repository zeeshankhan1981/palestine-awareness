// Placeholder for Article model
class Article {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.source = data.source;
    this.url = data.url;
    this.publishedAt = data.publishedAt;
    this.hash = data.hash;
    this.verified = data.verified;
    this.content = data.content;
  }

  static findAll() {
    // Placeholder for database query
    return Promise.resolve([
      { 
        id: 1, 
        title: 'Sample Article', 
        source: 'Example News',
        url: 'https://example.com/article',
        publishedAt: new Date().toISOString(),
        hash: '0x123456789abcdef',
        verified: true
      }
    ]);
  }
}

module.exports = Article;
