function init() {
    //loadTareasTable();
} 

function Add_Meta() {
    var metaName = $("#metaName").val();
    var url = "https://localhost:44356/api/Meta/AddMeta/" + encodeURIComponent(metaName) ;

    if (metaName.trim() !== "") {
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            location.reload();
                        }
                    });
                    $("#addMetaModal").modal("hide");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.message
                    });
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!",
                    footer: error
                });
            }
        });
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El nombre de la meta no puede quedar vacio"
        });
    }
}

function Add_Tarea() {
    var tareaName = $("#tareaName").val();
    var IdMeta = $("#hiddenIdMeta").val();
    var IdDesc = $("#tareaDesc").val();
    
    var url = "https://localhost:44356/api/Tarea/AddTarea/" + IdMeta + "/" + encodeURIComponent(tareaName) + "/" + encodeURIComponent(IdDesc);
    if (tareaName.trim() !== "" && IdDesc.trim() !== ""){
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    recargarTablaTareas();
                    $("#addTareaModal").modal("hide");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.message
                    });
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!",
                    footer: error
                });
            }
        });
        var tareaName = $("#tareaName").val("");
        var IdDesc = $("#tareaDesc").val("");
        $("#addTareaModal").hide();
        
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Los campos de nombre y descripción de la tarea no puede quedar vacios"
        });
    }
}

function Eliminar_Meta(IdMeta, NombreMeta) {
    Swal.fire({
        title: "Está seguro?",
        text: "Confirma que quiere eliminar la meta: " + NombreMeta + "?!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Acepto eliminar el registro!"
    }).then((result) => {
        if (result.isConfirmed) {

            var url = "https://localhost:44356/api/Meta/DeleteMeta/" + IdMeta;

            $.ajax({
                url: url,
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                location.reload(true);
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response.message
                        });
                    }
                    location.reload(true);
                },
                error: function (xhr) {
                    var response = xhr.responseJSON;
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response ? response.message : "Algo salió mal!"
                    });
                }
            });
        }
    });
}
function editarTarea(IdTarea) {

    $("#hiddenIdTarea").val(IdTarea);

    $("#ChangeTareaModal").modal("show");
}


function ModificaNombreTarea() {



    var IdTarea = $("#hiddenIdTarea").val();
    var newName = $("#newTareaName").val();
    var IdMeta = $("#hiddenIdMeta").val();
    
    var url = "https://localhost:44356/api/Tarea/UpdateTarea/" + IdMeta + "/" + IdTarea + "/" + encodeURIComponent(newName);

    if (newName.trim() !== "") {
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Nombre modificado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log("Actualización exitosa:", response);
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!",
                    footer: error.responseText || error.statusText || "Error desconocido"
                });
                console.error("Error al actualizar el nombre:", error);
            }
        });

        recargarTablaTareas();
        $("#ChangeTareaModal").modal("hide");
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El nombre de la tarea no puede quedar vacio"
        });
    }
};

function eliminarTarea(IdTarea) {
    Swal.fire({
        title: "Está seguro?",
        text: "Confirma que quiere eliminar la tarea?!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Acepto elimninar el registro!"
    }).then((result) => {
        if (result.isConfirmed) {

            var url = "https://localhost:44356/api/Tarea/DeleteTarea/" + IdTarea;

            $.ajax({
                url: url,
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function (response) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Tarea eliminada exitosamente",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    recargarTablaTareas();
                },
                error: function (error) {

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo salió mal!",
                        footer: error
                    });
                }
            });
        }
    });
};

function recargarTablaTareas(IdMeta, MetaName) {
    var table = $('#tabTareas').DataTable();
    table.ajax.reload(null, false);
}

function ChangeMetaModal() {
    var NombreMeta = $("#newName").val();
    var IdMeta = $("#hiddenId").val();

    var url = "https://localhost:44356/api/Meta/UpdateMeta/" + IdMeta + "/" + encodeURIComponent(NombreMeta);
    if (NombreMeta.trim() !== "") {
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Meta modificada exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        location.reload();
                    }
                });
                console.log("Actualización exitosa:", response);
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!",
                    footer: error.responseText || error.statusText || "Error desconocido"
                });
            }
        });
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El nombre de la meta no puede quedar vacio"
        });
    }

};

function Modificar_Meta(IdMeta, NombreMeta) {


    $("#newName").val(NombreMeta);
    $("#hiddenId").val(IdMeta);

    $("#ChangeMetaModal").modal("show");
}

