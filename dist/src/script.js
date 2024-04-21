import {log,register} from "./data.js";
const form = document.getElementById("form");
const registrati = document.getElementById("registrati");
const login = document.getElementById("login");
const email = document.getElementById("email");
const token = document.getElementById("token");

const templateRegistrazione = `<div class="mb-4">
<h3 class="text-center mb-0">Registrati</h3>
</div>
<div class="mb-4 mt-3">
<input type="email" id="emailReg" class="form-control" placeholder="Inserisci la tua email per registrarti" required/>
</div>
<div class="mb-4 text-center">
<input type="submit" class="btn btn-success btn-block btn-login" id="registrati"/>
<div class="text-center">
<p class="mb-0 mt-4">Procedi al login <button class="btn-custom" id="loginRet">Login</button></p>
</div>
</div>`;

window.onload = async() =>{
    const rsp = await log(sessionStorage.getItem("email"),sessionStorage.getItem("token"));
    if(rsp){
        window.location.href = "./personale";
    }
}

login.onclick = async() =>{
    email.classList.remove("border-danger");
    token.classList.remove("border-danger");
    const rsp = await log(email.value, token.value);
    if(rsp){
        window.location.href = "../cache/personale/";
        sessionStorage.setItem("email", email.value);
        sessionStorage.setItem("token", token.value);
    }else{
        email.classList.add("border-danger");
        token.classList.add("border-danger");
    }
    email.value = token.value = "";
}
registrati.onclick = () =>{
    form.innerHTML = templateRegistrazione;
    const emailReg = document.getElementById("emailReg");
    const registrati = document.getElementById("registrati");

    const retLogin = document.getElementById("loginRet");
    retLogin.onclick = () =>{
        window.location.reload();
    }
    registrati.onclick = async() =>{
        emailReg.classList.remove("border-danger");
        if(emailReg.value != ""){
            await register(emailReg.value);
            emailReg.value =  "";
            window.location.reload();
        }else{
            emailReg.classList.add("border-danger");
        }
        
    }
}