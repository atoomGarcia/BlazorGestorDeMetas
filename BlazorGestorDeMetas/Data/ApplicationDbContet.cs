using GestorDeMetas.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlazorGestorDeMetas.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }


        public DbSet<Meta> Meta { get; set; }
        public DbSet<Tarea> Tarea { get; set; }

        public DbSet<MetaWithPercentage> MetaWithPercentage { get; set; }
    }
}