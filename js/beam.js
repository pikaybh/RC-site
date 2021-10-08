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
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d) </span>";
        as2.style.display = "none";
        asc.style.display = "none";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s) </span>";
    } else if (duo1.checked) {
        ds2.style.display = "none";
        dc.style.display = "block";
        dc.childNodes[1].innerHTML = "<span>압축철근측 유효깊이(d') </span> <input class='d_C' id='d_C' type='number' placeholder='20' onfocus='this.value=\"20\"' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d) </span>";
        as2.style.display = "none";
        asc.style.display = "block";
        asc.childNodes[1].innerHTML = "<span>압축철근(A_s') </span><input class='A_s_C' id='A_s_C' type='number' placeholder='900' onfocus='this.value=\"900\"' /><span>mm^2</span>";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s) </span>";
    } else if (duo2.checked) {
        ds2.style.display = "block";
        ds2.childNodes[1].innerHTML = "<span>인장철근측 유효깊이(d_2) </span> <input class='d2' id='d2' type='number' placeholder='560'onfocus='this.value=\"560\"' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dc.style.display = "block";
        dc.childNodes[1].innerHTML = "<span>압축철근측 유효깊이(d') </span> <input class='d_C' id='d_C' type='number' placeholder='20' onfocus='this.value=\"20\"' onkeyup='draw()' onclick='draw()' /><span>mm</span>";
        dsN.innerHTML = "<span class='D_sN'>인장철근측 유효깊이(d_1) </span>";
        as2.style.display = "block";
        as2.childNodes[1].innerHTML = "<span>인장철근(A_s2) </span><input class='A_s_2' id='A_s_2' type='number' placeholder='600' onfocus='this.value=\"600\"' /><span>mm^2</span>";
        asc.style.display = "block";
        asc.childNodes[1].innerHTML = "<span>압축철근(A_s') </span><input class='A_s_C' id='A_s_C' type='number' placeholder='900' onfocus='this.value=\"900\"' /><span>mm^2</span>";
        asN.innerHTML = "<span class='A_sN'>인장철근(A_s1) </span>";
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

/* calculaing btns */
function calcAll() {
    console.log("Calculating...");
    var showItems = document.getElementsByClassName("loader");
    var showItems1 = document.getElementsByClassName("loaderText");
    for (var i = 0; i < showItems.length; i ++) {
        showItems[i].style.display = 'block';
    }
    for (var i = 0; i < showItems1.length; i ++) {
        showItems1[i].style.display = 'block';
    }
    calcRho().then(() => {
        calcCr().then(() => {
            calcY().then(() => {
                calcC().then(() => {
                    console.log("Calculating Finish");
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("loaderText").style.display = "none";
                });
            });
        });
    });
}

function calculating() {
    console.log("Calculating...");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderText").style.display = "block";
    calcC().then(() => {
        console.log("Calculating Finish");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderText").style.display = "none";
    });
}

function calculatingS() {
    console.log("Calculating...");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderText").style.display = "block";
    calcRho().then(() => {
        console.log("Calculating Finish");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderText").style.display = "none";
    });
}

function calculatingCr() {
    console.log("Calculating...");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderText").style.display = "block";
    calcCr().then(() => {
        console.log("Calculating Finish");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderText").style.display = "none";
    });
}


function calculatingY() {
    console.log("Calculating...");
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderText").style.display = "block";
    calcY().then(() => {
        console.log("Calculating Finish");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderText").style.display = "none";
    });
}

/* rho */
async function calcRho() {
    try {
        let alpha, phi, phi_u, epsilon_all, epsilon_s, epsilon_sB, epsilon_s_C, epsilon_s_CB, epsilon_y, c, C_c, C_s, T_s, A_sb, A_sMax, A_sMin, rho, rho_b, rho_max, rho_min;
        let h = document.getElementById("h").value;
        let d = document.getElementById("d").value;
        let beta = document.getElementById("beta").value;
        let A_s = document.getElementById("A_s").value;
        let b = document.getElementById("w").value;
        let f_ck = document.getElementById("f_ck").value;
        let f_y = document.getElementById("f_y").value;
        let E_s = document.getElementById("E_s").value;
        epsilon_y = f_y / E_s;
        epsilon_all = 2*epsilon_y;
        console.log("★철근비 구하기★");
        console.log(typeof(epsilon_all) + ", " + epsilon_all);

        /*최소철근비*/
        rho_min = (0.25*Math.sqrt(f_ck))/f_y;
        if(rho_min<1.4/f_y) {
            rho_min = 1.4/f_y;
        }
        A_sMin = rho_min*(b*d);
        console.log("최소철근비 : " + rho_min);
        console.log("A_sMin : " + A_sMin);

        /* 최대철근비 */
        let iA_s, iEpsilon_s;
        iEpsilon_s = 1;
        for(iA_s=100; iEpsilon_s>epsilon_all; iA_s++) {
            C_c = 0;
            T_s = 0.0000001;
            var qux = new foobar(iA_s, C_c, T_s);
            iEpsilon_s = qux.getIe();
        }
        A_sMax = iA_s;
        rho_max = A_sMax/(b*d);
        console.log("최대철근비 : " + rho_max);
        console.log("A_sMax : " + A_sMax);

        function foobar(foo, bar, baz) {
            var iE;
            for (c = 0; bar < baz; c += 0.1) {
                phi_u = 0.003 / c;
                iE = phi_u * (d - c);
                alpha = beta * c;
                baz = f_y * foo;
                bar = beta * f_ck * b * alpha;
            }
            this.getIe = () => {
                return iE;
            }
        }

        /* 균형 철근비*/
        rho_b = 0.85*beta*(f_ck/f_y)*(600/(600 + f_y*1));
        A_sb = rho_b*(b*d);
        console.log("균형철근비 : " + rho_b);
        console.log("A_sb : " + A_sb);
        
        /*철근비*/
        rho = A_s/(b*d);
        console.log("철근비 : " + rho);
        console.log("A_s : " + A_s);

        let rho_check;
        if (rho_min<=rho&&rho<=rho_max) {
            rho_check = "✔"
        } else {
            rho_check = "❌"
        }

        document.getElementById("answerS").innerHTML = "<div></div>";
        document.getElementById("answerS").innerHTML = "<div><div class='i'>최소철근비(ρ_min) : " + (financial3(rho_min)).toLocaleString('ko-KR') + "</div><div class='i'>(A_s,min) : " + (financial1(A_sMin)).toLocaleString('ko-KR') + "</div><div class='i'>최대철근비(ρ_max) : " + (financial3(rho_max)).toLocaleString('ko-KR') + "</div><div class='i'>(A_s,max) : " + (financial1(A_sMax)).toLocaleString('ko-KR') + "</div><div class='i'>균형철근비(ρ_b) : " + (financial3(rho_b)).toLocaleString('ko-KR') + "</div><div class='i'>(A_sb) : " + (financial1(A_sb)).toLocaleString('ko-KR') + "</div><div class='i'>철근비(ρ) : " + (financial3(rho)).toLocaleString('ko-KR') + rho_check + "</div></div>";

    } catch (error) {
        alert("공란이 있습니다!");
    }
}

/* 균열점 구하기 */
async function calcCr() {
    try {
        let f_r, E_c, I_g, y_t, M_cr, phi_cr, delta_f;
        let h = document.getElementById("h").value;
        let b = document.getElementById("w").value;
        let f_ck = document.getElementById("f_ck").value;
        console.log("★균열점 구하기★");
        if(f_ck<=40) {
            delta_f = 4;
        } else if(f_ck>=60) {
            delta_f = 6;
        } else {
            delta_f = 5;
        }
        f_r = 0.63*(Math.sqrt(f_ck));
        I_g = (b*(Math.pow(h,3)))/12;
        console.log("I_g : " + I_g);
        y_t = h/2;
        M_cr = f_r*(I_g/y_t);
        console.log("M_cr : " + M_cr);
        console.log("delta_f : " + delta_f);
        E_c = 8500*(Math.cbrt(f_ck*1 + delta_f*1));
        console.log("E_c : " + E_c);
        phi_cr = M_cr/(E_c*I_g);
        console.log("phi_cr : " + phi_cr);
        document.getElementById("answerCr").innerHTML = "<div></div>";
        document.getElementById("answerCr").innerHTML = "<div><div class='i' style='color:skyblue;'>인장연단거리(y_t) = " + (y_t).toLocaleString('ko-KR') + "mm</div><div class='i'>곡률(φ_cr) = " + (financial2(phi_cr * 10000000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-7/mm</div><div class='i'>Modulus of rupture(f_r) = " + (financial2(f_r)).toLocaleString('ko-KR') + "</div><div class='i'>단면2차모멘트(I_g) = " + (financial1(I_g*0.000000001)).toLocaleString('ko-KR') + "e+9 mm^4</div><div class='i'>콘크리트 탄성계수(E_c) = " + (financial1(E_c)).toLocaleString('ko-KR') + "MPa</div><div class='i'>균열 공칭모멘트(M_cr) = " + (financial1(M_cr * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";

        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        let x = document.getElementById("w").value;
        let ytH = y_t / 4;
        let width = x / 4;
        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "skyblue";
        ctx.moveTo(0, ytH);
        ctx.lineTo(width, ytH);
        ctx.stroke();
        ctx.closePath();

    } catch (error) {
        alert("공란이 있습니다!");
    }
}

/* 항복점 구하기 */
async function calcY() {
    try {
        let phi_y, delta_f, epsilon_cm, epsilon_s, epsilon_s_C, f_cm, f_s, f_s_C, E_c, c, C_c, C_s, T_s;
        let h = document.getElementById("h").value;
        let d = document.getElementById("d").value;
        let A_s = document.getElementById("A_s").value;
        let b = document.getElementById("w").value;
        let f_ck = document.getElementById("f_ck").value;
        let f_y = document.getElementById("f_y").value;
        let E_s = document.getElementById("E_s").value;
        if(f_ck<=40) {
            delta_f = 4;
        } else if(f_ck>=60) {
            delta_f = 6;
        } else {
            delta_f = 5;
        }
        E_c = 8500*(Math.cbrt(f_ck*1 + delta_f*1));
        epsilon_y = f_y / E_s;
        console.log("★항복점 구하기★");
        C_c = 0;
        C_s = 0;
        T_s = 0.0000001;

        if (solo.checked) {
            /* 단근보 */
            for (c = 0; C_c < T_s; c += 0.0001) {
                phi_y = 0.002 / (d - c);
                epsilon_s = phi_y * (d - c);
                epsilon_cm = phi_y * c;
                f_s = f_y;
                f_cm = E_c*epsilon_cm;
                C_c = (1/2) * f_cm * b * c;
                T_s = f_s * A_s;
            }

            console.log("phi_y : " + phi_y);
            console.log("epsilon_s : " + epsilon_s);
            console.log("C_c : " + C_c);
            console.log("T_s : " + T_s);

            let M_y = C_c * ((h / 2) - (c / 3)) + T_s * (d - (h / 2));
            document.getElementById("answerY").innerHTML = "<div></div>";
            document.getElementById("answerY").innerHTML = "<div><div class='i'>곡률(φ_y) = " + (financial2(phi_y * 1000000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-6/mm</div><div class='i' style='color:pink;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>항복 공칭모멘트(M_y) = " + (financial1(M_y * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";

        } else if (duo1.checked) {
            /* 복근보 1단 */
            let d_C = document.getElementById("d_C").value;
            let A_s_C = document.getElementById("A_s_C").value;

            for (c = 0; C_c + C_s < T_s; c += 0.0001) {
                phi_y = 0.002 / (d - c);
                epsilon_s = phi_y * (d - c);
                epsilon_s_C = phi_y*(c-d_C);
                epsilon_cm = phi_y * c;
                f_s = f_y;
                f_s_C = E_s*epsilon_s_C;
                f_cm = E_c*epsilon_cm;
                C_c = (1/2) * f_cm * b * c;
                C_s = f_s_C*A_s_C
                T_s = f_s * A_s;
            }
            
            console.log("phi_y : " + phi_y);
            console.log("epsilon_s : " + epsilon_s);
            console.log("C_c : " + C_c);
            console.log("C_s : " + C_s);
            console.log("T_s : " + T_s);

            let M_y = C_c * ((h / 2) - (c / 3)) + C_s*((h/2)-d_C) + T_s * (d - (h / 2));
            document.getElementById("answerY").innerHTML = "<div></div>";
            document.getElementById("answerY").innerHTML = "<div><div class='i'>곡률(φ_y) = " + (financial2(phi_y * 1000000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-6/mm</div><div class='i' style='color:pink;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_s) = " + (financial2(C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>항복 공칭모멘트(M_y) = " + (financial1(M_y * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";

        } else if (duo2.checked) {
            /* 복근보 2단 */
            let d_C = document.getElementById("d_C").value;
            let d2 = document.getElementById("d2").value;
            let A_s_C = document.getElementById("A_s_C").value;
            let A_s_2 = document.getElementById("A_s_2").value;

            for (c = 0; C_c < T_s; c += 0.0001) {
                phi_y = 0.002 / (d - c);
                epsilon_s = phi_y * (d - c);
                epsilon_cm = phi_y * c;
                f_s = f_y;
                f_cm = E_c*epsilon_cm;
                C_c = (1/2) * f_cm * b * c;
                T_s = f_s * A_s;
            }

            let foo = d-c;
            console.log("d-c : " + foo);
            console.log("phi_y : " + phi_y);
            console.log("epsilon_s : " + epsilon_s);
            console.log("C_c : " + C_c);
            console.log("T_s : " + T_s);

            let M_y = C_c * ((h / 2) - (c / 3)) + T_s * (d - (h / 2));
            document.getElementById("answerY").innerHTML = "<div></div>";
            document.getElementById("answerY").innerHTML = "<div><div class='i'>곡률(φ_y) = " + (financial2(phi_y * 1000000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-6/mm</div><div class='i' style='color:pink;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>공칭모멘트(M_y) = " + (financial1(M_y * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";
        }


        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        let x = document.getElementById("w").value;
        let cH = c / 4;
        let width = x / 4;
        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "pink";
        ctx.moveTo(0, cH);
        ctx.lineTo(width, cH);
        ctx.stroke();
        ctx.closePath();

    } catch (error) {
        alert("공란이 있습니다!");
    }
}

/* c */
async function calcC() {
    try {
        let alpha, phi, phi_u, epsilon_s, epsilon_sB, epsilon_s_C, epsilon_s_CB, epsilon_y, c, C_c, C_s, T_s;
        let h = document.getElementById("h").value;
        let d = document.getElementById("d").value;
        let beta = document.getElementById("beta").value;
        let A_s = document.getElementById("A_s").value;
        let b = document.getElementById("w").value;
        let f_ck = document.getElementById("f_ck").value;
        let f_y = document.getElementById("f_y").value;
        let E_s = document.getElementById("E_s").value;
        epsilon_y = f_y / E_s;
        console.log("★휨강도 구하기★");
        C_c = 0;
        C_s = 0;
        T_s = 0.0000001;

        if (solo.checked) {
            /* 단근보 */
            for (c = 0; C_c < T_s; c += 0.0001) {
                phi_u = 0.003 / c;
                epsilon_s = phi_u * (d - c);
                alpha = beta * c;
                T_s = f_y * A_s;
                C_c = beta * f_ck * b * alpha;
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

            let epsilon_t = ((d - c) / c) * 0.003;
            let M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2));

            /* 강도감소계수 */
            if (epsilon_t < 0.002) {
                phi = 0.65;
            } else if (0.002 <= epsilon_t && epsilon_t < 0.005) {
                phi = 0.65 + (200 / 3) * (epsilon_t - 0.002);
            } else if (0.005 <= epsilon_t) {
                phi = 0.85;
            }

            let M_u = phi*M_n;

            console.log("곡률(phi_u) = " + financial2(phi_u * 100000).toLocaleString('ko-KR').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5");
            console.log("인장철근 변형률(epsilon_s) = " + financial3(epsilon_s).toLocaleString('ko-KR'));
            console.log("중립축(c) = " + financial2(c).toLocaleString('ko-KR') + "mm");
            console.log("인장력(T_s) = " + T_s.toLocaleString('ko-KR') + "N");
            console.log("압축력(C_c) = " + financial2(C_c).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "N");
            console.log("공칭모멘트(M_n) = " + financial1(M_n * 0.0000001).toLocaleString('ko-KR') + "kN·m");
            console.log("(epsilon_t) = " + financial3(epsilon_t).toLocaleString('ko-KR'));

            document.getElementById("answer").innerHTML = "<div></div>";
            document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(φ_u) = " + (financial2(phi_u * 100000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5/mm</div><div class='i'>인장철근 변형률(ε_s) = " + (financial3(epsilon_s)).toLocaleString('ko-KR') + " " + epsilon_sB + "</div><div class='i'>항복변형률(ε_y) = " + (financial3(epsilon_y)).toLocaleString('ko-KR') + "</div><div class='i' style='color: grey;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>균형파괴 공칭모멘트(M_n) = " + (financial1(M_n * 0.000001)).toLocaleString('ko-KR') + "kN·m</div><div class='i'>강도감소계수(φ)" + (financial3(phi)).toLocaleString('ko-KR') + "</div><div class='i'>공칭모멘트(M_u) = " + (financial1(M_u * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";

        } else if (duo1.checked) {
            /* 복근보 1단 */
            let d_C = document.getElementById("d_C").value;
            let A_s_C = document.getElementById("A_s_C").value;

            for (c = 0; C_c + C_s < T_s; c += 0.0001) {
                phi_u = 0.003 / c;
                epsilon_s = phi_u * (d - c);
                epsilon_s_C = phi_u * (c - d_C);
                alpha = beta * c;
                T_s = f_y * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = E_s * epsilon_s_C * A_s_C;
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

            let epsilon_t = ((d - c) / c) * 0.003;
            let M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

            /* 강도감소계수 */
            if (epsilon_t < 0.002) {
                phi = 0.65;
            } else if (0.002 <= epsilon_t && epsilon_t < 0.005) {
                phi = 0.65 + (200 / 3) * (epsilon_t - 0.002);
            } else if (0.005 <= epsilon_t) {
                phi = 0.85;
            }

            let M_u = phi*M_n;

            console.log("곡률(phi_u) = " + financial2(phi_u * 100000).toLocaleString('ko-KR').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5");
            console.log("인장철근 변형률(epsilon_s) = " + financial3(epsilon_s).toLocaleString('ko-KR'));
            console.log("압축철근 변형률(epsilon_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR'));
            console.log("중립축(c) = " + financial2(c).toLocaleString('ko-KR') + "mm");
            console.log("인장력(T_s) = " + T_s.toLocaleString('ko-KR') + "N");
            console.log("압축력(C_c) = " + financial2(C_c).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "N");
            console.log("압축력(C_s) = " + C_s.toLocaleString('ko-KR') + "N");
            console.log("공칭모멘트(M_n) = " + financial1(M_n * 0.0000001).toLocaleString('ko-KR') + "kN·m");
            console.log("(epsion_t) = " + financial3(epsilon_t).toLocaleString('ko-KR'));

            document.getElementById("answer").innerHTML = "<div></div>";
            document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(φ_u) = " + (financial2(phi_u * 100000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5/mm</div><div class='i'>인장철근 변형률(ε_s) = " + (financial3(epsilon_s)).toLocaleString('ko-KR') + " " + epsilon_sB + "</div><div class='i'>압축철근 변형률(ε_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR') + " " + epsilon_s_CB + "</div><div class='i'>항복변형률(ε_y) = " + (financial3(epsilon_y)).toLocaleString('ko-KR') + "</div><div class='i' style='color: grey;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c + C_s) = " + (financial2(C_c + C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_s) = " + (financial2(C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>균형파괴 공칭모멘트(M_n) = " + (financial1(M_n * 0.000001)).toLocaleString('ko-KR') + "kN·m</div><div class='i'>강도감소계수(φ)" + (financial3(phi)).toLocaleString('ko-KR') + "</div><div class='i'>공칭모멘트(M_u) = " + (financial1(M_u * 0.000001)).toLocaleString('ko-KR') + "kN·m</div></div>";

        } else if (duo2.checked) {
            /* 복근보 2단 */
            let d_C = document.getElementById("d_C").value;
            let d2 = document.getElementById("d2").value;
            let A_s_C = document.getElementById("A_s_C").value;
            let A_s_2 = document.getElementById("A_s_2").value;

            for (c = 0; C_c + C_s < T_s; c += 0.0001) {
                phi_u = 0.003 / c;
                epsilon_s = phi_u * (d - c);
                epsilon_s_C = phi_u * (c - d_C);
                alpha = beta * c;
                T_s = f_y * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = E_s * epsilon_s_C * A_s_C;
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

            let M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

            console.log("곡률(phi_u) = " + financial2(phi_u * 100000).toLocaleString('ko-KR').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5");
            console.log("인장철근 변형률(epsilon_s) = " + financial3(epsilon_s).toLocaleString('ko-KR'));
            console.log("압축철근 변형률(epsilon_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR'));
            console.log("중립축(c) = " + financial2(c).toLocaleString('ko-KR') + "mm");
            console.log("인장력(T_s) = " + T_s.toLocaleString('ko-KR') + "N");
            console.log("압축력(C_c) = " + financial2(C_c).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "N");
            console.log("압축력(C_s) = " + C_s.toLocaleString('ko-KR') + "N");
            console.log("공칭모멘트(M_n) = " + financial1(M_n * 0.0000001).toLocaleString('ko-KR') + "kN·m");

            document.getElementById("answer").innerHTML = "<div></div>";
            document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(φ_u) = " + (financial2(phi_u * 100000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5/mm</div><div class='i'>인장철근 변형률(ε_s) = " + (financial3(epsilon_s)).toLocaleString('ko-KR') + " " + epsilon_sB + "</div><div class='i'>압축철근 변형률(ε_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR') + " " + epsilon_s_CB + "</div><div class='i'>항복변형률(ε_y) = " + (financial3(epsilon_y)).toLocaleString('ko-KR') + "</div><div class='i' style='color: grey;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c + C_s) = " + (financial2(C_c + C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_s) = " + (financial2(C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>공칭모멘트(M_n) = " + (financial1(M_n * 0.000001)).toLocaleString('ko-KR') + "kN·m</div><div class='i'>강도감소계수(φ)" + (financial3(phi)).toLocaleString('ko-KR') + "</div></div>";
        }


        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        let x = document.getElementById("w").value;
        let cH = c / 4;
        let width = x / 4;
        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        ctx.moveTo(0, cH);
        ctx.lineTo(width, cH);
        ctx.stroke();
        ctx.closePath();

    } catch (error) {
        alert("공란이 있습니다!");
    }
}