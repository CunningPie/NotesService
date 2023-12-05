/* eslint-disable import/extensions */
import { apiComments, apiPoints } from './api.js';
import { URLS } from '../config.js';
import { Note } from './note.js';
import { Comment } from './comment.js';

$(document).ready(() => {
  const notes = [];
  const container = document.getElementById('konva-holder');
  let selectedPoint;

  const stage = new Konva.Stage({
    container: 'konva-holder',
    width: container.offsetWidth,
    height: window.innerHeight,
    fill: 'gray',
  });

  const layer = new Konva.Layer();

  stage.add(layer);

  const commentAttributes = (data) => ({ style: `background-color: ${data.color}` });

  $('#comments').kendoGrid({
    height: 0,
    columns: [{
      field: 'text',
      title: 'Комментарии',
      width: 0,
    }, {
      field: 'color',
      title: 'Цвет фона',
      width: 0,
      attributes: commentAttributes,
    }],
    editable: 'incell',
    save: (e) => {
      const regexp = /^#{1}(\d|[a-f]){6}$/;
      if (regexp.test(e.values.color)) {
        if (e.values.color) {
          const commentRect = selectedPoint.getParent().findOne(`#commentRect${e.model.id}`);
          commentRect.fill(e.values.color);
          const edit = notes[selectedPoint.getParent().id()].comments.filter((c) => c.id == e.model.id)[0];
          edit.color = e.values.color;
        }
      } else {
        e.preventDefault();
      }

      if (e.values.text) {
        const commentText = selectedPoint.getParent().findOne(`#comment${e.model.id}`);
        commentText.text(e.values.text);
        const edit = notes[selectedPoint.getParent().id()].comments.filter((c) => c.id == e.model.id)[0];
        edit.text = e.values.text;
      }
    },
  });

  stage.on('dblclick', () => {
    const pointerPos = stage.getPointerPosition();
    const radius = document.getElementById('radius').value;
    const color = document.getElementById('point-color').value;

    apiPoints.createPoint(URLS.dev, {
      x: pointerPos.x,
      y: pointerPos.y,
      radius,
      color,
    }).then((response) => response.json()).then((data) => {
      notes[data.id] = new Note(data.id, data.x, data.y, data.radius, data.color);

      const note = new Konva.Group({
        draggable: true,
        id: data.id,
      });

      note.on('dragstart', () => {
        note.findOne('.circle').fire('click');
      });

      note.on('dragend', (e) => {
        const point = {
          id: selectedPoint.getParent().id(),
          x: selectedPoint.x() + e.target.x(),
          y: selectedPoint.y() + e.target.y(),
          radius: selectedPoint.radius(),
          color: selectedPoint.fill(),
        };

        apiPoints.updatePoint(URLS.dev, point).then((response) => {
          if (response.ok) {
            notes[selectedPoint.getParent().id()].update(point);
          }
        });
      });

      const circle = new Konva.Circle({
        x: data.x,
        y: data.y,
        radius: data.radius,
        fill: data.color,
        stroke: 'black',
        strokeWidth: 0,
        name: 'circle',
      });

      circle.on('dblclick', function () {
        apiPoints.deletePoint(URLS.dev, {
          id: this.getParent().id(),
        });
        delete notes[this.getParent().id()];

        const paramsPanel = document.getElementById('selected-point-params');
        paramsPanel.hidden = true;

        const commentsPanel = document.getElementById('comments');
        commentsPanel.hidden = true;

        this.getParent().destroy();
      });

      circle.on('click', function () {
        selectedPoint?.strokeWidth(0);
        selectedPoint = this;
        this.strokeWidth(5);

        const paramsPanel = document.getElementById('selected-point-params');
        paramsPanel.hidden = false;
        paramsPanel.querySelector('#selected-point-radius').value = this.radius();
        paramsPanel.querySelector('#selected-point-color').value = this.fill();

        const commentsPanel = document.getElementById('comments');
        commentsPanel.hidden = false;

        const grid = $('#comments').data('kendoGrid');
        grid.dataSource.data(notes[this.getParent().id()].comments);
      });

      note.add(circle);
      layer.add(note);
    });
  });

  document.getElementById('save-changes').addEventListener('click', () => {
    const color = document.getElementById('selected-point-color').value;
    const radius = +document.getElementById('selected-point-radius').value;
    const radiusDelta = selectedPoint.radius() - radius;

    apiPoints.updatePoint(URLS.dev, {
      id: selectedPoint.getParent().id(),
      x: selectedPoint.x(),
      y: selectedPoint.y(),
      radius,
      color,
    }).then((response) => {
      if (response.ok) {
        selectedPoint.fill(color);
        selectedPoint.radius(radius);
      } else {
        throw new Error(`HTTP status ${response.status}`);
      }
    });

    selectedPoint.getParent().children.filter((e) => e.name() !== 'circle').forEach((element) => {
      element.y(element.y() - radiusDelta);
    });
  });

  document.getElementById('add-comment').addEventListener('click', () => {
    const commentText = document.getElementById('comment-text').value;
    const commentColor = document.getElementById('comment-color').value;

    apiComments.createComment(URLS.dev, {
      text: commentText,
      Color: commentColor,
      pointId: selectedPoint.getParent().id(),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`HTTP status ${response.status}`);
    }).then((data) => {
      const comment = new Comment(data.id, data.text, data.color);
      notes[selectedPoint.getParent().id()].addComment(comment);

      const text = new Konva.Text({
        text: commentText,
        fontSize: 16,
        padding: 5,
        align: 'center',
        id: `comment${data.id}`,
      });

      text.x(selectedPoint.getAttr('x') - text.width() / 2);
      text.y(selectedPoint.y() + selectedPoint.radius() + 10
                + ((selectedPoint.getParent().children.length - 1) * text.height()) / 2);

      selectedPoint.getParent().add(new Konva.Rect({
        x: text.x(),
        y: text.y(),
        width: text.width(),
        height: text.height(),
        strokeWidth: 2,
        stroke: 'black',
        fill: commentColor,
        id: `commentRect${data.id}`,
      }));
      selectedPoint.getParent().add(text);

      layer.draw();
    });
  });
});
