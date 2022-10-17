//io('http://localhost:4000/');
const socket = io();

let message = document.getElementById("message");
let username = document.getElementById("username");
let output = document.getElementById("output");
let actions = document.getElementById("actions");
let user_id = document.getElementById("chat-use-id");
let date_zone = document.getElementById("date-zone");
let hour_zone = document.getElementById("hour-zone");
let currency_zone = document.getElementById("currency-zone");
let zone_z = document.getElementById("zone-z");
let selected_region = document.getElementById("selected-region");

let title_fecha = document.getElementById("title-fecha");
let title_pais = document.getElementById("title-pais");
let title_hora = document.getElementById("title-hora");
let btnSend = document.getElementById("send");
console.log(selected_region.options[selected_region.selectedIndex].value);

var Xmas95 = new Date();
let h = addZero(Xmas95.getHours());
let m = addZero(Xmas95.getMinutes());
let s = addZero(Xmas95.getSeconds());
let time = h + ":" + m + ":" + s;
hour_zone.innerHTML = time;
//changeZone(selected_region.options[selected_region.selectedIndex].value);
selected_region.addEventListener("change", function () {
  //console.log("change",selected_region.options[selected_region.selectedIndex].value)
  socket.emit("zone:change", {
    zone: selected_region.options[selected_region.selectedIndex].value,
  });
  changeZone(selected_region.options[selected_region.selectedIndex].value);
});
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
const changeZone = (zone) => {
  var Xmas95 = new Date();
  let h = addZero(Xmas95.getHours());
  let m = addZero(Xmas95.getMinutes());
  let s = addZero(Xmas95.getSeconds());
  let time = h + ":" + m + ":" + s;
  switch (zone) {
    case "PE":
      hour_zone.innerHTML = time;
      date_zone.innerHTML =
        Xmas95.getFullYear() + ":" + Xmas95.getMonth() + ":" + Xmas95.getDate();
      //zone.innerHTML="PEN";
      zone_z.innerHTML = "Soles";
      currency_zone.innerHTML = "4.07";
      title_fecha.innerHTML = "Fecha";
      title_pais.innerHTML = "Pais";
      title_hora.innerHTML = "Hora";
      btnSend.innerHTML = "Enviar";
      console.log("PERU");
      break;
    case "EE.UU":
      hour_zone.innerHTML = time;
      date_zone.innerHTML =
        Xmas95.getFullYear() +
        ":" +
        Xmas95.getMonth() +
        ":" +
        Xmas95.getDate() +
        "";
      currency_zone.innerHTML = "1";
      zone_z.innerHTML = "Dollar";
      title_fecha.innerHTML = "Date";
      title_pais.innerHTML = "Country";
      title_hora.innerHTML = "Hour";
      btnSend.innerHTML = "Send";
      console.log("EE.UU");
      break;
  }
};
btnSend.addEventListener("click", function () {
  switch (message.value.split(" ")[0]) {
    case "/p":
      if (
        message.value.split(" ")[1].length == 20 &&
        message.value.split(" ").length == 3
      ) {
        socket.emit("chat:message", {
          type: "to",
          userreceiver: message.value.split(" ")[1],
          username: username.value,
          message: message.value.split(" ")[2],
        });
        output.innerHTML += `<p>
                    <strong>(Privado) ${data.username}</strong>: ${data.message}
                </p>`;
      } else {
        actions.innerHTML = `<p>
                    <em>Error comando</em>
                </p>`;
      }

      break;

    default:
      socket.emit("chat:message", {
        type: "all",
        username: username.value,
        message: message.value,
      });
      break;
  }
});
message.addEventListener("keypress", function () {
  /* console.log(message.value);
    if (username.value != '') { */
  socket.emit("chat:typing", username.value);
  /* } else {
        socket.emit('chat:typing', null);
    } */
});
socket.on("zone:change", function (data) {
  if (data.socket != user_id.innerHTML) {
    var r = confirm("Se actualizar la zona?");
    if (r == true) {
      selected_region.value = data.zone;
      changeZone(data.zone);
    }
  }
});
socket.on("chat:user_id", function (data) {
  user_id.innerHTML = data;
});
socket.on("chat:message", function (data) {
  //console.log(data);
  switch (data.type) {
    case "to":
      output.innerHTML += `<p>
                <strong>(Privado) ${data.username}</strong>: ${data.message}
            </p>`;
      break;
    case "all":
      output.innerHTML += `<p>
                <strong>(Publico) ${data.username}</strong>: ${data.message}
            </p>`;
      break;
  }
});
socket.on("chat:typing", function (data) {
  /* if (data) { */
  switch (selected_region.options[selected_region.selectedIndex].value) {
    case "PE":
      actions.innerHTML = `<p>
                    <em>${data} escribiendo</em>
                </p>`;
      break;
    case "EE.UU":
      actions.innerHTML = `<p>
                    <em>${data} typing</em>
                </p>`;
      break;
    default:
      break;
  }

  /* } else {
        actions.innerHTML = '';
    } */
});
