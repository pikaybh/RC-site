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

/* Calculation btn */
function calculating() {
    console.log("Calculating...");
    var showItems = document.getElementsByClassName("loader");
    var showItems1 = document.getElementsByClassName("loaderText");
    for (var i = 0; i < showItems.length; i ++) {
        showItems[i].style.display = 'block';
    }
    for (var i = 0; i < showItems1.length; i ++) {
        showItems1[i].style.display = 'block';
    }
    calcC().then(() => {
        console.log("Calculating Finish");
        document.getElementById("loader").style.display = "none";
        document.getElementById("loaderText").style.display = "none";
    });
}

/* c */
async function calcC() {
    try {
        let f_s, f_s_C, alpha, phi, phi_u, epsilon_s, epsilon_sB, epsilon_s_C, epsilon_s_CB, epsilon_y, A_g, A_st, c, C_c, C_s, T_s, P_n, M_n;
        let h = document.getElementById("h").value;
        let d = document.getElementById("d").value;
        let beta = document.getElementById("beta").value;
        let A_s = document.getElementById("A_s").value;
        let b = document.getElementById("w").value;
        let f_ck = document.getElementById("f_ck").value;
        let f_y = document.getElementById("f_y").value;
        let E_s = document.getElementById("E_s").value;
        epsilon_y = f_y / E_s;
        A_g = b*h;
        C_c = 0;
        C_s = 0;
        T_s = 0.0000001;

        let numberOfContents = 8; //maximal number of contents
        labelContainer = document.getElementById("answer");
        for (let i = 0; i < numberOfContents; i++) {
            labelContainer.appendChild(document.createElement('div'));
        }
        document.getElementById("answer").childNodes[1].innerHTML = "<div class='i'>압축강도(P_n) 휨강도(M_n)</div>";
        console.log("num of childNodes : " + labelContainer.childNodes);

        if (solo.checked) {
            /* 단근보 */
            /*M_n = 0.001;
            for (epsilon_s = 0.003; 0 <= M_n; epsilon_s += -0.0001) {
                //곡률, 변형률
                c = (0.003/(epsilon_s + 0.003))*d;
                phi_u = 0.003/c;
                epsilon_s_C = phi_u * (c - d_C);

                //응력
                alpha = beta * c;
                f_s = E_s*epsilon_s;
                f_s_C = E_s*epsilon_s_C;

                //내력
                T_s = f_y * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = f_s_C * A_s_C;
                P_n = C_c + C_s - T_s;
                M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

                console.log("P_n = " + financial1(P_n * 0.001) + "kN, M_n = " + financial1(M_n * 0.000001) + "kN·m");

                document.getElementById("answer").innerHTML = "<div><div class='i'>" + financial1(P_n * 0.001) + "kN " + financial1(M_n * 0.000001) + "kN·m</div></div>";    
            }*/

            //[Doc]domination(string, 'epsilon_s', list(n));
            domination("인장지배", (5*epsilon_y), 2);
            domination("균형파괴", (epsilon_y), 3);
            domination("압축지배", 0, 4);
            domination("test1", 0.003, 5);
            domination("test2", -0.003, 6);

            function domination(foo, epsilonS, bar) {
                //곡률, 변형률
                epsilon_s = epsilonS;
                c = (0.003/(epsilon_s + 0.003))*d;
                phi_u = 0.003/c;
                epsilon_s_C = phi_u * (c - d_C);

                //응력
                alpha = beta * c;
                f_s = E_s*epsilon_s;
                f_s_C = E_s*epsilon_s_C;
                if (f_s>400) {
                    f_s = 400;
                }
                if (f_s_C>400) {
                    f_s_C = 400;
                }

                //내력
                T_s = f_s * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = f_s_C * A_s_C;
                P_n = C_c + C_s - T_s;
                M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

                console.log("★" + foo + "★");
                console.log("E_s = " + E_s);
                console.log("epsion_y = " + epsilon_y);
                console.log("epsion_s = " + epsilon_s);
                console.log("epsion'_s = " + epsilon_s_C);
                console.log("c = " + c + "mm");
                console.log("phi_u = " + phi_u + "/mm");
                console.log("f_s = " + f_s + "MPa");
                console.log("f'_s = " + financial1(f_s_C) + "MPa");
                console.log("C_c = " + financial1(C_c) + "N");
                console.log("C_s = " + financial1(C_s) + "N");
                console.log("T_s = " + financial1(T_s) + "N");
                console.log("P_n = " + financial1(P_n * 0.001) + "kN");
                console.log("M_n = " + financial1(M_n * 0.000001) + "kN·m");

                document.getElementById("answer").childNodes[bar].innerHTML = "<div class='i'>" + foo + " : " + financial1(P_n * 0.001) + "kN &#9;" + financial1(M_n * 0.000001) + "kN·m</div>";    
            }
            
            /* 강도감소계수 */
            let epsilon_t = ((d - c) / c) * 0.003;
            if (epsilon_t < 0.002) {
                phi = 0.65;
            } else if (0.002 <= epsilon_t && epsilon_t < 0.005) {
                phi = 0.65 + (200 / 3) * (epsilon_t - 0.002);
            } else if (0.005 <= epsilon_t) {
                phi = 0.85;
            }

        } else if (duo1.checked) {
            /* 복근보 1단 */
            let d_C = document.getElementById("d_C").value;
            let A_s_C = document.getElementById("A_s_C").value;
            A_st = A_s*1 + A_s_C*1;

            /*M_n = 0.001;
            for (epsilon_s = 0.003; 0 <= M_n; epsilon_s += -0.0001) {
                //곡률, 변형률
                c = (0.003/(epsilon_s + 0.003))*d;
                phi_u = 0.003/c;
                epsilon_s_C = phi_u * (c - d_C);

                //응력
                alpha = beta * c;
                f_s = E_s*epsilon_s;
                f_s_C = E_s*epsilon_s_C;

                //내력
                T_s = f_y * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = f_s_C * A_s_C;
                P_n = C_c + C_s - T_s;
                M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

                console.log("P_n = " + financial1(P_n * 0.001) + "kN, M_n = " + financial1(M_n * 0.000001) + "kN·m");

                document.getElementById("answer").innerHTML = "<div><div class='i'>" + financial1(P_n * 0.001) + "kN " + financial1(M_n * 0.000001) + "kN·m</div></div>";    
            }*/

            //[Doc]domination(string, 'epsilon_s', list(n));
            domination("순수인장", 0.1, 3);
            momentDomination("순수휨", 4);
            domination("인장지배", (5*epsilon_y), 5);
            domination("균형파괴", (epsilon_y), 6);
            domination("압축지배", 0, 7);
            domination("순수압축", -0.003, 8);

            function domination(foo, epsilonS, bar) {
                //곡률, 변형률
                epsilon_s = epsilonS;
                c = (0.003/(epsilon_s + 0.003))*d;
                if (c == Infinity) {
                    phi_u = 0;
                    epsilon_s_C = epsilon_s;
                } else {
                    phi_u = 0.003/c;
                    epsilon_s_C = phi_u * (c - d_C);
                }

                //응력
                if (c > h) {
                    alpha = beta * h;
                } else {
                    alpha = beta * c;
                }
                f_s = E_s*epsilon_s;
                f_s_C = E_s*epsilon_s_C;
                if (f_s>400) {
                    f_s = 400;
                }
                if (f_s_C>400) {
                    f_s_C = 400;
                }

                //내력
                T_s = f_s * A_s;
                C_c = beta * f_ck * b * alpha;
                C_s = f_s_C * A_s_C;
                if (c == Infinity) {
                    P_n = beta*f_ck*(A_g-A_st) + f_y*A_st;
                } else {
                    P_n = C_c + C_s - T_s;
                }
                M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

                console.log("★" + foo + "★");
                console.log("E_s = " + E_s);
                console.log("epsion_y = " + epsilon_y);
                console.log("epsion_s = " + epsilon_s);
                console.log("epsion'_s = " + epsilon_s_C);
                console.log("c = " + c + "mm");
                console.log("phi_u = " + phi_u + "/mm");
                console.log("f_s = " + f_s + "MPa");
                console.log("f'_s = " + financial1(f_s_C) + "MPa");
                console.log("C_c = " + financial1(C_c) + "N");
                console.log("C_s = " + financial1(C_s) + "N");
                console.log("T_s = " + financial1(T_s) + "N");
                console.log("P_n = " + financial1(P_n * 0.001) + "kN");
                console.log("M_n = " + financial1(M_n * 0.000001) + "kN·m");

                document.getElementById("answer").childNodes[bar].innerHTML = "<div><div class='i'>" + foo + " : " + financial1(P_n * 0.001) + "kN &#9;" + financial1(M_n * 0.000001) + "kN·m</div></div>";    
            }

            function momentDomination(foo, bar) {
                //복근보
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

                let P_n = C_c + C_s - T_s;
                let M_n = C_c * ((h / 2) - (alpha / 2)) + T_s * (d - (h / 2)) + C_s * ((h / 2 - d_C));

                console.log("★" + foo + "★");
                console.log("E_s = " + E_s);
                console.log("epsion_y = " + epsilon_y);
                console.log("epsion_s = " + epsilon_s);
                console.log("epsion'_s = " + epsilon_s_C);
                console.log("c = " + c + "mm");
                console.log("phi_u = " + phi_u + "/mm");
                console.log("f_s = " + f_s + "MPa");
                console.log("f'_s = " + financial1(f_s_C) + "MPa");
                console.log("C_c = " + financial1(C_c) + "N");
                console.log("C_s = " + financial1(C_s) + "N");
                console.log("T_s = " + financial1(T_s) + "N");
                console.log("P_n = " + financial1(P_n * 0.001) + "kN");
                console.log("M_n = " + financial1(M_n * 0.000001) + "kN·m");

                document.getElementById("answer").childNodes[bar].innerHTML = "<div><div class='i'>" + foo + " : " + financial1(P_n * 0.001) + "kN &#9;" + financial1(M_n * 0.000001) + "kN·m</div></div>";    
            }
            
            /* 강도감소계수 */
            let epsilon_t = ((d - c) / c) * 0.003;
            if (epsilon_t < 0.002) {
                phi = 0.65;
            } else if (0.002 <= epsilon_t && epsilon_t < 0.005) {
                phi = 0.65 + (200 / 3) * (epsilon_t - 0.002);
            } else if (0.005 <= epsilon_t) {
                phi = 0.85;
            }

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
            console.log("공칭모멘트(M_n) = " + financial1(M_n * 0.0000001).toLocaleString('ko-KR') + "kNm");

            document.getElementById("answer").innerHTML = "<div></div>";
            document.getElementById("answer").innerHTML = "<div><div class='i'>곡률(φ_u) = " + (financial2(phi_u * 100000)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "e-5/mm</div><div class='i'>인장철근 변형률(ε_s) = " + (financial3(epsilon_s)).toLocaleString('ko-KR') + " " + epsilon_sB + "</div><div class='i'>압축철근 변형률(ε_s') = " + financial3(epsilon_s_C).toLocaleString('ko-KR') + " " + epsilon_s_CB + "</div><div class='i'>항복변형률(ε_y) = " + (financial3(epsilon_y)).toLocaleString('ko-KR') + "</div><div class='i' style='color: grey;'>중립축(c) = " + (financial3(c)).toLocaleString('ko-KR') + "mm</div><div class='i'>인장력(T_s) = " + (financial2(T_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c + C_s) = " + (financial2(C_c + C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_c) = " + (financial2(C_c)).toLocaleString('ko-KR') + "N</div><div class='i'>압축력(C_s) = " + (financial2(C_s)).toLocaleString('ko-KR') + "N</div><div class='i'>공칭모멘트(M_n) = " + (financial1(M_n * 0.000001)).toLocaleString('ko-KR') + "kNm</div><div class='i'>강도감소계수(φ)" + (financial3(phi)).toLocaleString('ko-KR') + "</div></div>";
        }

        function momentDomination() {

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
        console.log(console.error());
    }
}