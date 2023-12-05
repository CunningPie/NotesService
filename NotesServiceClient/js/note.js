export class Note {
  comments = [];

  constructor(id, x, y, radius, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  addComment(comment) {
    this.comments.push(comment);
  }

  update(args) {
    this.id = args.id;
    this.x = args.x;
    this.y = args.y;
    this.radius = args.radius;
    this.color = args.color;
  }
}
