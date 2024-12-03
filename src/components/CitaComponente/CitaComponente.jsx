import { useState } from "react";
import {
  formatDateSpanish,
  formaTime,
  URL_BACK,
} from "../../assets/constants.d";
import { Cancel, Alert } from "../svg/Svg";
import Modal from "../modal/Modal";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CitaComponente({ value, typeAppointment, token }) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const toggleCancelModal = () => setIsCancelModalOpen(!isCancelModalOpen);
  const toggleConfirmCancelModal = () =>
    setIsConfirmCancelModalOpen(!isConfirmCancelModalOpen);
  const toggleImageModal = () => setIsImageModalOpen(!isImageModalOpen);

  const navigate = useNavigate();
  const { triggerFetch: cancelarCita } = useFetch();

  const handleCancelarCita = async () => {
    const response = await cancelarCita(
      `${URL_BACK}/citas/cancelarCita/${value.id}`,
      "PUT",
      null,
      { "x-token": token }
    );
    if (response.status === 400) {
      toast.error(`${response.data.message}!`, {
        toastId: "errorDeleteCita",
        autoClose: 1500,
      });
    } else if (response.status === 201) {
      toast.success(`${response.data.msg} con éxito!`, {
        toastId: "DeleteCita",
        autoClose: 1500,
        onClose: () => navigate("/perfil"),
      });
    }
  };

  // const handleConfirm = () => {
  //   if (typeAppointment === "10") {
  //     toggleImageModal();
  //   }
  // };

  return (
    <div key={value.id} className="cartasCitas">
      <div className="carta work">
        <div className="img-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            transform="rotate(45)"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M4 11h16" />
            <path d="M7 14h.013" />
            <path d="M10.01 14h.005" />
            <path d="M13.01 14h.005" />
            <path d="M16.015 14h.005" />
            <path d="M13.015 17h.005" />
            <path d="M7.01 17h.005" />
            <path d="M10.01 17h.005" />
          </svg>
        </div>
        <div className="carta-desc">
          <div className="carta-header">
            <div className="carta-title">Cita</div>
            <button className="carta-menu" onClick={toggleCancelModal}>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </button>
          </div>
          <div className="carta-time">
            {formaTime(value.fecha)}
            <br />
            <p>{value.objetivo}</p>
          </div>
          <p className="recent">{formatDateSpanish(value.fecha)}</p>
        </div>
      </div>

      {/* Modal para cancelar cita */}
      {typeAppointment === "9" && (
        <Modal show={isCancelModalOpen} onClose={toggleCancelModal}>
          <div className="modal-header">
            <Cancel color={"rgb(187, 25, 25)"} size={"150px"} />
            <br />
            <span>
              Deseas cancelar la cita del {formatDateSpanish(value.fecha)}?
            </span>
            <button
              className="btnCancelarCita"
              onClick={() => {
                toggleCancelModal();
                toggleConfirmCancelModal();
              }}
            >
              Continuar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación */}
      {typeAppointment === "9" && (
        <Modal show={isConfirmCancelModalOpen} onClose={toggleConfirmCancelModal}>
          <div className="modalConfirmar">
            <Alert size={"150px"} color={"rgb(187, 25, 25)"} />
            <br />
            <span>¿Estás seguro de cancelar tu cita con la modista?</span>
            <br />
            <span>Aún no se ha realizado la cotización</span>
            <div>
              <button className="btnCancelarCita" onClick={toggleConfirmCancelModal}>
                Cancelar
              </button>
              <button onClick={handleCancelarCita} className="btnCancelarCita">
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para pedir imagen
      {typeAppointment === "10" && (
        <Modal show={isImageModalOpen} onClose={toggleImageModal}>
          <div className="modalConfirmar">
            <Alert size={"150px"} color={"rgb(187, 25, 25)"} />
            <br />
            <span>Por favor sube una imagen para confirmar tu cita.</span>
            <input type="file" accept="image/*" />
            <div>
              <button className="btnCancelarCita" onClick={toggleImageModal}>
                Cancelar
              </button>
              <button className="btnCancelarCita">
                Enviar imagen
              </button>
            </div>
          </div>
        </Modal>
      )} */}
    </div>
  );
}
