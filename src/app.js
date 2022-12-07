import * as yup from 'yup';
import onChange from 'on-change';
import render, { renderText } from './view.js';
import i18n from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';
import parser from './parser.js';
import _ from 'lodash';

const validate = (url, urls) => yup.string().required().url('mustBeValid').notOneOf(urls, 'linkExists').validate(url);

const addFeed = (url, data, state) => {
  state.urls.push(url);
  state.feeds.push(data.feed);
  state.posts.unshift(...data.posts);
}

const formHandler = (e, watchedState) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  validate(url, watchedState.urls)
    .then((link) => {
      // watchedState.urls.push(link) 
      watchedState.process = 'sending';
      watchedState.messages = 'loading'; 
      return axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
      
    })
    .then((response) => {            
      const data = parser(response.data.contents);  
      addFeed(url, data, watchedState);
      watchedState.process = 'success';
      watchedState.messages = 'success';       
    })
    .catch((err) => {
      watchedState.process = 'error';
      watchedState.messages = err.message; 
      console.log(watchedState.messages)       
    });
}

const defaulltLng = 'ru';

export default () => {
  const state = {
    process: 'filling',
    messages: null,
    urls: [],
    feeds: [],
    posts: [],
    ui: {
      visitedLinks: null,
      modal: null,
    },
  };

  const i18next = i18n.createInstance();
  i18next.init({
    lng: defaulltLng,
    debug: false,
    resources,
  });
  
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    button: document.querySelector('[aria-label="add"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const { form } = elements;
  const watchedState = onChange(state, render(state, elements, i18next));

  form.addEventListener('submit', (e) => formHandler(e, watchedState));
};
