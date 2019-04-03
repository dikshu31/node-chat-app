const socket = io();

const messageForm = document.querySelector("#message-form");
const message = document.querySelector("#message");
const sendMessage = document.querySelector("#send-message");
const sendLocation = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Auto Scroll
const autoScroll = () => {
  // New message element
  const $newMessage = messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", locationMessage => {
  const html = Mustache.render(locationMessageTemplate, {
    username: locationMessage.username,
    locationMessage: locationMessage.text,
    createdAt: moment(locationMessage.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
    room
  });
  document.querySelector("#sidebar").innerHTML = html;
});

messageForm.addEventListener("submit", event => {
  sendMessage.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", message.value, error => {
    sendMessage.removeAttribute("disabled");
    message.value = "";
    message.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });

  event.preventDefault();
});

sendLocation.addEventListener("click", event => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  sendLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const location = {
      latitude,
      longitude
    };
    socket.emit("sendLocation", location, error => {
      sendLocation.removeAttribute("disabled");
      if (error) {
        return console.log(error);
      }
      console.log("Location shared");
    });
  });

  event.preventDefault();
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
