using BlazorGestorDeMetas.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using GestorDeMetas.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BlazorGestorDeMetas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TareaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetTarea/{idMeta}")]
        public IActionResult GetTarea(int idMeta)
        {
            var query = @"SELECT IdTarea, IdMeta, NombreTarea, Descripcion, Fecha, Estatus, Prioridad FROM dbo.Tarea WHERE IdMeta = {0}";
            var tareas = _context.Set<Tarea>().FromSqlRaw(query, idMeta).ToList();

            //return Ok(tareas);
            return Ok(new { data = tareas });
        }

        [HttpPost("AddTarea/{IdMeta}/{tareaName}/{IdDesc}")]
        public async Task<ActionResult<string>> AddTarea(int IdMeta,string tareaName, string IdDesc)
        {

            // Verificar si la tarea ya existe en la meta usando Entity Framework
            bool tareaExists = await _context.Tarea.AnyAsync(t => t.NombreTarea == tareaName && t.IdMeta == IdMeta);
            if (tareaExists)
            {
                return new JsonResult(new { success = false, message = "La tarea ya existe en la meta, intente con una nueva tarea" });
            }

            //Creacion de una nueva tareaa
            var newTareaEntity = new Tarea
            {
                IdMeta = IdMeta,
                NombreTarea = tareaName,
                Descripcion = IdDesc,
                Fecha = DateTime.Now,
                Estatus = 0,
                Prioridad = 0
            };

            try
            {
                // Insertamoss el registro
                _context.Tarea.Add(newTareaEntity);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Tarea agregada correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new {success = false, message = $"Error al agregar la tarea:{ex.Message}" });
            }
        }

        // DTO para la tarea
        public class TareaDto
        {
            public string NombreTarea { get; set; }
            public string Descripcion { get; set; }
            public int IdMeta { get; set; }
        }

        [HttpPost("UpdateTarea/{IdMeta}/{IdTarea}/{NombreTarea}")]
        public async Task<ActionResult<string>> UpdateTarea(int IdMeta, int IdTarea, string NombreTarea)
        {

            // Verificamos si el nuevo nombre no se encontrará repetido
            bool nameInUse = await _context.Tarea.AnyAsync(m => m.NombreTarea == NombreTarea && m.IdMeta == IdMeta);
            if (nameInUse)
            {
                return new JsonResult(new { success = false, message = "El nombre de la meta ya está en uso por otra tarea" });
            }

            var existingMeta = await _context.Tarea.FindAsync(IdTarea);
            // Actualizar el nombre de la meta
            existingMeta.NombreTarea = NombreTarea;

            try
            {
                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, message = "Meta actualizada correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error al actualizar la meta: {ex.Message}" });
            }
        }

        [HttpPost("DeleteTarea/{IdTarea}")]
        public async Task<ActionResult<string>> DeleteTarea(int IdTarea)
        {
            // Buscar la meta existente por Tarea
            var existingTarea = await _context.Tarea.FindAsync(IdTarea);

            // Eliminar la meta
            _context.Tarea.Remove(existingTarea);

            try
            {
                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, message = "Tarea eliminada correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error al eliminar la Tarea: {ex.Message}" });
            }
        }
        
        [HttpPost("CambiarPrioridad/{IdTarea}")]
        public async Task<ActionResult<string>> CambiarPrioridad(int IdTarea)
        {
            // Buscar la tarea existente por IdTarea
            var existingTarea = await _context.Tarea.FindAsync(IdTarea);
            if (existingTarea == null)
            {
                return new JsonResult(new { success = false, message = "La tarea no existe" });
            }

            // Actualizar el campo Estatus a 1
            if (existingTarea.Prioridad == 1)
            {
                existingTarea.Prioridad = 0;
            }
            else
            {
                existingTarea.Prioridad = 1;
            }

            try
            {
                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, message = "La prioridad de la tarea fue cambiada correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error al actualizar la prioridad de la tarea: {ex.Message}" });
            }
        }

        [HttpPost("CompletarTarea/{IdTarea}")]
        public async Task<ActionResult<string>> CompletarTarea(int IdTarea)
        {
            // Buscamos la tarea existente por el IdTarea
            var existingTarea = await _context.Tarea.FindAsync(IdTarea);
            if (existingTarea == null)
            {
                return new JsonResult(new { success = false, message = "La tarea no existe" });
            }

            existingTarea.Estatus = 1;

            try
            {
                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, message = "Estatus de la tarea actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error al actualizar el estatus de la tarea: {ex.Message}" });
            }
        }
    }
}
