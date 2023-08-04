const header = document.querySelector("header");
let logoiimg = document.querySelector(".logo-img");

window.addEventListener("scroll",function(){
    header.classList.toggle("sticky",window.scrollY > 0);
    logoiimg.classList.toggle("logoimg",window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");


menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
}

menu.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('open');
}

profilephoto = document.querySelector(".profilephoto");
cardx = document.querySelector(".cardx");
profilephoto.addEventListener("click",function(){
    cardx.classList.toggle('visibilitychange');
});

let profilepic = document.getElementById("profile-pic");
        let inputfile  = document.getElementById("input-file");

        inputfile.onchange = function(){
            profilepic.src = URL.createObjectURL(inputfile.files[0]);
        }