export const log = async(email, token) =>{
    let rsp = await fetch("/.netlify/functions/api/login",{
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            token: token
        })
    })
    rsp = await rsp.json();
    return rsp.login;
}

export const add = async(token, key, value) =>{
    let rsp = await fetch("/.netlify/functions/api/insertData",{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({
            key: key,
            value: value
        })
    })
    rsp = await rsp.json();
    return rsp.result;
}
export const register = async(email) =>{
    let rsp = await fetch("/.netlify/functions/api/register",{
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    })
    rsp = await rsp.json();
    return rsp.result;
}
export const show = async(token, key) =>{
    let rsp = await fetch("/.netlify/functions/api/getData",{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({
            key: key
        })
    })
    rsp = await rsp.json();
    return rsp.result;
}