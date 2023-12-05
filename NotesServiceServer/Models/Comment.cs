using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace NotesServiceServer.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Color { get; set; }

        public int PointId { get; set; }
        public Point? Point { get; set; }
    }
}
