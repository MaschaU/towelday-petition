(function() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let sig = document.getElementById("signature");
    context.strokeStyle = "white";
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.shadowBlur = 2;
    context.shadowColor = "white";

    let isDrawing = false;
    function draw(e) {
        if (!isDrawing) return;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
    }
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", e => {
        isDrawing = true;
        context.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseout", () => (isDrawing = false));

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        sig.value = canvas.toDataURL();
        console.log(sig.value);
    });
})();