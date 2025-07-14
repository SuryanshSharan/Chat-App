(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;

  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-message");
  const emojiToggle = document.getElementById("emoji-toggle");
  const emojiPicker = document.getElementById("emoji-picker");

  app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    let username = document.getElementById("username").value.trim();
    if (!username) return;

    socket.emit("newuser", username);
    uname = username;

    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    renderMessage("my", { username: uname, text: message });
    socket.emit("chat", { username: uname, text: message });

    messageInput.value = "";
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  emojiToggle.addEventListener("click", () => {
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
  });

  emojiPicker.addEventListener("emoji-click", (event) => {
    messageInput.value += event.detail.unicode;
    emojiPicker.style.display = "none";
  });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    const messageContainer = document.querySelector(".chat-screen .messages");
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const el = document.createElement("div");
    el.className = `message ${type}-message`;

    if (type === "my" || type === "other") {
      el.innerHTML = `
        <div>
          <div class="name">${type === "my" ? "You" : message.username}</div>
          <div class="text">${message.text}</div>
          <div class="time">${timeString}</div>
        </div>
      `;
    } 
    else if (type === "update") {
  const el = document.createElement("div");
  el.className = "update";
  el.innerText = message;
  messageContainer.appendChild(el);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  return;
}

    messageContainer.appendChild(el);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
})();
