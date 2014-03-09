describe('Primary Keys', function() {
  it('adds the id key by default', function() {
    expect(Post.primaryKey).toEqual('id');
  });

  it('allows the primary key to be overridden', function() {
    Post.primaryKey = '_id';
    expect(Post.primaryKey).toEqual('_id');
  });

  it('adds the primary key to instances', function() {
    post = Post.new({});
    expect(post.primaryKey).toEqual('id');
  });

  it('adds class-specific primary keys to instances', function() { 
    Post.primaryKey = '_id';
    post = Post.new({});
    expect(post.primaryKey).toEqual('_id');
  });
});
