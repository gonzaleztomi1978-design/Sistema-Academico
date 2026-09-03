using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SistemaAcademico.Application.Servicios;
using SistemaAcademico.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ===== Base de datos =====
builder.Services.AddDbContext<AppDbContext>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("SistemaAcademico")));

// ===== Servicios de la capa Application =====
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UsuarioService>();

// ===== Autenticación JWT =====
var claveJwt = builder.Configuration["Jwt:Clave"]
    ?? throw new InvalidOperationException("Falta configurar Jwt:Clave en appsettings.json");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones =>
    {
        opciones.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Emisor"],
            ValidAudience = builder.Configuration["Jwt:Audiencia"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(claveJwt)),
        };
    });
builder.Services.AddAuthorization();

// ===== CORS: permite que el frontend React (Vite) consuma la API =====
builder.Services.AddCors(opciones =>
{
    opciones.AddPolicy("PermitirFrontend", politica =>
        politica.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opciones =>
{
    opciones.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sistema Académico — Instituto Superior Cura Gabriel Brochero",
        Version = "v1",
    });
    opciones.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Pegar el token que devuelve POST /api/auth/login (sin el prefijo 'Bearer ').",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });
    opciones.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
});

var app = builder.Build();

// Aplica las migraciones pendientes y carga los datos iniciales al arrancar,
// para que cualquier integrante del equipo tenga la base lista con solo ejecutar la API.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DbSeeder.Seed(db);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("PermitirFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
