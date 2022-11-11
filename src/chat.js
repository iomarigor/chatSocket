const socket = io();

let message = document.getElementById("message");
let username = document.getElementById("username");
let output = document.getElementById("output");
let actions = document.getElementById("actions");
let user_id = document.getElementById("chat-use-id");
let date_zone = document.getElementById("date-zone");
let hour_zone = document.getElementById("hour-zone");
let currency_zone = document.getElementById("currency-zone");
let selected_region = document.getElementById("selected-region");
let dollar = document.getElementById("dollar");
let title_fecha = document.getElementById("title-fecha");
let title_pais = document.getElementById("title-pais");
let title_hora = document.getElementById("title-hora");
let btnSend = document.getElementById("send");
console.log(selected_region.options[selected_region.selectedIndex].value);
soapRequest();
var Xmas95 = new Date();
let h = addZero(Xmas95.getHours());
let m = addZero(Xmas95.getMinutes());
let s = addZero(Xmas95.getSeconds());
let time = h + ":" + m + ":" + s;
hour_zone.innerHTML = time;
selected_region.addEventListener("change", function () {
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
      title_fecha.innerHTML = "Date";
      title_pais.innerHTML = "Country";
      title_hora.innerHTML = "Hour";
      btnSend.innerHTML = "Send";
      console.log("EE.UU");
      break;
  }
};
var sendFunction = function () {
  if (message.value == "") {
    return;
  }
  let sendDataMsm = {};
  switch (message.value.split(" ")[0]) {
    case "/p":
      if (
        message.value.split(" ")[1].length == 20 &&
        message.value.split(" ").length == 3
      ) {
        sendDataMsm = {
          type: "to",
          usersend: user_id.innerHTML,
          userreceiver: message.value.split(" ")[1],
          username: username.value,
          message: message.value.split(" ")[2],
        };
      } else {
        actions.innerHTML = `<p>
                    <em>Error comando</em>
                </p>`;
      }

      break;

    default:
      sendDataMsm = {
        type: "all",
        usersend: user_id.innerHTML,
        username: username.value,
        message: message.value,
      };
      break;
  }
  socket.emit("chat:message", sendDataMsm);
  switch (sendDataMsm.type) {
    case "to":
      output.innerHTML += `<p>
                <strong>(Privado) ${sendDataMsm.username}</strong>: ${sendDataMsm.message}
            </p>`;
      break;
    case "all":
      output.innerHTML += `<p>
                <strong>(Publico) ${sendDataMsm.username}</strong>: ${sendDataMsm.message}
            </p>`;
      break;
  }
  message.value = "";
};
btnSend.addEventListener("click", sendFunction);
message.addEventListener("keypress", function () {
  socket.emit("chat:typing", username.value);
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
  console.log(data);
  switch (data.type) {
    case "to":
      if (data.usersend != user_id.innerHTML) {
        output.innerHTML += `<p>
          <strong>(Privado) ${data.username}</strong>: ${data.message}
        </p>`;
      }

      break;
    case "all":
      if (data.usersend != user_id.innerHTML) {
        output.innerHTML += `<p>
          <strong>(Publico) ${data.username}</strong>: ${data.message}
        </p>`;
      }

      break;
  }
});
socket.on("chat:typing", function (data) {
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
});

//Consumo de datos de SOAP
function soapRequest() {
  var str =
    '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mis="miSoapService">' +
    "<soapenv:Header/>" +
    "<soapenv:Body>" +
    ' <mis:priceDollar soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
    '<name xsi:type="mis:helpers">' +
    '<FromCurrency xsi:type="xsd:string">PEN</FromCurrency>' +
    '<ToCurrency xsi:type="xsd:string">USD</ToCurrency>' +
    '<Amount xsi:type="xsd:decimal">' +
    dollar.value +
    "</Amount>" +
    "</name>" +
    "</mis:priceDollar>" +
    "</soapenv:Body>" +
    "</soapenv:Envelope>";

  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
      xhr.open(method, url, false);
      xhr.setRequestHeader(
        "Authorization",
        "Bearer duidox3ssakpq48sz91a14xqwebgr6"
      );
    } else if (typeof XDomainRequest != "undefined") {
      alert;
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      console.log("CORS not supported");
      alert("CORS not supported");
      xhr = null;
    }
    return xhr;
  }
  var xhr = createCORSRequest(
    "POST",
    "http://192.168.56.1/SOAP_UI/index.php?wsdl"
  );
  /* var xhr = createCORSRequest("POST", "http://soapuifiis.ga/index.php?wsdl"); */
  if (!xhr) {
    console.log("XHR issue");
    return;
  }

  xhr.onload = function () {
    var results = xhr.responseText;
    console.log(parseXmlToJson(results));
    currency_zone.innerHTML = parseXmlToJson(results).name.response;
  };

  xhr.setRequestHeader("Content-Type", "text/xml");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.send(str);
}
// Changes XML to JSON
function parseXmlToJson(xml) {
  const json = {};
  for (const res of xml.matchAll(
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = res[1] || res[3];
    const value = res[2] && parseXmlToJson(res[2]);
    json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
  }
  return json;
}
