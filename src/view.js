export const elements = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  button: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
};

export const renderFeedback = (elements, i18next, feedbackText) => {
  const { feedback } = elements;
  feedback.textContent = i18next.t(`messages.${feedbackText}`);  
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
}

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

export default (elements, i18next) => (path, value) => {
  switch (path) {
    case 'process':
      handleProcessState(elements, value,);
      break;
    case 'feedbackText':
      renderFeedback(elements, i18next, value,);
      break;
    default:
      break;
  }
};
