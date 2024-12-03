import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
import { URL_BACK } from "../assets/constants.d";

export default function useCitasData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllCitas = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/citas/getAllCitas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllCitas = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/citas/getAllCitas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const updateCita = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/citas/updateCita/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createVenta = async (citaId) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/citainsumos/endCitaCreateVenta`,
      "PUT",
      citaId,
      { "x-token": token }
    );
    return respuesta;
  };

  const createCita = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/citas/crearCita`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createEstimation = async (infoUpdate) => {
    const respuesta = await createFetch(
      `${URL_BACK}/citainsumos/createAndDiscount`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateSTP = async (citaId, infoUpdate) => {
    const respuesta = await updateFetch(
      `${URL_BACK}/citas/updateSPT/${citaId}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteCita = async (id) => {
    const respuesta = await deleteFetch(
      `${URL_BACK}/citas/cancelCita/${id}`,
      "PUT",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const fetchAllUsuarios = async () => {
    const respuesta = await getFetch(
      `${URL_BACK}/usuarios/getAllUsers`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllUsuarios = async () => {
    const respuesta = await triggerFetch(
      `${URL_BACK}/usuarios/getAllUsers`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCitas,
    fetchAllCitas,
    deleteCita,
    createCita,
    updateCita,
    fetchAllUsuarios,
    initialFetchAllUsuarios,
    createVenta,
    loading,
    createEstimation,
    updateSTP,
  };
}
