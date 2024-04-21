import {add, show, log} from "../../src/data.js";
const chiaveAdd = document.getElementById("chiaveAdd");
const valueAdd = document.getElementById("valueAdd");
const addBtn = document.getElementById("add");
const chiaveShow = document.getElementById("chiaveShow");
const showBtn = document.getElementById("show");
const logout = document.getElementById("logout");
const contenutochiave = document.getElementById("contenutochiave");
const spinner = document.getElementById("spinner");
const pagina = document.getElementById("pagina");
const emailShow = document.getElementById("emailShow");


window.onload = async() =>{
    const rsp = await log(sessionStorage.getItem("email"),sessionStorage.getItem("token"));
    spinner.classList.add("d-none");
    pagina.classList.remove("d-none");
    emailShow.innerText = sessionStorage.getItem("email");
    if(!rsp){
        window.location.href = "../../cache/";
    }
}

//non funziona correttamente la gestione dei bordi rossi
addBtn.onclick = async() =>{
    if( chiaveAdd.classList.contains("border-danger")){
        chiaveAdd.classList.remove("border-danger");
        valueAdd.classList.remove("border-danger");
    }
    spinner.classList.remove("d-none");
    pagina.classList.add("d-none");
    const rsp = await add(sessionStorage.getItem("token"),chiaveAdd.value, valueAdd.value);
    spinner.classList.add("d-none");
    pagina.classList.remove("d-none");
    if(rsp != "Token non valido" || !rsp){
        chiaveAdd.value =  valueAdd.value = "";
    }else{
        chiaveAdd.classList.add("border-danger");
        valueAdd.classList.add("border-danger");
    }
}
showBtn.onclick = async() =>{
    if( chiaveShow.classList.contains("border-danger")){
        chiaveShow.classList.remove("border-danger");
    }
    spinner.classList.remove("d-none");
    pagina.classList.add("d-none");
    const rsp = await show(sessionStorage.getItem("token"),chiaveShow.value);
    spinner.classList.add("d-none");
    pagina.classList.remove("d-none");
    if(rsp != "Token non valido" || !rsp){
        chiaveShow.value = "";
        contenutochiave.value = "Risultato: "+rsp.value;
    }else{
        chiaveShow.classList.add("border-danger");
    }
}

logout.onclick = () =>{
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    window.location.href = "../../cache/";
}