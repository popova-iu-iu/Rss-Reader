import _ from 'lodash';

export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const parserError = doc.querySelector('parsererror');

  if (parserError) {
    throw Error('rss');
  }

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const link = doc.querySelector('link');
  const feed = {
    title, description, link,
  };

  const items = [...doc.querySelectorAll('item')];
  const posts = items.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;

    return {
      title: itemTitle, description: itemDescription, link: itemLink,
    };
  });

  return { feed, posts };
};
