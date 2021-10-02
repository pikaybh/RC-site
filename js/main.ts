/* draw canvas */
function draw() {
    let x: number = (<HTMLInputElement>document.getElementById("w")).value as unknown as number;
    let y: number = (<HTMLInputElement>document.getElementById("h")).value as unknown as number;
    let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    if (x < 0 || y < 0) {
        alert("너비와 높이는 0보다 큰 값을 넣어주세요!");
    }/* else if (typeof (x) == String || typeof (y) == String) {
        alert("너비와 높이는 숫자로 해주세요!");
    }*/ else {
        canvas.width = x / 4;
        canvas.height = y / 4;

        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    calcC();
}

/* c */
function calcC(): void {
    let alpha, beta, phi_u, epsilon_s, A_s, b, c, E_s, f_ck, f_y, C_c, T_s;
    let d: number = (<HTMLInputElement>document.getElementById("d")).value as unknown as number;
    beta = 0.85;
    A_s = 3600;
    b = (<HTMLInputElement>document.getElementById("w")).value as unknown as number;
    E_s = 200000;
    f_ck = 24;

    for (c = 0; Number.parseFloat(C_c).toFixed(2) >= Number.parseFloat(T_s).toFixed(2); c++) {
        phi_u = 0.003 / c;
        epsilon_s = phi_u * (d - c);
        alpha = beta * c;
        T_s = f_y * A_s;
        C_c = beta * f_ck * b * alpha;
        console.log(c + "mm");
    }
}
