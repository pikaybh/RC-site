/* radio */
function radio() {
    var solo = document.getElementById("solo");
    var duo1 = document.getElementById("duo1");
    var duo2 = document.getElementById("duo2");
    
    var ds2 = document.getElementById("DS2");
    var dc = document.getElementById("DC");
    var dsN = document.getElementById("D_sN");
    var as2 = document.getElementById("AS2");
    var asc = document.getElementById("ASC");
    var asN = document.getElementById("A_sN");

    if (solo.checked) {
        ds2.style.display = "none";
        dc.style.display = "none";
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d)</span>";
        as2.style.display = "none";
        asc.style.display = "none";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s)</span>";
    } else if (duo1.checked) {
        ds2.style.display = "none";
        dc.style.display = "block";
        dc.childNodes[1].innerHTML = "<span>압축철근측 유효깊이(d')</span> <input class='d_C' id='d_C' type='number' placeholder='20' onfocus='this.value='20'' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d)</span>";
        as2.style.display = "none";
        asc.style.display = "block";
        asc.childNodes[1].innerHTML = "<span>압축철근(A_s')</span><input class='A_s_C' id='A_s_C' type='number' placeholder='900' onfocus='this.value='900'' /><span>mm^2</span>";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s)</span>";
    } else if (duo2.checked) {
        ds2.style.display = "block";
        ds2.childNodes[1].innerHTML = "<span>인장철근측 유효깊이(d_2)</span> <input class='d' id='d' type='number' placeholder='580'onfocus='this.value='580'' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dc.style.display = "block";
        dc.childNodes[1].innerHTML = "<span>압축철근측 유효깊이(d')</span> <input class='d_C' id='d_C' type='number' placeholder='20' onfocus='this.value='20'' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d_1)</span>";
        as2.style.display = "block";
        as2.childNodes[1].innerHTML = "<span>인장철근(A_s2)</span><input class='A_s_2' id='A_s_2' type='number' placeholder='600' onfocus='this.value='600'' /><span>mm^2</span>";
        asc.style.display = "block";
        asc.childNodes[1].innerHTML = "<span>압축철근(A_s')</span><input class='A_s_C' id='A_s_C' type='number' placeholder='900' onfocus='this.value='900'' /><span>mm^2</span>";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s1)</span>";
    }
}

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
    let alpha, phi_u, epsilon_s, epsilon_sB, epsilon_s_C, epsilon_s_CB, epsilon_y, c, C_c, C_s, T_s;
    let h = document.getElementById("h").value;
    let d = document.getElementById("d").value;
    let d_C = document.getElementById("d_C").value;
    let beta = document.getElementById("beta").value;
    let A_s = document.getElementById("A_s").value;
    let A_s_C = document.getElementById("A_s_C").value;
    let b = document.getElementById("w").value;
    let f_ck = document.getElementById("f_ck").value;
    let f_y = document.getElementById("f_y").value;
    let E_s = document.getElementById("E_s").value;
    epsilon_y = f_y/E_s;
    C_c = 0;
    C_s = 0;
    T_s = 0.0000001;

    if (A_s_C == 0) {
        for (c = 0; C_c <= T_s; c+=0.0001) {
            phi_u = 0.003 / c;
            epsilon_s = phi_u * (d - c);
            alpha = beta * c;
            T_s = f_y * A_s;
            C_c = beta * f_ck * b * alpha;
        }
    } else {
        for (c = 0; C_c + C_s <= T_s; c+=0.0001) {
            phi_u = 0.003 / c;
            epsilon_s = phi_u * (d - c);
            epsilon_s_C = phi_u * (c - d_C);
            alpha = beta * c;
            T_s = f_y * A_s;
            C_c = beta * f_ck * b * alpha;
            C_s = E_s * epsilon_s_C * A_s_C;
        }
    }

    if (epsilon_s > epsilon_y) {
        epsilon_sB = "✔";
    } else {
        epsilon_sB = "❌";
    }
    
    if (epsilon_s_C > epsilon_y) {
        epsilon_s_CB = "✔";
    } else {
        epsilon_s_CB = "❌";
    }

    let M_n = C_c*((h/2)-(alpha/2)) + T_s*(d-(h/2)) + C_s*((h/2-d_C));
    console.log("곡률(phi_u) = " + financial2(phi_u*100000).toLocaleString('ko-KR').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5");
    console.log("인장철근 변형률(epsilon_s) = " + financial3(epsilon_s).toLocaleString('ko-KR'));
    console.log("압축철근 변형률(epsilon_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR'));
    console.log("중립축(c) = " + financial2(c).toLocaleString('ko-KR') + "mm");
    console.log("인장력(T_s) = " + T_s.toLocaleString('ko-KR') + "N");
    console.log("압축력(C_c) = " + financial2(C_c).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "N");
    console.log("압축력(C_s) = " + C_s.toLocaleString('ko-KR') + "N");
    console.log("공칭모멘트(M_n) = " + financial1(M_n*0.0000001).toLocaleString('ko-KR') + "kNm");

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
    document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(φ_u) = " + (financial2(phi_u*100000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5</div><div class='i'>인장철근 변형률(ε_s) = " + (financial3(epsilon_s)).toLocaleString('ko-KR') + " " + epsilon_sB + "</div><div class='i'>압축철근 변형률(ε_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR') + " " + epsilon_s_CB + "</div><div class='i'>항복변형률(ε_y) = " + (financial3(epsilon_y)).toLocaleString('ko-KR') + "</div><div class='i'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c + C_s) = " + (financial2(C_c + C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_s) = " + (financial2(C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>공칭모멘트(M_n) = " + (financial1(M_n*0.0000001)).toLocaleString('ko-KR') + "kNm</div></div>";
}

/* await */
/*function wait () {
    show("loader");
    var z = await calcC();
    hide("loader");
}*/

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

/* hide & show */
function hide(foo) {
    var elem = document.getElementById(foo);
    elem.style.display = 'none';
}

function show(foo) {
    var elem = document.getElementById(foo);
    elem.style.display = 'block';
}