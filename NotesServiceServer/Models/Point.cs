using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace NotesServiceServer.Models
{
    public class Point
    {
        public int Id { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public float Radius { get; set; }

        public string Color { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
