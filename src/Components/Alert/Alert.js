import "./Alert.css";

// Create Elements
const container = document.createElement("div");
const box = document.createElement("div");
const title = document.createElement("h4");
const p = document.createElement("p");
const actions = document.createElement("div");
const cancel = document.createElement("button");
const go = document.createElement("button");

export default class ShowMsg {
    init() {
        //Append Child
        container.classList.add('alertContainer');
        container.classList.add('unactiveAlert');
        container.appendChild(box);
        box.appendChild(title);
        box.appendChild(p);
        box.appendChild(actions);
        actions.appendChild(cancel);
        actions.appendChild(go);
        document.body.appendChild(container);

        //Events
        go.addEventListener("click", () => {
            container.style.opacity = 0;
            setTimeout(() => {
                container.style.display = "none";
            }, 300);
        })
        cancel.addEventListener("click", () => {
            container.style.opacity = 0;
            setTimeout(() => {
                container.style.display = "none";
            }, 300);
        })
    }

    showMsg(data) {
        //Show container
        container.classList.add('activeAlert');
        container.classList.remove('unactiveAlert');
        container.style.display = "block";
        setTimeout(() => {
            container.style.opacity = 1;
        }, 10);

        // Type Conditionals
        cancel.classList.add("hide");
        go.classList.add("goAlertBtn");
        cancel.classList.add("cancelAlertBtn")
        go.classList.add("waves-effect");
        cancel.classList.add("waves-effect");
        if (data.type === 'alert') {
            actions.classList.remove('errorType');
            actions.classList.remove("confirmationType");
            actions.classList.add("primaryType");
        }
        if (data.type === 'error') {
            actions.classList.remove('primaryType');
            actions.classList.remove("confirmationType");
            actions.classList.add("errorType");
        }
        if (data.type === 'confirmation') {
            actions.classList.remove('errorType');
            actions.classList.remove("primaryType");
            actions.classList.add("confirmationType");
            cancel.classList.remove("hide");
        }

        // Add Text Content
        title.textContent = data.title;
        p.innerHTML = data.body;
        cancel.textContent = "Cancelar";
        go.textContent = "Aceptar";

        //Events
        if(data.onConfirm!==undefined) go.addEventListener("click", () => data.onConfirm());
    }
}