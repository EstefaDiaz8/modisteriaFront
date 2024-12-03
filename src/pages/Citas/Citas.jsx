import Metadata from "../../components/metadata/Metadata";
import { useEffect, useRef, useState } from "react";
import useLLM from "../../hooks/useLLM";
import "./citas.css";
import videoSource from "/citaVideo.mp4";
import { useJwt } from "../../context/JWTContext";
import Modal from "../../components/modal/Modal";
import { Calendar } from "../../components/svg/Svg";
import {
  Asesor,
  Right,
  Send,
  Report,
  NewChat,
  ArrowDown,
} from "../../components/svg/Svg";
import chatbot from "/chatbot.jpg";
import citasImg from "/citas.jfif";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { imageExtensions, URL_BACK } from "../../assets/constants.d";
import useDecodedJwt from "../../hooks/useJwt";
import useFetch from "../../hooks/useFetch";
import dayjs from "dayjs";
export default function Citas() {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const {
    historial,
    sendMessage,
    isLoadingMessage,
    generarReporte,
    resetHistory,
  } = useLLM();
  const emptyChat = useRef();
  const [imagen, setImagen] = useState();
  const inputImagen = useRef();
  const [inputValue, setInputValue] = useState("");
  const [addCitaModal, setAddCitaModal] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [fechaCita, setFechaCita] = useState(null);
  const [objetivo, setObjetivo] = useState(null);
  const [sentMessage, setSentMessage] = useState("");
  const [hasClassActive, setHasClassActive] = useState(false);
  const { triggerFetch } = useFetch();
  const inputRef = useRef();
  const handleChangeInputImagen = () => {
    const extension = inputImagen.current.files[0].name.split(".")[1];
    if (!imageExtensions.includes(extension)) {
      toast.error("Solo aceptamos Imágenes de referencia!", {
        toastId: "imagenReferencia",
        autoClose: 1300,
      });
      setImagen(null);
      return;
    }

    toast.success("Imagen agregada con éxito!", {
      toastId: "imagenReferenciaSuccess",
      autoClose: 1300,
    });
    setImagen(inputImagen.current.files[0]);
  };
  const toggleAddCita = () => {
    setAddCitaModal(!addCitaModal);
  };
  const navigate = useNavigate();
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };
  const handleReset = () => {
    setHasClassActive(false);
    setFechaCita(null);
    setObjetivo(null);
    resetHistory();
  };
  const handleGoToSesion = (e) => {
    e.preventDefault();
    toast.error("Debes iniciar sesión\npara agendar una cita!", {
      autoClose: 2000,
      onClose: () => {
        navigate("/sesion");
      },
    });
  };
  const handleAddCita = async () => {
    if (!fechaCita || !objetivo) {
      toast.error("No puedes agregar una cita!\nTe falta información.", {
        toastId: "errorInfoCita",
        autoClose: 1500,
      });
      return;
    }
    const [day, month, year, time] = fechaCita.split(/[-:]/);

    const dateObject = `${year}-${month}-${day}T${time}:00:00`;
    console.log(dateObject);
    const formData = new FormData();
    formData.append("fecha", dateObject);
    formData.append("objetivo", objetivo);
    formData.append("usuarioId", payload?.id);
    imagen && formData.append("file", imagen);
    const response = await triggerFetch(
      `${URL_BACK}/citas/createCita`,
      "POST",
      formData,
      {
        "x-token": token,
        "Content-Type": "multipart/form-data",
      }
    );
    console.log(response);

    if (response.status === 201) {
      toggleAddCita();
      toast.success(`${response.data.msg}!`, {
        toastId: "addCitaBien",
        autoClose: 2000,
        onClose: () => navigate("/perfil"),
      });
    } else if (response.status === 400) {
      toast.error(`${response.data.msg}!`, {
        toastId: "addCitaMal",
        autoClose: 2000,
      });
    }
  };
  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!hasClassActive) {
      emptyChat.current.classList.add("active");
      setHasClassActive(true);
    }
    if (inputRef.current.value == "") return;
    const message = inputRef.current.value;

    setSentMessage(message);

    const response = await sendMessage(message);
    setLastResponse(response);

    setInputValue("");
  };

  const generateReport = async () => {
    toggleAddCita();
    const response = await generarReporte();
    const responseParsed = response.replace(/```json|```/g, "").trim();
    const dataCita = JSON.parse(responseParsed);
    setObjetivo(dataCita.objetivo);
    setFechaCita(dataCita.fecha);
  };

  useEffect(() => {
    console.log(historial);
  }, [historial]);

  const asesorDiv = useRef(null);

  //Modal
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <Metadata title={"Citas - Modistería Doña Luz"}></Metadata>
      <div className="contenedorCitas">
        <div className="video">
          <video
            src={videoSource}
            autoPlay
            loop
            muted
            className="video"
          ></video>
        </div>
        <div className="citas">
          <span>Citas</span>
          <hr className="separacionCitas" />
          <h2>¡Agenda tu cita ahora!</h2>
          <p>
            Contamos con un asesor especializado que estará completamente
            dedicado a atender tus necesidades. No pierdas la oportunidad de
            recibir una atención personalizada y profesional, diseñada
            exclusivamente para ti.
          </p>
          <button className="btnAsesor" onClick={toggleModal}>
            <span>
              <Asesor color={"#fff"} size={"30px"}></Asesor>
              <Right color={"#fff"} size={"30px"}></Right>
            </span>
          </button>
        </div>
      </div>

      <Modal
        show={addCitaModal}
        onClose={() => {
          toggleAddCita();
          toggleModal();
        }}
      >
        <Calendar color={"#fff"} size={"120"}></Calendar>
        <h3>¿Agregar cita?</h3>
        <div>
          <h3>{fechaCita ? fechaCita : "¡No has añadido una fecha!"}</h3>
          <h3>{objetivo ? objetivo : "¡No has añadido un objetivo!"}</h3>
        </div>
        <div className="logout">
          <button
            onClick={() => {
              toggleAddCita();
              toggleModal();
            }}
            className="btn-cancelar"
          >
            <span>Cancelar</span>
          </button>
          <button onClick={handleAddCita} className="btn-accion">
            <span>Agendar</span>
          </button>
        </div>
      </Modal>

      <Modal
        show={showModal}
        onClose={toggleModal}
        customWidth={"1050px"}
        className="modalAsesor"
      >
        <section ref={asesorDiv} className="asesor">
          <div className="accionesTop">
            <button className="btnAccionesTop" onClick={handleReset}>
              {" "}
              <span>
                <NewChat></NewChat>
              </span>
            </button>

            <button
              title="agendarCita"
              disabled={historial.length <= 8}
              style={{
                cursor: historial.length <= 8 ? "not-allowed" : "pointer",
              }}
              className="btnAccionesTop"
              onClick={() => {
                generateReport();
                toggleModal();
              }}
            >
              {" "}
              <span>
                <Report></Report>
              </span>
            </button>
          </div>
          {historial.length <= 8 ? (
            <div ref={emptyChat} className="empty-chat">
              <img className="img-empty-chat" src={citasImg} alt="" />
              <div className="bg-overlay"></div>
              <div className="text-empty-chat">
                <span>
                  {token
                    ? "¡Envía un mensaje para comenzar!"
                    : "Inicia Sesión para enviar un mensaje"}
                </span>
                <div className="bouncing-arrow">
                  <ArrowDown color={"#bb0eca"} size={40}></ArrowDown>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat">
              <p
                className="mensajeAsesor"
                style={{
                  display: sentMessage.length > 0 ? "inline-block" : "none",
                }}
              >
                {sentMessage ? sentMessage : ""}
              </p>

              <div className="respuestaContainer">
                <img src={chatbot} className="avatarBot" />

                <p
                  className="respuestaAsesor"
                  style={{
                    backgroundColor:
                      lastResponse.length > 0 || isLoadingMessage
                        ? "#e0e0e0"
                        : "transparent",
                  }}
                >
                  {isLoadingMessage ? (
                    <center>
                      <div className="loader-containerAsesor">
                        <div className="loaderAsesor">
                          <svg viewBox="0 0 80 80">
                            <circle r="32" cy="40" cx="40" id="test"></circle>
                          </svg>
                        </div>

                        <div className="loaderAsesor triangleAsesor">
                          <svg viewBox="0 0 86 80">
                            <polygon points="43 8 79 72 7 72"></polygon>
                          </svg>
                        </div>

                        <div className="loaderAsesor">
                          <svg viewBox="0 0 80 80">
                            <rect height="64" width="64" y="8" x="8"></rect>
                          </svg>
                        </div>
                      </div>
                    </center>
                  ) : (
                    lastResponse
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="accionesAsesor">
            <form
              onSubmit={token ? submitQuestion : handleGoToSesion}
              className="messageBox"
            >
              <div className="fileUploadWrapper">
                <label htmlFor="file">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 337 337"
                  >
                    <circle
                      strokeWidth="20"
                      stroke="#6c6c6c"
                      fill="none"
                      r="158.5"
                      cy="168.5"
                      cx="168.5"
                    ></circle>
                    <path
                      strokeLinecap="round"
                      strokeWidth="25"
                      stroke="#6c6c6c"
                      d="M167.759 79V259"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeWidth="25"
                      stroke="#6c6c6c"
                      d="M79 167.138H259"
                    ></path>
                  </svg>
                  <span className="tooltip">Agregar Imagen</span>
                </label>
                <input
                  type="file"
                  ref={inputImagen}
                  onChange={token ? handleChangeInputImagen : handleGoToSesion}
                  id="file"
                  accept="image/*"
                  name="file"
                />
              </div>
              <input
                required
                placeholder="Mensaje..."
                type="text"
                id="messageInput"
                ref={inputRef}
                value={inputValue}
                onChange={handleInput}
              />
              <button id="sendButton" type="submit">
                <Send></Send>
              </button>
            </form>
          </div>
        </section>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
