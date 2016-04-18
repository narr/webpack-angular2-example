describe('App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    const subject = browser.getTitle();
    const result = 'Wepack-Angular2-Example';
    expect(subject).toEqual(result);
  });

  it('should have <header>', () => {
    const subject = element(by.css('my-app header')).isPresent();
    const result = true;
    expect(subject).toEqual(result);
  });

  it('should have <main>', () => {
    const subject = element(by.css('my-app main')).isPresent();
    const result = true;
    expect(subject).toEqual(result);
  });

  it('should have <footer>', done => {
    element(by.css('my-app footer img')).getAttribute('src').then(attr => {
      const subject = attr;
      const match = /angularclass-avatar\.png/;
      expect(subject).toMatch(match);
      done();
    });
  });
});
