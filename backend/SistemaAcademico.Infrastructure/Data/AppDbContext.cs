using Microsoft.EntityFrameworkCore;
using SistemaAcademico.Domain.Entidades;

namespace SistemaAcademico.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opciones) : base(opciones)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<RolPermiso> RolesPermisos => Set<RolPermiso>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entidad =>
        {
            entidad.Property(u => u.NombreUsuario).HasMaxLength(50).IsRequired();
            entidad.Property(u => u.Email).HasMaxLength(100).IsRequired();
            entidad.Property(u => u.Nombre).HasMaxLength(50).IsRequired();
            entidad.Property(u => u.Apellido).HasMaxLength(50).IsRequired();
            entidad.HasIndex(u => u.NombreUsuario).IsUnique();
            entidad.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Rol>(entidad =>
        {
            entidad.Property(r => r.Nombre).HasMaxLength(50).IsRequired();
            entidad.Property(r => r.Descripcion).HasMaxLength(200);
            entidad.HasIndex(r => r.Nombre).IsUnique();
        });

        modelBuilder.Entity<Permiso>(entidad =>
        {
            entidad.Property(p => p.Codigo).HasMaxLength(100).IsRequired();
            entidad.Property(p => p.Descripcion).HasMaxLength(200);
            entidad.HasIndex(p => p.Codigo).IsUnique();
        });

        modelBuilder.Entity<RolPermiso>(entidad =>
        {
            entidad.HasKey(rp => new { rp.RolId, rp.PermisoId });
            entidad.HasOne(rp => rp.Rol)
                   .WithMany(r => r.RolPermisos)
                   .HasForeignKey(rp => rp.RolId);
            entidad.HasOne(rp => rp.Permiso)
                   .WithMany(p => p.RolPermisos)
                   .HasForeignKey(rp => rp.PermisoId);
        });
    }
}
