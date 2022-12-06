

class TodoModel {

    constructor () {
        this.todosList = [];
        this.completed = [];
    }

    addTodo (todo) {
        this.todosList.push(todo);
    }

    completeTodo (todo) {
        this.todosList = this.todosList.filter((v) => {
            return v != todo
        });
        this.completed.push(todo);
    }

    deleteTodo (todo) {
        this.completed = this.completed.filter((v) => {return v != todo});
    }

    get todos () {
        return this.todosList;
    }

    get completedTodos () {
        return this.completed;
    }
}



class TodoView {

    constructor () {
        this.model = new TodoModel();
        this.components = {

            ////// header
            header: {
                _content: '<div class="header"></div>',
                title: '<h2 id="title" class="header__title"> ToDo Application</h2>',
                about: '<p id="about" class="header__about"><em>Type some text and press button to add new todo, doubleclick will delete todo</em></p>'
            },


            ////// lists
            list: {
                _content: '<div class="list"></div>',
                wList: '<ul id="wList" class="list__w"></ul>',
                cList: '<ul id="cList" class="list__c"></ul>',
                cHead: '<div id="chead" class="list__ch">Completed: </div>',
                wHead: '<div id="whead" class="list__wh">In process :</div>'
            },

            ///////input area
            input: {
                _content: '<div class="input"></div>',
                inputField: '<input id="inputField" class="input__field" type="text" placeholder="type your task"></input>',
                button: '<div id="button" class="input__button">Add task</div>',
            }

        }
        this.states = {
            inputContent: ''
        }
    }


    init () {
  
        const that = this;
        this.render(this.components);

        const updateRender = () => {
            return $(() => {
                $('#wList').empty();
                $('#cList').empty();
                for (const el of that.model.todos) {
                    $('#wList').append(`<li id="wtd"> ${el} </li>`)
                }
                for (const el of that.model.completedTodos) {
                    $('#cList').append(`<li> ${el} </li>`)
                }
            });
        }

        //set input content from input field by click
        $(document).on('click', '#button', () => {
            if (!$('#inputField').val() || this.model.todos.includes($('#inputField').val() )) {
                return;
            }
            this.states.inputContent = $('#inputField').val();
            this.model.addTodo(this.states.inputContent);
            updateRender();
        })

        //complete todo or delete it
        $(document).on('dblclick', 'li', function () {
            if (this.id === "wtd") {
                $(this).toggleClass('').fadeOut('slow');
                that.model.completeTodo(this.textContent.trim());
            } else {
                that.model.deleteTodo(this.textContent.trim());
            }
            updateRender();
        });
        
        //set input field value from state
        $(() => {
            $('#inputField').val(this.states.inputContent);
        });

        //drop state on focus
        $(document).on('focus', '#inputField', () => {
            this.states.inputContent = '';
            $('#inputField').val(this.states.inputContent);
        })

    }

    render (content) {
        let parent = '';
        for (const item in content) {
            for (const child in content[item]) {
                if (child === '_content') {
                    parent = $(content[item][child]).appendTo('#root');
                    continue;
                }
                $(parent).append(content[item][child]);
            }
        }
    }
}

const view = new TodoView();
view.init();