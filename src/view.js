const feedsContainer = document.querySelector(".feeds");
const postsContainer = document.querySelector(".posts");

const templateFeed = document.querySelector("#template-feeds-wrapper");
const templateFeedElement = document.querySelector("#template-feed-element");
const templatePost = document.querySelector("#template-posts-wrapper");
const templatePostElement = document.querySelector("#template-post-element");

const getModal = (id, link) => {
  const modal = document.querySelector(".modal");
  modal.setAttribute('id', id);
  const title = modal.querySelector(".modal-title");
  const body = modal.querySelector(".modal-body");
  const modalButton = modal.querySelector('a');
  modalButton.href = link;
  return {
    title,
    body
  };
};


const createFeed = (feed) => {
  const { title, description } = feed;
  const feedElement = templateFeedElement.content.cloneNode(true);
  feedElement.querySelector(".feed-title").textContent = title;
  feedElement.querySelector(".feed-description").textContent = description;
  return feedElement;
};

const createPost = (post) => {
  const { id, title, description, link } = post;
  const postElement = templatePostElement.content.cloneNode(true);
  const linkEl = postElement.querySelector("a");
  const buttonEl = postElement.querySelector("button");

  linkEl.textContent = title;
  linkEl.href = link;
  linkEl.setAttribute('data-id', id);

  // buttonEl.addEventListener("click", () => {
  //   const modal = getModal(id, link);
  //   modal.title.textContent = title;
  //   modal.body.textContent = description;
  // });
  
  return postElement;
};

const renderFeeds = (feeds) => {
  feedsContainer.innerHTML = "";
  const feedWrapper = templateFeed.content.cloneNode(true);
  const feedList = feedWrapper.querySelector("ul");
  const feedsElements = feeds.map(createFeed);
  feedList.append(...feedsElements);
  feedsContainer.append(feedWrapper);
};

const renderPosts = (posts) => {
  postsContainer.innerHTML = "";
  const postsWrapper = templatePost.content.cloneNode(true);
  const postList = postsWrapper.querySelector("ul");
  const postsElements = posts.map(createPost);
  postList.append(...postsElements);
  postsContainer.append(postsWrapper);
};

const renderVisistedPosts = (visitedPostsId) => {
  visitedPostsId.forEach((id) => {
    const a = document.querySelector(`a[data-id="${id}"]`);
    a.classList.remove('fw-bold');
    a.classList.add('fw-normal', 'link-secondary');
  })
} 








export const renderMessage = (elements, i18next, message) => {
  const { feedback } = elements;
  feedback.textContent = i18next.t(`messages.${message}`);  
};

export const renderText = (elements, i18next) => {
  const { form, button } = elements;
  const headline =  document.querySelector('.display-3 ');
  headline.textContent = i18next.t(`headline`); 
  const subtitle = document.querySelector('.lead');
  subtitle.textContent = i18next.t(`subtitle`); 
  const placeholder = form.querySelector('[for="url-input"]');
  placeholder.textContent = i18next.t(`placeholder`);  
  const example = document.querySelector('.example');
  example.textContent = i18next.t(`example`); 
  button.textContent = i18next.t(`button`); 
};

const proccessHandler = (elements, process) => {
  const { form, input, feedback, button } = elements;
  switch (process) {
    case 'filling':
      input.focus();
      button.disabled = false;
      break;
    case 'sending':
      input.focus();
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-warning')
      button.disabled = true;
      break;
    case 'success':   
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-warning');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      button.disabled = false;
      form.reset();
      input.focus();
      break;
    case 'error':
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      button.disabled = false;
      break;        
    default:      
      break;
  }
};

export default (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'process':
      console.log(state)
      proccessHandler(elements, value,);
      break;
    case 'messages':
      renderMessage(elements, i18next, value,);
      break;
    case "feeds":
      renderFeeds(value);
      break;
    case "posts":
      renderPosts(value);
      break;
    case 'ui.modal':
      // renderModal;
      break;
    case "visitedPostsId": 
      renderVisistedPosts(value);
      break;
    default:
      break;
  }
};
