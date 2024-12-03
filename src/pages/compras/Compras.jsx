import "./compras.css";
import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import Transition from "../../components/transition/Transition";
import useComprasData from "../../hooks/useCompraData";
import useProveedoresData from "../../hooks/useProveedoresData.js";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../components/Header/Header";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import useInsumosData from "../../hooks/useInsumosData.js";
import { toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import SelectDash from "../../components/selectDash/SelectDash";
import InputDash from "../../components/inputDashboard/InputDash";
import CardCompras from "../../components/cardCompras/CardCompras.jsx";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount.js";
import { Paid } from "@mui/icons-material";
const Compras = () => {
  const {
    handleSubmit: handleSaveCompra,
    formState: { errors: errorsAddCompra },
    register: registerCompra,
    reset,
    watch,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const { initialFetchAllInsumos, loading: loadingInsumos } = useInsumosData();
  const { initialFetchAllProveedores, loading: loadingProveedor } =
    useProveedoresData();
  const { initialFetchAllCompras, fetchAllCompras, createCompra, loading } =
    useComprasData();
  useEffect(() => {
    const initialFetchCompras = async () => {
      const respuesta = await initialFetchAllCompras();
      const insumos = await initialFetchAllInsumos();
      const proveedores = await initialFetchAllProveedores();
      if (
        respuesta.status === 200 &&
        insumos.status === 200 &&
        proveedores.status === 200
      ) {
        setData(respuesta.data);
        console.log(respuesta.data);

        setInsumos(insumos.data.filter((insumo) => insumo.estadoId === 1));
        setProveedores(
          proveedores.data.filter((proveedor) => proveedor.estadoId === 1)
        );
      }
    };
    initialFetchCompras();
  }, []);
  const handleDialog = (action, title) => {
    setDialogProps({ action, title });
    reset({
      valorTotal: "",
      cantidad: "",
      proveedorId: proveedores[0]?.id,
      insumoId: insumos[0]?.id,
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Compra");
  };
  const getUnidadMedida = (insumoId) => {
    const insumo = insumos.find((insumo) => insumo.id == insumoId);
    return insumo && insumo.unidades_de_medida.nombre.toLowerCase();
  };
  const handleSave = async (data) => {
    const { cantidad, ...restOfData } = data;
    const response = await createCompra({
      ...restOfData,
      cantidad: parseInt(cantidad),
    });

    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllCompras();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(`¡Compra agregada con éxito!`, {
      autoClose: 1800,
      toastId: "crudAction",
    });
  };
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const [inputDateFilter, setInputDateFilter] = useState();
  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  const handleSpecificDate = (e) => setInputDateFilter(e.target.value);
  useEffect(() => {
    if (isFirstRender) return;
    const initialComprasData = inputDateFilter
      ? data.filter((compra) => compra.fecha.includes(inputDateFilter))
      : data;
    if (lastModifications) {
      setFilteredData(initialComprasData);
    } else {
      const sortedData = [...initialComprasData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, data, inputDateFilter]);
  return (
    <>
      <Header
        icon={Paid}
        title={"Compras"}
        handleAdd={handleAdd}
        buttonText={"Añadir compra"}
      ></Header>
      <br />

      <div className="filtrosControl">
        <div className="header-actions">
          <Button
            variant="contained"
            onClick={handleFilterDataDates}
            color="primary"
            startIcon={<FilterListIcon />}
            endIcon={
              lastModifications ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon></ArrowDownwardIcon>
              )
            }
          >
            {lastModifications ? "Recientes" : "Viejas"}
          </Button>
        </div>

        <div className="textInputWrapper">
          <input
            value={inputDateFilter}
            onChange={handleSpecificDate}
            type="date"
            className="textInput"
          />
        </div>
      </div>
      <div>
        {loading || loadingInsumos || loadingProveedor ? (
          <LoadingTableData />
        ) : filteredData.length ? (
          <section className="compras-main">
            {filteredData.map((compra) => (
              <CardCompras key={compra.id} compra={compra} />
            ))}
          </section>
        ) : (
          <div className="sin-compras">¡Sin compras registradas!</div>
        )}
      </div>
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(setOpenModal)}
      >
        <form onSubmit={handleSaveCompra(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            <SelectDash
              {...registerCompra("insumoId", {
                required: "Debes escoger un insumo!",
              })}
              description={
                errorsAddCompra.insumoId && errorsAddCompra.insumoId.message
              }
              label="Insumo"
            >
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.nombre}
                </option>
              ))}
            </SelectDash>
            <InputDash
              {...registerCompra("cantidad", {
                required: "La cantidad es requerida",
                pattern: {
                  value: /^\d+(.\d+)?$/,
                  message: "Solo se permiten números",
                },
                min: {
                  message: "¡Debes ingresar una cantidad mayor a cero!",
                  value: 1,
                },
                max: { message: "¡Límite máximo de 250!", value: 250 },
                onChange: (e) => {
                  let { value } = e.target;
                  const regex = /^-?\d+(\.\d*)?$/;
                  if (!regex.test(value)) {
                    value = value.replace(/[^0-9.-]/g, "");
                    if (value.includes(".") && !/\d+\./.test(value)) {
                      value = value.replace(".", "");
                    }
                  }
                  e.target.value = value;
                },
              })}
              label={`Cantidad en ${getUnidadMedida(watch("insumoId"))}`}
              type="text"
              description={
                errorsAddCompra.cantidad && errorsAddCompra.cantidad.message
              }
            />
            <SelectDash
              {...registerCompra("proveedorId", {
                required: "¡Debes escoger un proveedor!",
              })}
              description={
                errorsAddCompra.proveedorId &&
                errorsAddCompra.proveedorId.message
              }
              label="Proveedor"
            >
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </SelectDash>
            <InputDash
              {...registerCompra("valorTotal", {
                required: "La cantidad es requerida en pesos Colombianos (COP)",
                pattern: {
                  value: /^\d+$/,
                  message: "Solo se permiten números",
                },
                min: {
                  message: "¡Mínimo de compra 2000 pesos colombianos!",
                  value: 2000,
                },
                onChange: (e) => {
                  let { value } = e.target;
                  value = value.replace(/\D/g, "");
                  e.target.value = value;
                },
              })}
              label="Valor Compra ($COP)"
              type="text"
              description={
                errorsAddCompra.valorTotal && errorsAddCompra.valorTotal.message
              }
            />
          </DialogContent>
          <CustomDialogActions
            cancelButton
            saveButton
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Compras;
