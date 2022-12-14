import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';
import i18n from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';
import parser from './parser.js';
import _ from 'lodash';

const defaulltLng = 'ru';

const validate = (url, urls) => yup.string().required()
.url('mustBeValid')
.notOneOf(urls, 'linkExists')
.validate(url);

const addFeed = (url, data, state) => {
  const { urls, feeds, posts } =  state;
  urls.push(url);
  feeds.push(data.feed);
  posts.unshift(...data.posts);
};

export default () => {
  const state = {
    form: {
      valid: true, 
      processState: 'filling',
      processError: null,
      errors: {},
      status: null,
    },
    urls: [],
    feeds: [],
    posts: [],
    ui: {
      lng: defaulltLng,
      visitedPostsId: [],
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
    status: document.querySelector('.status'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),

    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modalLink'),

    btnLng: document.querySelector('.btn-group'),
  };

  const { form, posts, btnLng } = elements;
  const watchedState = onChange(state, render(state, elements, i18next));

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    watchedState.form.processState = 'sending'; 
    watchedState.form.status = 'loading'
    watchedState.form.processError = null;

    const formData = new FormData(event.target);
    const url = formData.get('url');
    
    validate(url, watchedState.urls)
    .then((link) => {
      return axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
    })
    .then((response) => { 
      const data = parser(response.data.contents);  
      addFeed(url, data, watchedState);          
      watchedState.form.processState = 'success'; 
      watchedState.form.status = 'success';          
    })
    .catch((error) => {
      watchedState.form.processState = 'error'; 
      watchedState.form.status = error.message; 
    })
  }); 

  btnLng.addEventListener('click', (event) => {
    event. preventDefault();

    const { lng } = event.target.dataset;
    watchedState.ui.lng = lng;
  });

  posts.addEventListener('click', (event) => {
    const { id } = event.target.dataset;
    if (id) {
    watchedState.ui.modal = watchedState.posts.find((post) => post.id === id);
    watchedState.ui.visitedPostsId.push(id);
    }
  })
};
