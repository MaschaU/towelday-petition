
(function() {
    console.log("Check");
    const paintCanvas = document.querySelector(".signature");
    const context = paintCanvas.getContext( '2d' );
    context.lineCap = 'round';
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 5;

    const sig = document.getElementById("sig");

    let x = 0, y = 0;
    let isMouseDown = false;

    const stopDrawing = () => { isMouseDown = false; };
    const startDrawing = event => {
        isMouseDown = true;
        [x, y] = [event.offsetX, event.offsetY];
    };
    const drawLine = event => {
        if ( isMouseDown ) {
            const newX = event.offsetX;
            const newY = event.offsetY;
            context.beginPath();
            context.moveTo( x, y );
            context.lineTo( newX, newY );
            context.stroke();
            [x, y] = [newX, newY];
            var dataURL = paintCanvas.toDataURL();
            sig.value = dataURL;
        }
    };

    paintCanvas.addEventListener( "mousedown", startDrawing );
    paintCanvas.addEventListener( "mousemove", drawLine );
    paintCanvas.addEventListener( "mouseup", stopDrawing);
    paintCanvas.addEventListener( "mouseout", stopDrawing );

    /*paintCanvas.addEventListener("touchstart", startDrawing);
    paintCanvas.addEventListener("touchmove", drawLine);
    paintCanvas.addEventListener("touchend", stopDrawing);
    paintCanvas.addEventListener("touchcancel", stopDrawing);*/
}());