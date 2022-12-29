import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.'

    if(element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHtml += text.charAt(index);
      index ++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate a unique id for every message to enable mapping over them
function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async(e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chat stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // scrolldown as user types
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // fetch newly created div
  const messageDiv = document.getElementById(uniqueId);

  // turn on the loader
  loader(messageDiv);

  // fetch data from server and get bot's response
  const response = await fetch('https://codx-jm0c.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

// handle form submission
form.addEventListener('submit', handleSubmit);

// submit form with press of enter key
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
})

