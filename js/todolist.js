; (function () {
    "use strict"

	function Task(name, completed, createdAt, updatedAt){
        
        if(!name){
            throw new Error("Task need a required paramenter: name")
        }
        this.name = name
        this.completed = completed || false
        this.createdAt = createdAt || Date.now()
        this.updatedAt = updatedAt || null
	}

	let arrTasks = getSavedData()

    function getSavedData(){
        let taskData = localStorage.getItem("task")
            taskData = JSON.parse(taskData)
            
        return taskData && taskData.length ? taskData :[
            {
                name: "Exemplo 1",
                completed: true,
                createdAt: 1592667375012,
                updatedAt: null
            },
            {
                name: "Exemplo 2",
                createdAt: 1581667345723,
                updatedAt: 1592667325018
            }
        ]
    }

    function setNewData(){
        localStorage.setItem("task", JSON.stringify(arrTasks))
    }
    
    setNewData()
    
    const itemInput = document.getElementById("item-input")
    const todoAddForm = document.getElementById("todo-add")
    const ul = document.getElementById("todo-list")
    const lis = ul.getElementsByTagName("li")


    function generateLiTask(obj) {

        const li = document.createElement("li")
        const p = document.createElement("p")
        const checkButton = document.createElement("button")
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")

        li.className = "todo-item"

        checkButton.className = "button-check"
        checkButton.innerHTML = `
            <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton")

        li.appendChild(checkButton)
        p.className = "task-name"
        p.textContent = obj.name
        li.appendChild(p)

        editButton.className = "fas fa-edit"
        editButton.setAttribute("data-action", "editButton")
        li.appendChild(editButton)


        const containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"
        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        inputEdit.value = obj.name

        containerEdit.appendChild(inputEdit)
        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Edit"
        containerEditButton.setAttribute("data-action", "containerEditButton")
        containerEdit.appendChild(containerEditButton)
        const containerCancelButton = document.createElement("button")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "Cancel"
        containerCancelButton.setAttribute("data-action", "containerCancelButton")
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)

        deleteButton.className = "fas fa-trash-alt"
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(deleteButton)

        return li
    }

    function renderTasks() {
        ul.innerHTML = ""
        arrTasks.forEach(taskObj => {
            ul.appendChild(generateLiTask(taskObj))
        });
    }

    function addTask(taskName) {
        arrTasks.push(new Task(taskName))
        renderTasks()
        setNewData()
    }

    function clickedUl(e) {
        const dataAction = e.target.getAttribute("data-action")
        if (!dataAction) return

        let currentLi = e.target
        while (currentLi.nodeName !== "LI") {
            currentLi = currentLi.parentElement
        }
        const currentLiIndex = [...lis].indexOf(currentLi)

        const actions = {
            editButton: function () {
                const editContainer = currentLi.querySelector(".editContainer");

                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });

                editContainer.style.display = "flex";

            },
            deleteButton: function () {
                arrTasks.splice(currentLiIndex, 1)
                renderTasks()
                setNewData()

            },
            containerEditButton: function () {
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },
            containerCancelButton: function () {
                currentLi.querySelector(".editContainer").removeAttribute("style")
                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            },
            checkButton: function () {
                
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed
                renderTasks()
                setNewData()
            }
        }

        if (actions[dataAction]) {
            actions[dataAction]()
        }
    }

    todoAddForm.addEventListener("submit", function (e) {
        e.preventDefault()
        addTask(itemInput.value)
        renderTasks()

        itemInput.value = ""
        itemInput.focus()
    });

    ul.addEventListener("click", clickedUl)

    renderTasks()

})();