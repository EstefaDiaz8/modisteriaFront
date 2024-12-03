import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns"; 
import { es } from "date-fns/locale"; 
import Header from "../../components/Header/Header";
import { ColumnsVentas } from "../../assets/columns";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useVentasData from "../../hooks/useVentasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { toggleState } from "../../assets/constants.d";
import DialogActions from '@mui/material/DialogActions';
import { HelpOutlineOutlined } from "@mui/icons-material";


export default function Ventas() {
  // Estado para los datos, modal y control de apertura
  const [data, setData] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Custom hook para manejar datos de ventas
  const { fetchAllVentas, updateVentas, initialFetchAllVentas, loading } =
    useVentasData();

  // Validación de formularios
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  // Carga inicial de datos
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);

  // Función para abrir la modal
  const handleDialog = (action, title, row = null) => {
    console.log('Abriendo modal con acción:', action, 'y fila:', row);

    setDialogProps({ action, row, title });
    reset({
      id: row?.id || "",
      fecha: row?.fecha
        ? format(new Date(row.fecha), "dd/MM/yyyy HH:mm", { locale: es })
        : "Sin fecha",
      estadoId: row?.estadoId || "Pendiente",
      nombrePersona: row?.nombrePersona || "Anónimo",
      valorDomicilio: row?.valorDomicilio || 0,
      valorPrendas: row?.valorPrendas || 0,
      valorFinal: row?.valorFinal || 0,
      metodoPago: row?.metodoPago || "Transferencia",
      citaId: row?.citaId || "Sin cita",
      imagen: row?.imagen || "No hay imagen",
    });
    toggleState(setOpenAddModal);
  };

  // Confirmar edición de una venta
  const handleConfirm = (row) => {
    handleDialog("edit", "Confirmar venta", row);
  };

  // Guardar cambios
  const handleSave = async (formData) => {
    try {
      // Solo enviamos el id de la venta al backend
      const response = await updateVentas(dialogProps.row.id);
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Error al confirmar la venta.");
        return;
      }

      // Actualizar los datos localmente
      setData((prevData) =>
        prevData.map((venta) =>
          venta.id === dialogProps.row.id
            ? { ...venta, estadoId: 14 } // Actualizamos el estado solo localmente
            : venta
        )
      );

      // Cerrar el modal y mostrar mensaje de éxito
      toggleState(setOpenAddModal);
      toast.success(`¡Venta confirmada con éxito!`, {
        autoClose: 1800,
        toastId: "crudAction",
      });
    } catch (error) {
      toast.error(`Error en la operación: ${error.message}`);
    }
  };

  // Columnas de la tabla
  const columns = ColumnsVentas({ onConfirm: handleConfirm, onOpenDialog: handleDialog });

  return (
    <>
      <Header 
        title="Ventas"
      />
      <ContainerDataGrid>
        {loading ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "fecha", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>

      {/* Modal para detalles de venta */}
      <Dialog open={openAddModal} onClose={() => toggleState(setOpenAddModal)}>
        <DialogContent>
          <div>
            <p><strong>ID:</strong> {dialogProps.row?.id}</p>
            <p><strong>Fecha:</strong> {dialogProps.row?.fecha ? format(new Date(dialogProps.row?.fecha), "dd/MM/yyyy HH:mm", { locale: es }) : "Sin fecha"}</p>
            <p><strong>Estado:</strong> {dialogProps.row?.estadoId === 14 ? "Pagado" : "Pendiente"}</p>
            <p><strong>Valor Domicilio:</strong> {dialogProps.row?.valorDomicilio ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorDomicilio) : 0}</p>
            <p><strong>Valor Prendas:</strong> {dialogProps.row?.valorPrendas ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorPrendas) : 0}</p>
            <p><strong>Valor Final:</strong> {dialogProps.row?.valorFinal ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorFinal) : 0}</p>
            <p><strong>Metodo de Pago:</strong> {dialogProps.row?.metodoPago === "transferencia" ? "Transferencia" : dialogProps.row?.metodoPago}</p>
            {/* Mostrar el campo de cita solo si citaId tiene valor */}
            {dialogProps.row?.citaId && (
              <p><strong>Cita:</strong> {dialogProps.row?.citaId ? "Cita asignada" : "Sin cita"}</p>
            )}
            <p><strong>Imagen de la transferencia:</strong> </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {dialogProps.row?.imagen ? (
                <img
                  src={dialogProps.row?.imagen}
                  alt="Imagen de la venta"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '180px',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <img
                  alt="Imagen no disponible"
                  style={{
                    width: '100px',
                    height: 'auto',
                    borderRadius: '8px',
                  }}
                />
              )}
            </div>

          </div>
        </DialogContent>

        <DialogActions>
          {dialogProps.row?.estadoId !== 14 && (
            <button
              onClick={() => handleSave(dialogProps.row)}  // Confirmar la venta
              style={{
                backgroundColor: "#7C0D84",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Confirmar Venta
            </button>
          )}
          <button
            onClick={() => toggleState(setOpenAddModal)}
            style={{
              backgroundColor: "#ccc",
              color: "black",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </DialogActions>
      </Dialog>


      <ToastContainer />
    </>
  );
}
