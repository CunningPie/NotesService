export class Request {
  constructor() {
  }

  createPoint(data) {
    apiPoints.createPoint(URLS.dev, {
      x: data.x,
      y: data.y,
      radius: data.radius,
      color: data.color,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`HTTP status ${response.status}`);
    });
  }

  deletePoint(data) {
    apiPoints.deletePoint(URLS.dev, {
      id: data.id,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
    });
  }

  updatePoint(data) {
    apiPoints.updatePoint(URLS.dev, {
      id: data.id,
      x: data.x,
      y: data.y,
      radius: data.radius,
      color: data.color,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`HTTP status ${response.status}`);
    });
  }

  createComment(data) {
    apiComments.createComment(URLS.dev, {
      text: data.text,
      color: data.color,
      pointId: data.id,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`HTTP status ${response.status}`);
    });
  }
}
