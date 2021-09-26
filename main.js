
/* draw canvas */
function draw() {
    let x = document.getElementById("w").value;
    let y = document.getElementById("h").value;
    let canvas = document.getElementById("myCanvas");
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
}

/* c */
function calcC() {
    let alpha, phi_u, epsilon_s, epsilon_y, c, C_c, T_s;
    let h = document.getElementById("h").value;
    let d = document.getElementById("d").value;
    let beta = document.getElementById("beta").value;
    let A_s = document.getElementById("A_s").value;
    let b = document.getElementById("w").value;
    let f_ck = document.getElementById("f_ck").value;
    let f_y = document.getElementById("f_y").value;
    let E_s = document.getElementById("E_s").value;
    epsilon_y = f_y/E_s;
    C_c = 0;
    T_s = 0.0000001;

    for (c = 150; C_c <= T_s; c+=0.00001) { //Number.parseFloat(C_c).toFixed(2)
        phi_u = 0.003 / c;
        epsilon_s = phi_u * (d - c);
        alpha = beta * c;
        T_s = f_y * A_s;
        C_c = beta * f_ck * b * alpha;
    }

    let M_n = C_c*((h/2)-(alpha/2)) + T_s*(d-(h/2));
    console.log("곡률(phi_u) = " + financial2(phi_u*100000) + "e-5");
    console.log("인장철근 변형률(epsilon_s) = " + financial3(epsilon_s));
    console.log("중립축(c) = " + financial2(c) + "mm");
    console.log("인장력(T_s) = " + T_s + "N");
    console.log("압축력(C_c) = " + financial2(C_c) + "N");
    console.log("공칭모멘트(M_n) = " + financial1(M_n*0.0000001) + "kNm");

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let x = document.getElementById("w").value;
    let cH = c/4;
    let width = x/4;
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    ctx.moveTo(0, cH);
    ctx.lineTo(width, cH);
    ctx.stroke();
    ctx.closePath();

    document.getElementById("answer").innerHTML = "<div></div>";
    document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(phi_u) = " + financial2(phi_u*100000) + "e-5</div><div class='i'>인장철근 변형률(epsilon_s) = " + financial3(epsilon_s) + "</div><div class='i'>중립축(c) = " + financial2(c) + "mm</div><div class='i'>인장력(T_s) = " + T_s + "N</div><div class='i'>압축력(C_c) = " + financial2(C_c) + "N</div><div class='i'>공칭모멘트(M_n) = " + financial1(M_n*0.0000001) + "kNm</div><div class='i'></div><div class='i'></div></div>";
}

/* 반올림 */
function financial1(x) {
    return Number.parseFloat(x).toFixed(1);
}

function financial2(x) {
    return Number.parseFloat(x).toFixed(2);
}

function financial3(x) {
    return Number.parseFloat(x).toFixed(3);
}
