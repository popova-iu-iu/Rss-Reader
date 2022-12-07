import _ from 'lodash';

export default (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const parserError = doc.querySelector('parsererror');

    if (parserError) {
        throw new Error('rss')
    };
    
    const feedId = _.uniqueId();
    const title= doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const feed = { feedId, title, description };

    const items = [...doc.querySelectorAll('item')];    
    const posts = items.map((item) => {
        const itemId = _.uniqueId();
        const itemTitle  = item.querySelector('title').textContent;
        const itemDescription =  item.querySelector('description').textContent;
        const itemLink = item.querySelector('link').textContent;

        return { id: itemId, feedId, title: itemTitle, description: itemDescription, link: itemLink}
    });

    return { feed, posts }
  };