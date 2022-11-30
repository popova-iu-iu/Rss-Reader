import * as yup from 'yup';
import onChange from 'on-change';
import render, { elements } from './view.js';

const validate = (url, urls) => yup.string().required().url()
  .notOneOf(urls)
  .validate(url);

export default () => {
  const state = {
    process: 'filling',
    urls: [],
    feedbackText: null,
  };

  const watchedState = onChange(state, render(elements));

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
