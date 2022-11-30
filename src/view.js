export const elements = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  button: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
};

const messages = {
  url: 'Ссылка должна быть валидным URL',
  notOneOf: 'RSS уже существует',
  success: 'RSS успешно загружен',
};

export const renderFeedback = (elements, feedbackText) => {
  elements.feedback.textContent = messages[feedbackText];
};

const handleProcessState = (elements, process) => {
  switch (process) {
    case 'filling':
      elements.input.focus();
      break;
    case 'success':
    //   elements.form.reset();
      elements.input.focus();
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      break;
    case 'error':
      elements.input.classList.remove('is-valid');
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;

    default:
      break;
  }
};

export default (elements) => (path, value) => {
  switch (path) {
    case 'process':
      handleProcessState(elements, value);
      break;
    case 'feedbackText':
      renderFeedback(elements, value);
      break;
    default:
      break;
  }
};
