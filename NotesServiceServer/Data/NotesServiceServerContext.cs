using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NotesServiceServer.Models;

namespace NotesServiceServer.Data
{
    public class NotesServiceServerContext : DbContext
    {
        public NotesServiceServerContext (DbContextOptions<NotesServiceServerContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: "db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Point>()
                .HasMany(c => c.Comments)
                .WithOne(p => p.Point)
                .HasForeignKey(c => c.PointId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<NotesServiceServer.Models.Point> Points { get; set; } = default!;

        public DbSet<NotesServiceServer.Models.Comment> Comments { get; set; }
    }
}
