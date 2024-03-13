function runFn() {
    let cmd = $("#function > option:selected").val()
    let args = [...$("#params > input").map((i,el) => el.value)]
    args.forEach((el,i) => {
        if (!isNaN(el)) args[i] = parseInt(el)
        else args[i] = `'${el}'`
    })
    $("#result")[0].innerHTML = ""
    //console.log(args)
    try {
        let res = eval(`${cmd}(${args.join(",")})`)
        //console.log(res)
        //console.log(res[0].toString())
        if (res == "") $("#result")[0].innerHTML = "No results"
        else {
            res.forEach(e => {
                $("#result")[0].innerHTML += JSON.stringify(e) + "<br>"
            })
        }
    } catch (e) {
        $("#result")[0].innerHTML = e
    }
}

function showArgs() {
    let cmd = $("#function > option:selected").val()
    let args = eval(`${cmd}.toString()`).match(/^function [^ ]+( )*\([^\)]*\)/gm)[0]
    args = args.substring(args.indexOf("(")+1,args.length-1).split(",")
    //console.log(cmd)
    //console.log(args)
    $("#params")[0].innerHTML = ""
    for (let i of args) {
        if (i != "") $("#params")[0].innerHTML += `<input type="text" placeholder="${i}">`
        //console.log($("#params")[0].innerHTML)
    }
    document.querySelectorAll("#params > input").forEach(e => {
        e.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                runFn()
            }
        });
    })
}

$(document).ready(function() {
    $("#function").change(showArgs)
    $("#run").click(runFn)
    showArgs()
})