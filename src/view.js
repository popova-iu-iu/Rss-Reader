const renderText = (elements, i18next) => {
  const {
    button, readMore, close, headline, subtitle, placeholder, example,
  } = elements;

  headline.textContent = i18next.t('headline');
  subtitle.textContent = i18next.t('subtitle');
  placeholder.textContent = i18next.t('placeholder');
  example.textContent = i18next.t('example');
  button.textContent = i18next.t('button');
  readMore.textContent = i18next.t('readMore');
  close.textContent = i18next.t('close');
};

export const renderMessage = (elements, i18next, message) => {
  const { status } = elements;
  status.textContent = i18next.t(`messages.${message}`);
};

const renderVisitedPost = (visitedPostId) => {
  visitedPostId.forEach((id) => {
    const link = document.querySelector(`[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const renderFeeds = (elements, feeds, i18next) => {
  elements.feeds.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t('feeds');

  const listContainer = document.createElement('ul');
  listContainer.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    listItem.append(title);
    listItem.append(description);
    listContainer.append(listItem);
  });

  card.append(cardTitle);
  card.append(cardBody);
  card.append(listContainer);
  elements.feeds.append(card);
};

const renderPosts = (elements, posts, i18next) => {
  elements.posts.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t('posts');
  card.append(cardTitle);
  card.append(cardBody);

  const listContainer = document.createElement('ul');
  listContainer.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const { id, title } = post;

    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.textContent = title;
    a.classList.add('fw-bold');
    a.dataset.id = id;
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18next.t('postButton');
    button.setAttribute('type', 'button');

    listItem.append(a);
    listItem.append(button);
    listContainer.append(listItem);
  });

  card.append(cardTitle);
  card.append(cardBody);
  card.append(listContainer);
  elements.posts.append(card);
};

const changeLng = (state, elements, value, i18next) => {
  const {
    feeds, posts, ui, form,
  } = state;
  const view = ui.visitedPostsId;
  const lngBtns = document.querySelectorAll('.lngBtn');
  lngBtns.forEach((btn) => {
    btn.classList.remove('active');
    const activeBtn = document.querySelector(`[data-lng="${value}"]`);
    activeBtn.classList.add('active');
    i18next.changeLanguage(value);
    renderText(elements, i18next);
    if (form.status) {
      renderMessage(elements, i18next, state.form.status);
    }
    if (state.feeds.length > 0) {
      renderFeeds(elements, feeds, i18next);
      renderPosts(elements, posts, i18next);
      renderVisitedPost(view);
    }
  });
};

const renderModal = (elements, posts) => {
  const { title, description, link } = posts;
  elements.modalTitle.innerHTML = title;
  elements.modalBody.innerHTML = description;
  elements.modalLink.setAttribute('href', link);
};

const processHandler = (state, elements, process) => {
  const {
    form, input, status, button,
  } = elements;

  switch (process) {
    case 'sending':
      status.classList.remove('text-danger');
      status.classList.remove('text-success');
      status.classList.add('text-warning');
      button.disabled = true;
      break;

    case 'success':
      status.textContent = null;
      status.classList.remove('text-danger');
      status.classList.remove('text-warning');
      status.classList.add('text-success');
      button.disabled = false;
      form.reset();
      input.focus();
      break;

    case 'error':
      status.textContent = null;
      status.classList.remove('text-saccess');
      status.classList.remove('text-warning');
      status.classList.add('text-danger');
      button.disabled = false;
      break;

    default:
      break;
  }
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'form.processState':
      processHandler(state, elements, value);
      break;

    case 'form.status':
      renderMessage(elements, i18next, value);
      break;

    case 'feeds':
      renderFeeds(elements, value, i18next);
      break;
    case 'posts':
      renderPosts(elements, value, i18next);
      break;

    case 'ui.lng':
      changeLng(state, elements, value, i18next);
      break;

    case 'ui.modal':
      renderModal(elements, value);
      break;

    case 'ui.visitedPostsId':
      renderVisitedPost(value);
      break;

    default:
      break;
  }
};

export default render;
