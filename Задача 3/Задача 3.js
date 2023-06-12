// Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:

const wsUri = "wss://echo-ws-service.herokuapp.com";

const input = document.querySelector('.input');
const btnMess = document.querySelector('.btn-mess');
const btnGeo = document.querySelector('.btn-geo');
const userMessages = document.querySelector('.user-message');
const wrapperChat =  document.querySelector('.wrapper-chat');

//Выводит сообщения
function writeToScreen(message, position='flex-end') {
	let element = `
        <p class='message' style='align-self: ${position}'>
            ${message}
        </p>
    `;
	userMessages.innerHTML += element;
	wrapperChat.scrollTop = wrapperChat.scrollHeight;
  }

//Объект соединения
 let websocket = new WebSocket(wsUri); 
	websocket.onopen = function(evt) {
		console.log("CONNECTED");
	};
	websocket.onmessage = function(evt) {
		writeToScreen(`Сообщение от сервера: ${evt.data}`, 'flex-start');
	};
	websocket.onerror = function(evt) {
		writeToScreen(`server: ${evt.data}`, 'flex-start');
	};
  
  //отправка сообщения
  btnMess.addEventListener('click', () => {
	let message = input.value;
	websocket.send(message);
	writeToScreen(`Сообщение отправителя: ${message}`);
	input.value = ''

  });

  //Геолокация.
  // Функция,  об ошибке
const error = () => {
	let textErr0r = 'Невозможно получить ваше местоположение';
	writeToScreen(textErr0r);
  };
  
  // Функция, срабатывающая при успешном получении геолокации
  const success = (position) => {
	let latitude  = position.coords.latitude;
	let longitude = position.coords.longitude;
	let geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
	writeToScreen(`<a href='${geoLink}' target='_blank'>Гео-локация</a>`);
  };
  
  btnGeo.addEventListener('click', () => {
	if (!navigator.geolocation) {
	  console.log('Geolocation не поддерживается вашим браузером');
	} else {
	  navigator.geolocation.getCurrentPosition(success, error);
	}
  });

