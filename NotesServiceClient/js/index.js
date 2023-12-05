import { apiComments, apiPoints } from "./api.js"
import { URLS } from "../config.js";
import { Note } from "./note.js"
import { Comment } from "./comment.js";

$(document).ready( () => {
    let notes = [];
    let container =  document.getElementById('konva-holder');
    console.log(container.offsetWidth);
    console.log(window.innerHeight);

    let stage = new Konva.Stage({
        container: "konva-holder",  
        width: container.offsetWidth,
        height: window.innerHeight,
        fill: 'gray'
    });

    let layer = new Konva.Layer();

    stage.add(layer);

    let selectedPoint;

    stage.on('pointerdblclick', function () {
        let pointerPos = stage.getPointerPosition();
        let radius = document.getElementById('radius').value;
        let color = document.getElementById('point-color').value;

        apiPoints.createPoint(URLS.dev, {
            x: pointerPos.x,
            y: pointerPos.y,
            radius: radius,
            color: color        
        }).then((response) => response.json()).then(data => {
            notes[data.id] = new Note(data.id, data.x, data.y, data.radius, data.color);

            let note = new Konva.Group({
                draggable: true,
                id: data.id
            });

            note.on('dragstart', () => {
                note.findOne(".circle").fire('pointerclick');
                console.log(selectedPoint);
            });

            note.on('dragend', (e) => {
                let point = {
                    id: selectedPoint.getParent().id(),
                    x: selectedPoint.x() + e.target.x(),
                    y: selectedPoint.y() + e.target.y(),
                    radius: selectedPoint.radius(),
                    color: selectedPoint.fill()
                }

                apiPoints.updatePoint(URLS.dev, point).then((response) => { 
                    if (response.ok)
                    {
                        notes[selectedPoint.getParent().id()].update(point);
                    }
                });
            });

            let circle = new Konva.Circle({
                x: data.x,
                y: data.y,
                radius: data.radius,
                fill: data.color,
                stroke: 'black',
                strokeWidth: 0,
                name: 'circle'
            });

            circle.on('pointerdblclick', function () {
                apiPoints.deletePoint(URLS.dev, {
                    id: this.getParent().id()
                });
                delete notes[this.getParent().id()];
                console.log(notes);
                this.getParent().destroy()
            });
        
            circle.on('pointerclick', function () {
                selectedPoint?.strokeWidth(0);
                selectedPoint = this;
                this.strokeWidth(5);

                let paramsWindow = document.getElementById("selected-point-params");
        
                paramsWindow.hidden = false;
                paramsWindow.querySelector("#selected-point-radius").value = this.radius();
                paramsWindow.querySelector("#selected-point-color").value = this.fill();

                console.log(notes[selectedPoint.getParent().id()]);
                $("#comments").kendoGrid
                $("#comments").kendoGrid({
                    dataSource: notes[selectedPoint.getParent().id()].comments,
                    height: 0,
                    columns: [{
                        field: "text",
                        title: "Comments",
                        width: 0
                    }],
                    editable: "incell",
                    edit: (e) => {
                        let input = $(e.container.find('input'))
                        console.log(input[0].value);
                    }
                });
            });

            note.add(circle);

            layer.add(note);

            });

    })

    window.addEventListener('click', () => {
        menuNode.style.display = 'none';
    });

    let currentShape;
    let menuNode = document.getElementById('menu');

    document.getElementById('delete-button').addEventListener('click', () => {
        currentShape.destroy();
    });

    stage.on('contextmenu', function (e) {
        e.evt.preventDefault();
        if (e.target === stage) {
            return;
        }
        currentShape = e.target;
        menuNode.style.display = 'initial';
        var containerRect = stage.container().getBoundingClientRect();
        menuNode.style.top =
        containerRect.top + stage.getPointerPosition().y + 10 + 'px';
        menuNode.style.left =
        containerRect.left + stage.getPointerPosition().x + 10 + 'px';
    });

    document.getElementById('save-changes').addEventListener('click', () => {
        let color = document.getElementById('selected-point-color').value;
        let radius = document.getElementById('selected-point-radius').value;

        apiPoints.updatePoint(URLS.dev, {
            id: selectedPoint.getParent().id(),
            x: selectedPoint.x(),
            y: selectedPoint.y(),
            radius: radius,
            color: color
        }).then((response) => {
            if (response.ok)
            {
                selectedPoint.fill(color);
                selectedPoint.radius(radius);
            }
        });
    });

    document.getElementById('add-comment').addEventListener("click", () => {
        let commentText = document.getElementById('comment-text').value;
        let commentColor = document.getElementById('comment-color').value;

        apiComments.createComment(URLS.dev, {
            text: commentText,
            Color: commentColor,
            pointId: selectedPoint.getParent().id(),
        }).then((response) => {
            if (response.ok)
            {
                return response.json();
            }
            else
            {

            }}).then((data) => { 
                let comment = new Comment(data.id, data.text, data.color);                
                notes[selectedPoint.getParent().id()].addComment(comment);

                let text = new Konva.Text({
                    text: commentText,
                    fontSize: 16,
                    padding: 5,
                    align: 'center'
                });
        
                text.x(selectedPoint.getAttr('x') - text.width() / 2);
                text.y(selectedPoint.y() + selectedPoint.radius() + 10
                + (selectedPoint.getParent().children.length - 1) * text.height() / 2) + 5;
        
                selectedPoint.getParent().add(new Konva.Rect({
                    x: text.x(),
                    y: text.y(),
                    width: text.width(),
                    height: text.height(),
                    strokeWidth: 2,
                    stroke: 'black',
                    fill: commentColor
                }));
                selectedPoint.getParent().add(text);
        
                layer.draw();
            });
    });
});