/*function loadTareasTable() {


    $('#tabTareas').DataTable({
        "processing": true,
        "ajax": {
            "url": 'http://localhost:5281/api/TodoApp/GetTarea?IdMeta=' + IdMeta,
            "type": "GET",
            "dataType": "json",
            "dataSrc": "data",
            "error": function (e) {
                alert("Error al cargar los datos de la tabla: " + e.responseText);
            }
        },
        "columns": [
            { "data": "NombreTarea" },
            { "data": "Descripcion" },
            {
                "data": "Fecha",
                "render": function (data) {
                    return new Date(data).toLocaleDateString();  // Formatear fecha si es necesario
                }
            },
            { "data": "Fecha" },  // Esto debería ser la fecha de fin si se proporciona
            {
                "data": null,  // Acciones personalizadas
                "render": function (data, type, row) {
                    return ' <button class="text-primary mr-2"  onclick="editarTarea(' + data.IdTarea + ')"> <i class="fas fa-pencil-alt"></i></button>' +
                        ' <button class="text-danger mr-2"  onclick="eliminarTarea(' + data.IdTarea + ')" class="btn btn-danger btn-sm ml-2"><i class="fas fa-trash"></i></button>';
                }
            }
        ],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        },
        "bDestroy": true,
        "iDisplayLength": 5,
        "order": [[0, "desc"]],
        "searching": false
    });
};*/


function ShowTareas(IdMeta, MetaName) {

    $('#addTareabutton').prop('disabled', false);
    $('#hiddenIdMeta').val(IdMeta);
    $('#lagelMetaNameTareaModal').text(MetaName);

    $('#tabTareas').DataTable({
        "processing": true,
        "ajax": {
            "url": 'https://localhost:44356/api/Tarea/GetTarea/' + IdMeta,
            "type": "GET",
            "dataType": "json",
            "dataSrc": "data",
            "error": function (e) {
                alert("Error al cargar los datos de la tabla: " + e.responseText);
            }
        },
        "columns": [
            {
                "data": "prioridad",
                "render": function (data, type, row) {
                    var iconClass = data === 1 ? 'fas fa-star text-warning' : 'fas fa-star text-secondary';
                    return '<i class="' + iconClass + '" onclick="CambiarPrioridad(' + row.idTarea + ')"></i>';
                }
            },
            { "data": "nombreTarea" },
            { "data": "descripcion" },
            {
                "data": "fecha",
                "render": function (data) {
                    return new Date(data).toLocaleDateString();
                }
            },
            {
                "data": "estatus",
                "render": function (data, type, row) {
                    if (data === 1) {
                        return '<button class="btn btn-success">Completado</button>';
                    } else {
                        return '<button class="btn btn-secondary" onclick="CompletarTarea(' + row.idTarea + ')">Completar</button>';
                    }
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    return ' <button class="text-primary mr-2 buttonshadowInside"  onclick="editarTarea(' + data.idTarea + ')" > <i class="fas fa-pencil-alt"></i></button>' +
                        ' <button class="text-danger mr-2 buttonshadowInside"  onclick="eliminarTarea(' + data.idTarea + ')" class="btn btn-danger btn-sm ml-2"><i class="fas fa-trash"></i></button>';
                }
            }
        ],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        },
        "bDestroy": true,
        "iDisplayLength": 5,
        "order": [[0, "desc"]],
        "searching": false
    });
}

function CambiarPrioridad(IdTarea) {
    var url = "https://localhost:44356/api/Tarea/CambiarPrioridad/" + (IdTarea);

    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Prioridad modificada exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
            console.log("Actualización exitosa:", response);
            recargarTablaTareas();
        },
        error: function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo salió mal!",
                footer: error.responseText || error.statusText || "Error desconocido"
            });
            console.error("Error al actualizar la tarea:", error);
        }
    });

}

function CompletarTarea(IdTarea) {
    var url = "https://localhost:44356/api/Tarea/CompletarTarea/" + (IdTarea);

    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Usted ha marcado como completada exitosamente la tarea",
                showConfirmButton: false,
                timer: 1500
            });
            console.log("Actualización exitosa:", response);
            recargarTablaTareas();
        },
        error: function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo salió mal!",
                footer: error.responseText || error.statusText || "Error desconocido"
            });
            console.error("Error al actualizar la tarea:", error);
        }
    });

    recargarTablaTareas();

}


// Call the init function when the script loads
init();