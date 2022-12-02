import * as yup from 'yup';
import onChange from 'on-change';
import render, { renderText, elements } from './view.js';
import i18n from 'i18next';
import resources from './locales/index.js';

// const messages = {
//   url: 'Ссылка должна быть валидным URL',
//   notOneOf: 'RSS уже существует',
//   success: 'RSS успешно загружен',
// };

const validate = (url, urls) => yup.string().required().url()
  .notOneOf(urls)
  .validate(url);

export default () => {
  const state = {
    lng: 'en',
    process: 'filling',
    urls: [],
    feedbackText: null,
  };

  const i18next = i18n.createInstance();
  i18next.init({
    lng: state.lng,
    debug: false,
    resources,
  })   
  renderText(elements, i18next);

  const watchedState = onChange(state, render(elements, i18next));

  elements.form.addEventListener('submit', ((event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const { urls } = state;

    validate(url, urls)
      .then((url) => {
        watchedState.process = 'success';
        watchedState.feedbackText = 'success';
        watchedState.urls.push(url);
        
      })
      .catch((err) => {
        watchedState.process = 'error';
        watchedState.feedbackText = err.type;        
      });
  })); 
};
