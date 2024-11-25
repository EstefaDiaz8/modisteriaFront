//mirando
import "./catalogoDashboard.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Switch,
  Grid,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit, Eye, AddRounded } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha, Chip } from "@mui/material";
import useCategoriaData from "../../hooks/useCategoriaData";
import useCatalogoData from "../../hooks/useCatalogoData";
import Transition from "../../components/transition/Transition";
import useTallaData from "../../hooks/useTallaData";
import useInsumosData from "../../hooks/useInsumosData";
import { formToCop } from "../../assets/constants.d";
import { toast, ToastContainer } from "react-toastify";
const CatalogoDashboard = () => {
  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 1500,
    cssEase: "linear",
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCatalogo,
    watch,
    formState: { errors: errorsAddCatalogo },
    register: registerCatalogo,
    reset,
    getValues,
    setValue,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const {
    initialFetchAllCatalogos,
    loading,
    fetchAllCatalogos,
    deleteCatalogo,
    updateCatalogos,
    createCatalogo,
    createCatalogoInsumos,
  } = useCatalogoData();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedCatalogo, setSelectedCatalogo] = useState(null);
  const [numberOfInsumos, setNumberOfInsumos] = useState([]);
  const [catalogoToDelete, setCatalogoToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [kindOfTallas, setKindOfTallas] = useState([]);
  console.log(selectedCatalogo);

  const { initialFetchAllCategorias, loading: loadingCategoria } =
    useCategoriaData();
  const { initialFetchAllTallas, loading: loadingTallas } = useTallaData();
  const { initialFetchAllInsumosControlled, loading: loadingInsumos } =
    useInsumosData();
  useEffect(() => {
    const initialFetchCatalogo = async () => {
      const respuesta = await initialFetchAllCatalogos();
      const categoria = await initialFetchAllCategorias();
      const tallas = await initialFetchAllTallas();
      const insumos = await initialFetchAllInsumosControlled();
      if (respuesta.status === 200 && respuesta.data) {
        console.log(respuesta.data.rows);

        setData(respuesta.data.rows);
      }
      if (categoria.status === 200 && categoria.data) {
        setCategorias(categoria.data);
      }
      if (tallas.status === 200 && tallas.data) {
        setTallas(tallas.data);
        setKindOfTallas(
          tallas.data.filter((talla) => talla.tipo === "alfanumérica")
        );
      }
      if (insumos.status === 200 && insumos.data) {
        setInsumos(insumos.data);
      }
    };
    initialFetchCatalogo();
  }, []);
  const handleAddImage = (e) => {
    const file = e.target.files[0];

    if (!file.type.includes("image")) {
      toast.error("¡Solo se permiten imágenes!", {
        toastId: "errorAddingNotAnImage",
        autoClose: 1500,
      });
      return;
    }

    if (imagenes.length === 5) {
      toast.error("¡Máximo 5 imagenes!", {
        toastId: "erroTooManyImages",
        autoClose: 1500,
      });
      return;
    }
    setImagenes((prev) => [...prev, file]);
  };
  useEffect(() => {
    console.log(imagenes);
  }, [imagenes]);

  /// Métodos para CRUD
  const handleEdit = (row) => {
    setSelectedCatalogo(row);
    setNumberOfInsumos(row.insumos);
    reset(row);
    setImagenes(row?.Imagens);
    setOpenModal(true);
  };
  const handleAddInsumo = () => {
    if (numberOfInsumos.length >= insumos?.length)
      return toast.error("¡Ya has agregado todos tus insumos!", {
        toastId: "errorAllInsumos",
        autoClose: 1500,
      });
    setValue(
      `insumo[${numberOfInsumos.length}]`,
      insumos[numberOfInsumos.length]?.id
    );
    setNumberOfInsumos((prev) => (!prev ? [1] : [...prev, prev.length + 1]));
  };
  const handlePreview = (row) => {
    setSelectedCatalogo(row);

    setOpenPreview(true);
  };
  const handleStateInsumo = async (e, id) => {
    const isActive = e.target.checked ? 1 : 2;
    const response = await updateCatalogos(id, { estadoId: isActive });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllCatalogos();

      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data.rows);
      }
    }
  };
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin Categoría";
  };

  const handleAdd = () => {
    const initialBodyCatalogo = {
      producto: "",
      precio: "",
      categoriaId: categorias?.[0].id,
      estadoId: 0,
      tallas: "",
      insumo: [],
      linea: "",
      descripcion: "",
      cantidad_utilizada: [],
    };
    setSelectedCatalogo(initialBodyCatalogo);
    setImagenes([]);
    reset(initialBodyCatalogo);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setValue("imagen", undefined);
    setNumberOfInsumos([]);
    reset();
    setSelectedCatalogo(null);
  };
  const handleSave = async (data) => {
    if (numberOfInsumos.length <= 0)
      return toast.error("¡Debes añadir mínimo un insumo!", {
        toastId: "errorNoInsumosAdded",
        autoClose: 2000,
      });
    if (imagenes.length <= 0)
      return toast.error("¡Debes añadir mínimo una imagen!", {
        toastId: "errorNoImageAdded",
        autoClose: 2000,
      });
    const {
      insumo,
      cantidad_utilizada,
      tallas,
      producto,
      precio,
      linea,
      descripcion,
      categoriaId,
    } = data;
    const tallasNumeros = tallas.map(Number);
    const tallasOrdenadas = tallasNumeros.sort((a, b) => a - b);
    const tallasParsed = tallasOrdenadas.join(",");
    const datosInsumos = [];
    insumo.forEach((insumoId, idx) => {
      datosInsumos.push({
        insumo_id: insumoId,
        cantidad_utilizada: cantidad_utilizada[idx],
      });
    });
    const formDataAddCatalog = new FormData();
    formDataAddCatalog.append("producto", producto);
    formDataAddCatalog.append("precio", precio);
    formDataAddCatalog.append("descripcion", descripcion);
    formDataAddCatalog.append("estadoId", 1);
    formDataAddCatalog.append("categoriaId", categoriaId);
    formDataAddCatalog.append("tallas", tallasParsed);
    formDataAddCatalog.append("linea", linea);
    imagenes.forEach((imagen) => formDataAddCatalog.append("file", imagen));

    const response = selectedCatalogo.id
      ? await updateCatalogos(selectedCatalogo.id, formDataAddCatalog)
      : await createCatalogo(formDataAddCatalog);
    if (response.status === 200 || response.status === 201) {
      console.log(response);

      const id = response.data.data.id;
      const createFichatecnica = await createCatalogoInsumos({
        catalogoId: id,
        datosInsumos,
      });
      const updatedData = await fetchAllCatalogos();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data.rows);
      }
      handleClose();
    } else {
      console.log(response);
    }
  };

  const handleDelete = (id) => {
    const insumo = data.find((insumo) => insumo.id === id);
    setCatalogoToDelete(insumo);
    setOpenDeleteDialog(true);
  };
  const findMaxQuantityInsumo = (id) => {
    const insumo = insumos.find((insumo) => insumo.id === id);
    return insumo?.cantidad;
  };

  const confirmDelete = async () => {
    if (catalogoToDelete.estadoId === 1) {
      setErrorMessage(
        "No se puede eliminar el producto del catálogo porque está activo."
      );
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    const response = await deleteCatalogo(catalogoToDelete.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((insumo) => insumo.id !== catalogoToDelete.id)
      );
      console.log(response);

      setOpenDeleteDialog(false);
      setCatalogoToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCatalogo((prev) => ({ ...prev, [name]: value }));
  };
  // Fin métodos CRUD
  const columns = [
    { field: "producto", headerName: "Nombre", flex: 1 },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      valueGetter: (params) => formToCop(params.row.precio),
    },
    {
      field: "categoriaId",
      headerName: "Categoría",
      flex: 1,
      valueGetter: (params) => getCategoriaNombre(params.row.categoriaId),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }) => (
        <Switch
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.purple[200],
              "&:hover": {
                backgroundColor: alpha(
                  colors.purple[200],
                  theme.palette.action.hoverOpacity
                ),
              },
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.purple[200],
            },
          }}
          color="warning"
          onChange={(e) => {
            handleStateInsumo(e, row.id);
          }}
          checked={row.estadoId == 1}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Box>
          <Button title="ver catálogo" onClick={() => handlePreview(row)}>
            <Eye size={20} color={colors.grey[100]} />
          </Button>
          <Button title="editar" onClick={() => handleEdit(row)}>
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          <Button
            sx={{ marginRight: "10px" }}
            title="borrar"
            onClick={() => handleDelete(row.id)}
          >
            <TrashColor size={20} color={colors.grey[100]} />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
    <br />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ ml: 4 }} fontSize={"40px"}>
          Catálogo
        </Typography>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: colors.purple[400],
            "&:hover": {
              backgroundColor: colors.purple[300],
            },
            color: "white",
            mr: "10px",
            textTransform: "capitalize",
          }}
        >
          Agregar al catálogo
        </Button>
      </Box>
      
      <br />
      <Box
        m="0px 20px"
        p="0px 10px"
        height="56%"
        width="98%"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.purple[500],
            borderBottom: "none",
            color: "white",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[200],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.purple[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {loading ? (
          <Box marginLeft={"175px"}>
            <div class="wrapper">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
            </div>
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </Box>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={handleClose}
      >
        <form onSubmit={handleSaveCatalogo(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedCatalogo?.id ? "Editar Catálogo" : "Agregar al Catálogo"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="producto"
              label="Nombre"
              type="text"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              variant="outlined"
              {...registerCatalogo("producto", {
                required: "El producto del catálogo necesita un nombre.",
                minLength: {
                  message:
                    "¡El nombre del producto debe tener mínimo 4 caracteres!",
                  value: 4,
                },
                maxLength: {
                  message: "¡Máximo permitido 30 caracteres!",
                  value: 30,
                },
              })}
              value={selectedCatalogo?.producto || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.producto?.message}
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              type="text"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              variant="outlined"
              {...registerCatalogo("descripcion", {
                required: "El producto del catálogo necesita una descripción.",
                minLength: {
                  message:
                    "¡La descripción del producto debe tener mínimo 4 caracteres!",
                  value: 4,
                },
                maxLength: {
                  message: "¡Máximo permitido 255 caracteres!",
                  value: 255,
                },
              })}
              value={selectedCatalogo?.descripcion || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.descripcion?.message}
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              type="number"
              fullWidth
              variant="outlined"
              {...registerCatalogo("precio", {
                required: "El precio es requerido",
                pattern: {
                  value: /^[0-9]+$/, // Expresión regular para números
                  message: "Solo se permiten números",
                },
                min: {
                  value: 5000,
                  message: "El precio mínimo de un producto es de $5.000 COP",
                },
                max: {
                  value: 250000,
                  message: "El precio máximo de un producto es de $250.000 COP",
                },
              })}
              value={selectedCatalogo?.precio || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.precio?.message}
            />
            <TextField
              margin="dense"
              name="categoriaId"
              label="Categoría"
              fullWidth
              select
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              variant="outlined"
              {...registerCatalogo("categoriaId", {
                required: "Debes escoger una categoría!",
              })}
              value={
                parseInt(selectedCatalogo?.categoriaId) || categorias[0]?.id
              }
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.categoriaId?.message}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="linea"
              label="Línea"
              fullWidth
              select
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              variant="outlined"
              {...registerCatalogo("linea", {
                required: "Debes escoger una línea!",
              })}
              value={selectedCatalogo?.linea || "básica"}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.linea?.message}
            >
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="especial">Especial</MenuItem>
              <MenuItem value="básica">Básica</MenuItem>
              <MenuItem value="temporada">Temporada</MenuItem>
              <MenuItem value="ecológica">Ecológica</MenuItem>
              <MenuItem value="accesorios">Accesorios</MenuItem>
              <MenuItem value="infantil">Infantil</MenuItem>
              <MenuItem value="deportiva">Deportiva</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </TextField>
            <FormControl
              component="fieldset"
              sx={{
                marginTop: "20px",
              }}
            >
              <FormLabel sx={{ color: `${colors.grey[100]}!important` }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4>Tallas</h4>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <h5>Numéricas</h5>
                    <Switch
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: colors.purple[200],
                          "&:hover": {
                            backgroundColor: alpha(
                              colors.purple[200],
                              theme.palette.action.hoverOpacity
                            ),
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: colors.purple[200],
                          },
                      }}
                      onChange={(e) => {
                        if (e.target.checked)
                          return setKindOfTallas(
                            tallas.filter(
                              (talla) => talla.tipo === "alfanumérica"
                            )
                          );
                        return setKindOfTallas(
                          tallas.filter((talla) => talla.tipo === "numérica")
                        );
                      }}
                      defaultChecked
                      size="small"
                    />
                    <h5>Alfanuméricas</h5>
                  </div>
                </div>
              </FormLabel>
              <FormGroup
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  sx={{ marginLeft: "5px", marginTop: "10px", mx: "auto" }}
                  container
                  spacing={2}
                >
                  {kindOfTallas
                    .sort((a, b) => a.id - b.id)
                    .map((talla) => (
                      <Grid item xs={6} key={talla.id}>
                        <FormControlLabel
                          key={talla.id}
                          control={
                            <Checkbox
                              sx={{
                                color: colors.grey[100],
                                "&.Mui-checked": {
                                  color: colors.purple[300],
                                },
                              }}
                              name="tallas"
                              {...registerCatalogo(`tallas`, {
                                required: "¡Debes elegir mínimo una talla!",
                              })}
                              defaultChecked={
                                selectedCatalogo?.Tallas?.map(
                                  (talla) => talla.id
                                )?.includes(talla.id) || false
                              }
                              onChange={handleInputChange}
                              value={talla.id}
                            />
                          }
                          label={talla.nombre}
                        />
                      </Grid>
                    ))}
                </Grid>
              </FormGroup>
              {errorsAddCatalogo?.tallas && (
                <FormHelperText sx={{ color: "red", fontSize: ".8rem" }}>
                  {errorsAddCatalogo.tallas.message}
                </FormHelperText>
              )}
            </FormControl>
            <DialogTitle sx={{ mt: "10px" }} color={colors.grey[100]}>
              Imagen de referencia
            </DialogTitle>
            <div style={{ width: "100%" }}>
              <label className="subir-img">
                <input
                  onChange={handleAddImage}
                  type="file"
                  accept="image/*"
                  multiple
                />
                <div style={{ width: "100%" }}>
                  {imagenes.length > 0
                    ? `Subir imagen (${imagenes.length} de 5)`
                    : "Subir imagen"}
                </div>
              </label>
              <DialogTitle sx={{ color: "red", fontSize: ".8rem" }}>
                {errorsAddCatalogo?.imagen?.message}
              </DialogTitle>
            </div>
            <div
              style={{
                width: "48%",
                margin: "0 auto",
              }}
            >
              {imagenes.length > 1 ? (
                <Slider {...sliderSettings}>
                  {imagenes.map((imagen, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImagenes((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="image-container"
                    >
                      <img
                        src={
                          imagen.url ? imagen.url : URL.createObjectURL(imagen)
                        }
                        alt={`Imagen ${idx}`}
                        className="image"
                      />
                      <div className="overlay">
                        <TrashColor size={38} color={"#fff"}></TrashColor>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                imagenes.length > 0 && (
                  <div
                    className="image-container"
                    onClick={() => setImagenes([])}
                  >
                    <img
                      src={
                        imagenes[0].url
                          ? imagenes[0].url
                          : URL.createObjectURL(imagenes[0])
                      }
                      alt={`Imagen `}
                      className="image"
                    />
                    <div className="overlay">
                      <TrashColor size={38} color={"#fff"}></TrashColor>
                    </div>
                  </div>
                )
              )}
            </div>
            <DialogTitle
              sx={{
                mt: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
              color={colors.grey[100]}
            >
              <span>
                {insumos.length > 0
                  ? "Añadir insumos"
                  : "¡No tienes insumos registrados en el aplicativo!"}
              </span>{" "}
              {numberOfInsumos.length < insumos?.length && (
                <Button onClick={handleAddInsumo}>
                  <AddRounded size={24} color={"#fff"}></AddRounded>
                </Button>
              )}
            </DialogTitle>
            {numberOfInsumos.length >= 1 ? (
              numberOfInsumos.map((_, idx) => (
                <div
                  style={{ marginTop: "10px" }}
                  key={idx}
                  className="add-insumo-section"
                >
                  <TextField
                    margin="dense"
                    name="insumo"
                    label="Insumo"
                    fullWidth
                    select
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "purple",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "purple",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": {
                          color: "purple",
                        },
                      },
                    }}
                    variant="outlined"
                    {...registerCatalogo(`insumo[${idx}]`, {
                      required: "Debes escoger un insumo!",
                    })}
                    defaultValue={
                      selectedCatalogo?.insumos?.[idx]?.id ||
                      watch(`insumo[${idx}]`)
                    }
                    onChange={(e) => setValue(`insumo[${idx}]`, e.target.value)}
                    FormHelperTextProps={{
                      sx: { color: "red", fontSize: ".8rem" },
                    }}
                    helperText={errorsAddCatalogo?.insumo?.[idx]?.message}
                  >
                    {insumos.map((ins) => (
                      <MenuItem key={ins.id} value={ins.id}>
                        {ins.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    margin="dense"
                    inputProps={{ step: "any" }}
                    name="cantidad_utilizada"
                    label={`Cantidad utilizada (Máximo ${findMaxQuantityInsumo(
                      parseFloat(getValues(`insumo[${idx}]`))
                    )})`}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "purple",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "purple",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": {
                          color: "purple",
                        },
                      },
                    }}
                    type="number"
                    fullWidth
                    variant="outlined"
                    {...registerCatalogo(`cantidad_utilizada[${idx}]`, {
                      required: "¡La cantidad usada es requerida!",
                      pattern: {
                        value: /^\d+(.\d+)?$/, // Expresión regular para números
                        message: "Solo se permiten números",
                      },
                      min: {
                        value: 1,
                        message: "¡La cantidad mínima es de 1!",
                      },
                      max: {
                        value: findMaxQuantityInsumo(
                          parseFloat(watch(`insumo[${idx}]`))
                        ),
                        message: `¡La cantidad máxima es de ${findMaxQuantityInsumo(
                          parseFloat(watch(`insumo[${idx}]`))
                        )}!`,
                      },
                    })}
                    defaultValue={
                      selectedCatalogo?.insumos?.[idx]?.CatalogoInsumos
                        ?.cantidad_utilizada
                    }
                    onChange={(e) =>
                      setValue(`cantidad_utilizada[${idx}]`, e.target.value)
                    }
                    FormHelperTextProps={{
                      sx: { color: "red", fontSize: ".8rem" },
                    }}
                    helperText={
                      errorsAddCatalogo?.cantidad_utilizada?.[idx]?.message
                    }
                  />
                </div>
              ))
            ) : (
              <div>Dale click a agregar un insumo!</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ textTransform: "capitalize" }}
              onClick={handleClose}
              color="error"
            >
              Cancelar
            </Button>
            <Button
              sx={{ textTransform: "capitalize" }}
              type="submit"
              color="success"
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle color={colors.grey[100]}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el producto "
            {catalogoToDelete?.producto}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => setOpenDeleteDialog(false)}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={confirmDelete}
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: 16,
            backgroundColor: colors.grey[900],
          },
        }}
      >
        <DialogTitle sx={{ color: colors.grey[100], paddingBottom: 0 }}>
          Visualización previa
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: 2,
            mt: "20px",
            height: "62vh",
            minWidth: "60vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={1} alignItems="center">
            {/* Imagen del producto */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "80%",
                  borderRadius: "2rem",
                  overflow: "hidden",
                  boxShadow: 3,
                  width: "350px",
                  height: "350px",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
              >
                {selectedCatalogo?.Imagens?.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {selectedCatalogo?.Imagens?.map((imagenPreview) => (
                      <img
                        key={imagenPreview.id}
                        src={imagenPreview.url}
                        onMouseEnter={() => log(imagenPreview)}
                        alt={selectedCatalogo?.producto}
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      ></img>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={selectedCatalogo?.Imagens?.[0]?.url}
                    alt={selectedCatalogo?.producto}
                    style={{ width: "100%", display: "block" }}
                  ></img>
                )}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  {selectedCatalogo?.insumos?.length >= 1 ? (
                    <div>
                      {selectedCatalogo?.insumos?.map((insumo) => (
                        <Typography
                          key={insumo.id}
                          variant="h6"
                          sx={{
                            textAlign: "center",
                            padding: "16px",
                          }}
                        >
                          {`${insumo.nombre}: ${insumo.cantidad}`}
                        </Typography>
                      ))}
                    </div>
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      ¡Sin insumos asociados!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Detalles del producto */}
            <Grid item xs={12} sm={6}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedCatalogo?.producto}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formToCop(selectedCatalogo?.precio)} COP
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {getCategoriaNombre(selectedCatalogo?.categoriaId)}
              </Typography>

              <Typography variant="body1" color="grey.300" marginTop={2}>
                {selectedCatalogo?.descripcion}
              </Typography>

              {/* Tallas y precio */}
              <Grid container spacing={1} marginTop={3}>
                {selectedCatalogo?.Tallas?.map((talla) => (
                  <Grid item key={talla.id} xs={4}>
                    <Chip
                      label={talla.nombre}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        backgroundColor: colors.purple[300],
                        color: "white",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingRight: 3 }}>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => setOpenPreview(false)}
            color="error"
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
      >
        <DialogTitle color={colors.grey[100]}>Error</DialogTitle>
        <DialogContent>
          <Typography color={colors.grey[100]}>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => setOpenErrorModal(false)}
            color="error"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default CatalogoDashboard;
