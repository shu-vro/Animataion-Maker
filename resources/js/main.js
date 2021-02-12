const canvas = document.querySelector("canvas");
const cr_b = document.getElementById("create_animation");
const px_pt = document.getElementById("px-pt");
const demo = document.getElementById("demo");
const clear = document.getElementById("clear");
const copy = document.getElementById("copy");
const Name = document.getElementById("name");
const delay = document.getElementById("delay");
const t_fun = document.getElementById("timing_function");
const i_count = document.getElementById("iteration_count");
const duration = document.getElementById("d");
const copy_cont = document.getElementById("output_hidden_for_copying");
const alertBx = document.getElementById("alertBx");
const navBtn = document.querySelector(".nav");
const nav_content = document.querySelector(".content");
const consoleBx = document.querySelector(".console");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let paint = false;
let config = {
    lineWidth: 4,
    color: "#000000",
};
let arr = [];
let animation;
let time,
    or_time = 0,
    ls_time = 0;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", Draw);

canvas.addEventListener("touchstart", (e) => {
    paint = true;
    DrawMobile(e);

    let clock = new Date();
    or_time += clock.getTime();
});
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchmove", DrawMobile);

function startDraw(e) {
    paint = true;
    Draw(e);

    let clock = new Date();
    or_time += clock.getTime();

    navBtn.classList.remove("active");
    nav_content.classList.add("inactive");
}

function endDraw() {
    paint = false;
    ctx.beginPath();
    let clock = new Date();
    ls_time += clock.getTime();

    time = ls_time - or_time;
    if (time < 0) {
        time = 5000;
    }

    duration.value = time / 1000;
}

function Draw(e) {
    if (!paint) {
        return;
    }
    if (px_pt.value == "px") {
        arr.push([e.clientX, e.clientY]);
    } else {
        arr.push([
            (e.clientX / window.innerWidth) * 100,
            (e.clientY / window.innerHeight) * 100,
        ]);
    }
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = config.color;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

function DrawMobile(e) {
    if (!paint) {
        return;
    }
    if (px_pt.value == "px") {
        arr.push([e.changedTouches[0].pageX, e.changedTouches[0].pageY]);
    } else {
        arr.push([
            (e.changedTouches[0].pageX / window.innerWidth) * 100,
            (e.changedTouches[0].pageY / window.innerHeight) * 100,
        ]);
    }
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = config.color;
    ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
}

function getAlert(text) {
    alertBx.textContent = text;
    alertBx.classList.add("active");

    setTimeout(() => {
        alertBx.classList.remove("active");
    }, 2000);
}

demo.addEventListener("click", () => {
    navBtn.classList.toggle("active");
    nav_content.classList.toggle("inactive");

    demo.classList.toggle("on");
    let demoBox = document.createElement("div");
    demoBox.classList.add("demoBox");
    demoBox.style.position = "absolute";
    demoBox.style.width = "100px";
    demoBox.style.height = "100px";
    demoBox.style.background = "black";
    // demoBox.style.animation = `${Name} ${time / 1000}s ${t_fun.value} 1s ${delay.value} forwards`;
    // animation: name duration timing-function delay iteration-count direction fill-mode;
    demoBox.style.animationName = Name.value;
    demoBox.style.animationDuration = `${d.value || time / 1000}s`;
    demoBox.style.animationTimingFunction = t_fun.value;
    demoBox.style.animationDelay = `${delay.value}s`;
    demoBox.style.animationIterationCount = i_count.value;

    let style = document.createElement("style");
    style.innerHTML = animation;
    demoBox.appendChild(style);

    if (demo.classList.contains("on")) {
        document.body.appendChild(demoBox);
        demo.textContent = "Close Demo";
        getAlert("Releasing Demo");
    } else {
        document.querySelector(".demoBox").remove();
        demo.textContent = "Start Demo";
        navBtn.classList.toggle("active");
        nav_content.classList.toggle("inactive");
    }
});

clear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arr = [];
    animation = "";
    consoleBx.innerHTML = "";
    copy_cont.value = "";
    navBtn.classList.toggle("active");
    nav_content.classList.toggle("inactive");

    if (document.querySelector(".demoBox")) {
        document.querySelector(".demoBox").remove();
        demo.textContent = "Start Demo";
    }

    if (consoleBx.classList.contains("shown")) {
        consoleBx.classList.remove("shown");
    }

    Name.value = "animate";
    t_fun.value = "linear";
    delay.value = "0";
    i_count.value = "1";
    getAlert("Clearing Screen...");
});

cr_b.addEventListener("click", () => {
    getAlert(`${Name.value} created 😀`);
    let l = arr.length;
    function creAnim() {
        let result = "";
        for (let i = 0; i < l; i++) {
            let n = ((i / l) * 100).toFixed(3) + "%";
            result += `${n} {
            left: ${arr[i][0]}${px_pt.value};
            top: ${arr[i][1]}${px_pt.value};
            }
        `;
        }
        return result;
    }
    animation = `
    @keyframes ${Name.value} {
        ${creAnim()}
        }
    `;

    if (consoleBx.classList.contains("shown")) {
        consoleBx.classList.remove("shown");
    }

    consoleBx.classList.toggle("shown");
    consoleBx.innerHTML = `
    <div>
        <h3>Animation name: </h3><span>${Name.value}</span> <hr>
    </div>
    <div>
        <h3>Animation Duration: </h3><span>${
            duration.value || time / 1000
        }s</span> <hr>
    </div>
    <div>
        <h3>Animation Timing Function: </h3><span>${t_fun.value}</span> <hr>
    </div>
    <div>
        <h3>Animation Delay: </h3><span>${delay.value}s</span> <hr>
    </div>
    <div>
        <h3>Animation Iteration Count: </h3><span>${i_count.value}</span> <hr>
    </div>
    <div>
        <h3>Animation Direction: </h3><span>Normal</span> <hr>
    </div>
    <div>
        <h3>Animation Fill Mode: </h3><span>Forwards</span> <hr>
    </div>
    `;
});

navBtn.addEventListener("click", (e) => {
    navBtn.classList.toggle("active");
    nav_content.classList.toggle("inactive");
});

copy.addEventListener("click", (e) => {
    getAlert(`${Name.value} copied 🤩`);
    copy_cont.value = `
${animation}

/* COPY THIS PROPERTY TO YOUR SELECTOR */
animation: ${Name.value} ${duration.value || time / 1000}s ${t_fun.value} ${
        delay.value
    }s ${i_count.value} forwards;`;
    copy_cont.select();
    document.execCommand("copy");
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
