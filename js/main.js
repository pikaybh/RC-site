let header = "<!-- Use any element to open the sidenav --><header>    <span class='nav_btn material-icons' onclick='openNav()'>menu</span></header><nav id='mySidenav' class='sidenav'>    <a href='javascript:void(0)' class='closebtn' onclick='closeNav()'>&times;</a>    <ul>        <span class='logo'><a class='logo_text' href='/'><span class='material-icons'>home</span> 홈페이지</a></span>        <li><a href='/beam'><span class='material-icons'>border_horizontal</span> 보</a></li>        <li><a href='#'><span class='material-icons'>border_vertical</span> 기둥</a></li>    </ul></nav><!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --><div id='main' onclick='closeNav()'></div>";
let header1 = "<!-- Use any element to open the sidenav --><header><span class='logo-text'>HelloWorld!</span></header>";
let footer = "<footer>32172651유병희 ©&nbsp<span class='copyY' id='copyY'></span></footer>";
if (document.getElementById("header") == null) {
    document.getElementById("header1").innerHTML = header;
} else {
    document.getElementById("header").innerHTML = header;
}
document.getElementById("footer").innerHTML = footer;

var today = new Date();
document.getElementById("copyY").innerHTML = today.getFullYear();

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    if (matchMedia("Screen and (max-width: 600px)").matches) {
        document.getElementById("mySidenav").style.width = "200px";
    } else {
        document.getElementById("mySidenav").style.width = "300px";
    }
    document.getElementById("main").style.width = "100%";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.width = "0";
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