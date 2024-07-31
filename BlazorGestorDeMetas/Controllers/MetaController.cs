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
    public class MetaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MetaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("ConexionServidor")]
        public async Task<ActionResult<string>> GetEjemplo()
        {
            return "Conectado con el servidor correctamente";
        }

        [HttpGet("ConexionMeta")]
        public async Task<ActionResult<string>> GetConexionMeta()
        {
            try
            {
                var respuesta = await _context.Meta.ToListAsync();
            }
            catch (Exception ex)
            {
                return $"Error al conectar con la tabla Meta:  {ex.Message}";
            }
            return "Conectado con la tabla Meta correctamente";
        }

        [HttpGet("ObtenerMetas")]
        public IActionResult GetMetas()
        {
            //var metas = await _context.Meta.ToListAsync();
            //return metas;
            var query = @"
            SELECT m.IdMeta, m.Nombre, m.Fecha, m.Estatus, 
            CAST(ROUND(COALESCE((SUM(CASE WHEN t.Estatus = 1 THEN 1 ELSE 0 END) * 100.0) / 
            CASE WHEN COUNT(t.IdTarea) = 0 THEN 1 ELSE COUNT(t.IdTarea) END, 0), 2) AS FLOAT) AS Porcentaje 
            FROM dbo.Meta m 
            LEFT JOIN dbo.Tarea t ON m.IdMeta = t.IdMeta 
            GROUP BY m.IdMeta, m.Nombre, m.Fecha, m.Estatus";

            var metas = _context.Set<MetaWithPercentage>().FromSqlRaw(query).ToList();

            return Ok(metas);
        }

        [HttpPost("AddMeta/{newMeta}")]
        public async Task<ActionResult<string>> AddMeta(string newMeta)
        {

            string currentDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            // Verificamos si el nombre ya existe
            bool metaExists = await _context.Meta.AnyAsync(m => m.Nombre == newMeta);
            if (metaExists)
            {
                return new JsonResult(new { success = false, message = "La meta ya existe" });
            }

            var newMetaEntity = new Meta
            {
                Nombre = newMeta,
                Fecha = DateTime.Parse(currentDate),
                Estatus = 1
            };

            try
            {
                _context.Meta.Add(newMetaEntity);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Meta agregada correctamente" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error al agregar la meta: {ex.Message}" });
            }
        }

        [HttpPost("UpdateMeta/{IdMeta}/{Nombre}/")]
        public async Task<ActionResult<string>> UpdateMeta(int IdMeta, string Nombre)
        {

            // Verificamos si el nuevo nombre no se encontrará repetido
            bool nameInUse = await _context.Meta.AnyAsync(m => m.Nombre == Nombre && m.IdMeta != IdMeta);
            if (nameInUse)
            {
                return new JsonResult(new { success = false, message = "El nombre de la meta ya está en uso por otra meta" });
            }

            var existingMeta = await _context.Meta.FindAsync(IdMeta);
            existingMeta.Nombre = Nombre;

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

        [HttpPost("DeleteMeta/{IdMeta}")]
        public async Task<IActionResult> DeleteMeta(int IdMeta)
        {
            var existingMeta = await _context.Meta.FindAsync(IdMeta);

            if (existingMeta == null)
            {
                return NotFound(new { success = false, message = "Meta no encontrada" });
            }

            _context.Meta.Remove(existingMeta);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Meta eliminada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error al eliminar la meta: {ex.Message}" });
            }
        }

    }
}
