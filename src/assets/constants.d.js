const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^3\d{9}$/;

const constants = {
  EMAIL_REGEX,
  PHONE_REGEX,
};
export const messagesCalendar = {
  allDay: "Todo el día",
  showMore: (total, remainingEvents, events) => `+${total} más`,
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sin eventos",
};
export const estadoCitasColores = [
  {
    nombre: "Por aprobar",
    color: "#F4D03F",
  },
  {
    nombre: "Aprobada",
    color: "#27AE60",
  },
  {
    nombre: "Aceptada",
    color: "#145A32",
  },
  {
    nombre: "Terminada",
    color: "#3498DB",
  },
  {
    nombre: "Cancelada",
    color: "#E74C3C",
  },
];

export const postSession = [
  {
    title: "Bienvenido a Modistería Doña Luz. ¡Agenda una cita con nosotros!",
    img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
    published: "Modistería D.L",
    linkText: "Agendar Cita",
    tag: "Cita",
    type: "article",
    link: "/cita",
  },
  {
    title: "¡Visita tu perfil y administra tu información! ",
    img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
    tag: "Perfil",
    published: "Modistería D.L",
    linkText: "Ir a mi Perfil",
    type: "article",
    link: "/perfil",
  },
  {
    title:
      "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
    img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
    tag: "Catálogo",
    published: "Modistería D.L",
    linkText: "Catálogo",
    type: "article",
    link: "/catalogo",
  },
];
export const postsNoSession = [
  {
    title:
      "Bienvenido a Modistería Doña Luz. Si aún no tienes una cuenta, puedes Registrarte",
    img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
    published: "Modistería D.L",
    linkText: "Registrate",
    tag: "Registrate",
    type: "article",
    link: "/registro",
  },
  {
    title:
      "Si ya habías ingresado a Modistería Doña Luz, puedes Iniciar Sesión y hacer uso de nuestros servicios",
    img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
    tag: "Inicia Sesión",
    published: "Modistería D.L",
    linkText: "Inicia Sesión",
    type: "article",
    link: "/sesion",
  },
  {
    title:
      "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
    img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
    tag: "Catálogo",
    published: "Modistería D.L",
    linkText: "Catálogo",
    type: "article",
    link: "/catalogo",
  },
];

export const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "bmp",
  "tiff",
  "heic",
  "svg",
  "webp",
  "heif",
  "ico",
];

export const formatDateSpanish = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", options);
};

export const formaTime = (dateString) => {
  const date = new Date(dateString);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};

export const formToCop = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

export const toggleState = (setState) => {
  setState((prev) => !prev);
};

export const URL_BACK = import.meta.env.VITE_URL_BACK_API;

export default constants;
