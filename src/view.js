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
  const { feedback } = elements;
  feedback.textContent = messages[feedbackText];  
};

const handleProcessState = (elements, process) => {
  const { form, input, feedback } = elements;
  switch (process) {
    case 'filling':
      input.focus();
      break;
    case 'success':      
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      form.reset();
      input.focus();
    break;
    case 'error':
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
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
